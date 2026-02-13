package com.isty.service.projets;

import com.isty.dto.projets.CandidatureCreateDTO;
import com.isty.dto.projets.CandidatureDTO;
import com.isty.entity.projets.Candidature;
import com.isty.entity.projets.StatutCandidature;
import com.isty.entity.projets.StatutSujet;
import com.isty.entity.projets.Sujet;
import com.isty.entity.user.Etudiant;
import com.isty.exception.BadRequestException;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.projets.AffectationPFERepository;
import com.isty.repository.projets.CandidatureRepository;
import com.isty.repository.projets.SujetRepository;
import com.isty.repository.user.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final SujetRepository sujetRepository;
    private final EtudiantRepository etudiantRepository;
    private final AffectationPFERepository affectationPFERepository;

    @Transactional
    public CandidatureDTO candidater(CandidatureCreateDTO dto, Long etudiantId) {
        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new ResourceNotFoundException("Etudiant non trouve avec l'id: " + etudiantId));

        if (affectationPFERepository.findByEtudiantId(etudiantId).isPresent()) {
            throw new BadRequestException("Cet etudiant a deja une affectation PFE");
        }

        Sujet sujet = sujetRepository.findById(dto.getSujetId())
                .orElseThrow(() -> new ResourceNotFoundException("Sujet non trouve avec l'id: " + dto.getSujetId()));

        if (sujet.getStatut() != StatutSujet.VALIDE) {
            throw new BadRequestException("Ce sujet n'est pas disponible pour candidature");
        }

        if (candidatureRepository.findByEtudiantIdAndSujetId(etudiantId, dto.getSujetId()).isPresent()) {
            throw new BadRequestException("Une candidature existe deja pour ce sujet");
        }

        Candidature candidature = Candidature.builder()
                .etudiant(etudiant)
                .sujet(sujet)
                .rangPreference(dto.getRangPreference())
                .motivation(dto.getMotivation())
                .statut(StatutCandidature.EN_ATTENTE)
                .build();

        candidature = candidatureRepository.save(candidature);
        return toDTO(candidature);
    }

    public List<CandidatureDTO> getMesCandidatures(Long etudiantId) {
        return candidatureRepository.findByEtudiantIdOrderByRangPreferenceAsc(etudiantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CandidatureDTO> getCandidaturesForSujet(Long sujetId) {
        return candidatureRepository.findBySujetId(sujetId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void annulerCandidature(Long candidatureId, Long etudiantId) {
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidature non trouvee avec l'id: " + candidatureId));

        if (!candidature.getEtudiant().getId().equals(etudiantId)) {
            throw new BadRequestException("Cette candidature ne vous appartient pas");
        }

        if (candidature.getStatut() != StatutCandidature.EN_ATTENTE) {
            throw new BadRequestException("Impossible d'annuler une candidature qui n'est plus en attente");
        }

        candidatureRepository.delete(candidature);
    }

    private CandidatureDTO toDTO(Candidature candidature) {
        return CandidatureDTO.builder()
                .id(candidature.getId())
                .sujetId(candidature.getSujet().getId())
                .sujetTitre(candidature.getSujet().getTitre())
                .rangPreference(candidature.getRangPreference())
                .statut(candidature.getStatut())
                .dateCandidature(candidature.getDateCandidature())
                .build();
    }
}
