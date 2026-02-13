package com.isty.service.projets;

import com.isty.dto.projets.AffectationDTO;
import com.isty.entity.projets.*;
import com.isty.entity.user.Enseignant;
import com.isty.entity.user.Etudiant;
import com.isty.exception.BadRequestException;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.projets.AffectationPFERepository;
import com.isty.repository.projets.CandidatureRepository;
import com.isty.repository.projets.SujetRepository;
import com.isty.repository.user.EnseignantRepository;
import com.isty.repository.user.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AffectationService {

    private final AffectationPFERepository affectationRepository;
    private final EtudiantRepository etudiantRepository;
    private final SujetRepository sujetRepository;
    private final EnseignantRepository enseignantRepository;
    private final CandidatureRepository candidatureRepository;

    @Transactional
    public AffectationDTO affecterManuellement(Long etudiantId, Long sujetId, Long encadrantId) {
        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new ResourceNotFoundException("Etudiant non trouve avec l'id: " + etudiantId));

        if (affectationRepository.findByEtudiantId(etudiantId).isPresent()) {
            throw new BadRequestException("Cet etudiant a deja une affectation PFE");
        }

        Sujet sujet = sujetRepository.findById(sujetId)
                .orElseThrow(() -> new ResourceNotFoundException("Sujet non trouve avec l'id: " + sujetId));

        if (affectationRepository.findBySujetId(sujetId).isPresent()) {
            throw new BadRequestException("Ce sujet est deja affecte");
        }

        Enseignant encadrant = null;
        if (encadrantId != null) {
            encadrant = enseignantRepository.findById(encadrantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouve avec l'id: " + encadrantId));
        }

        AffectationPFE affectation = AffectationPFE.builder()
                .etudiant(etudiant)
                .sujet(sujet)
                .encadrant(encadrant)
                .statut(StatutAffectation.EN_COURS)
                .build();

        sujet.setStatut(StatutSujet.AFFECTE);
        sujetRepository.save(sujet);

        updateCandidaturesForAffectation(etudiant, sujet);

        affectation = affectationRepository.save(affectation);
        return toDTO(affectation);
    }

    @Transactional
    public List<AffectationDTO> affecterAutomatiquement() {
        List<Candidature> candidatures = candidatureRepository.findAll().stream()
                .filter(c -> c.getStatut() == StatutCandidature.EN_ATTENTE)
                .sorted(Comparator.comparing(Candidature::getRangPreference))
                .collect(Collectors.toList());

        Set<Long> etudiantsAffectes = new HashSet<>();
        Set<Long> sujetsAffectes = new HashSet<>();
        List<AffectationDTO> affectations = new ArrayList<>();

        for (Candidature candidature : candidatures) {
            Long etudiantId = candidature.getEtudiant().getId();
            Long sujetId = candidature.getSujet().getId();

            if (etudiantsAffectes.contains(etudiantId) || sujetsAffectes.contains(sujetId)) {
                continue;
            }

            if (affectationRepository.findByEtudiantId(etudiantId).isPresent() ||
                affectationRepository.findBySujetId(sujetId).isPresent()) {
                continue;
            }

            Sujet sujet = candidature.getSujet();
            Enseignant encadrant = sujet.getEnseignant();

            AffectationPFE affectation = AffectationPFE.builder()
                    .etudiant(candidature.getEtudiant())
                    .sujet(sujet)
                    .encadrant(encadrant)
                    .statut(StatutAffectation.EN_COURS)
                    .build();

            sujet.setStatut(StatutSujet.AFFECTE);
            sujetRepository.save(sujet);

            candidature.setStatut(StatutCandidature.ACCEPTEE);
            candidatureRepository.save(candidature);

            affectation = affectationRepository.save(affectation);

            etudiantsAffectes.add(etudiantId);
            sujetsAffectes.add(sujetId);
            affectations.add(toDTO(affectation));
        }

        rejectRemainingCandidatures(etudiantsAffectes, sujetsAffectes);

        return affectations;
    }

    private void rejectRemainingCandidatures(Set<Long> etudiantsAffectes, Set<Long> sujetsAffectes) {
        candidatureRepository.findAll().stream()
                .filter(c -> c.getStatut() == StatutCandidature.EN_ATTENTE)
                .filter(c -> etudiantsAffectes.contains(c.getEtudiant().getId()) ||
                             sujetsAffectes.contains(c.getSujet().getId()))
                .forEach(c -> {
                    c.setStatut(StatutCandidature.REFUSEE);
                    candidatureRepository.save(c);
                });
    }

    private void updateCandidaturesForAffectation(Etudiant etudiant, Sujet sujet) {
        candidatureRepository.findByEtudiantIdAndSujetId(etudiant.getId(), sujet.getId())
                .ifPresent(c -> {
                    c.setStatut(StatutCandidature.ACCEPTEE);
                    candidatureRepository.save(c);
                });

        candidatureRepository.findByEtudiantId(etudiant.getId()).stream()
                .filter(c -> !c.getSujet().getId().equals(sujet.getId()))
                .filter(c -> c.getStatut() == StatutCandidature.EN_ATTENTE)
                .forEach(c -> {
                    c.setStatut(StatutCandidature.REFUSEE);
                    candidatureRepository.save(c);
                });

        candidatureRepository.findBySujetId(sujet.getId()).stream()
                .filter(c -> !c.getEtudiant().getId().equals(etudiant.getId()))
                .filter(c -> c.getStatut() == StatutCandidature.EN_ATTENTE)
                .forEach(c -> {
                    c.setStatut(StatutCandidature.REFUSEE);
                    candidatureRepository.save(c);
                });
    }

    public AffectationDTO getMonAffectation(Long etudiantId) {
        AffectationPFE affectation = affectationRepository.findByEtudiantId(etudiantId)
                .orElseThrow(() -> new ResourceNotFoundException("Aucune affectation trouvee pour cet etudiant"));
        return toDTO(affectation);
    }

    public List<AffectationDTO> getMesEncadrements(Long enseignantId) {
        return affectationRepository.findByEncadrantId(enseignantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AffectationDTO terminerPFE(Long affectationId) {
        AffectationPFE affectation = affectationRepository.findById(affectationId)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation non trouvee avec l'id: " + affectationId));

        if (affectation.getStatut() != StatutAffectation.EN_COURS) {
            throw new BadRequestException("Cette affectation n'est pas en cours");
        }

        affectation.setStatut(StatutAffectation.TERMINE);
        affectation = affectationRepository.save(affectation);
        return toDTO(affectation);
    }

    private AffectationDTO toDTO(AffectationPFE affectation) {
        String etudiantNom = affectation.getEtudiant().getNom() + " " + affectation.getEtudiant().getPrenom();
        String sujetTitre = affectation.getSujet().getTitre();
        String encadrantNom = affectation.getEncadrant() != null
                ? affectation.getEncadrant().getNom() + " " + affectation.getEncadrant().getPrenom()
                : null;

        return AffectationDTO.builder()
                .id(affectation.getId())
                .etudiantNom(etudiantNom)
                .sujetTitre(sujetTitre)
                .encadrantNom(encadrantNom)
                .statut(affectation.getStatut())
                .dateAffectation(affectation.getDateAffectation())
                .build();
    }
}
