package com.isty.service.projets;

import com.isty.dto.projets.SujetCreateDTO;
import com.isty.dto.projets.SujetDTO;
import com.isty.entity.projets.StatutSujet;
import com.isty.entity.projets.Sujet;
import com.isty.entity.user.Enseignant;
import com.isty.entity.user.ResponsablePFE;
import com.isty.exception.BadRequestException;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.projets.SujetRepository;
import com.isty.repository.user.EnseignantRepository;
import com.isty.repository.user.ResponsablePFERepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SujetService {

    private final SujetRepository sujetRepository;
    private final EnseignantRepository enseignantRepository;
    private final ResponsablePFERepository responsablePFERepository;

    public List<SujetDTO> getAllSujetsValides() {
        return sujetRepository.findByStatut(StatutSujet.VALIDE)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SujetDTO getSujetById(Long id) {
        Sujet sujet = sujetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sujet non trouve avec l'id: " + id));
        return toDTO(sujet);
    }

    @Transactional
    public SujetDTO createSujet(SujetCreateDTO dto, Long enseignantId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouve avec l'id: " + enseignantId));

        Sujet sujet = Sujet.builder()
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .motsCles(dto.getMotsCles())
                .entreprisePartenaire(dto.getEntreprisePartenaire())
                .enseignant(enseignant)
                .statut(StatutSujet.EN_ATTENTE)
                .build();

        sujet = sujetRepository.save(sujet);
        return toDTO(sujet);
    }

    @Transactional
    public SujetDTO validerSujet(Long sujetId, Long responsableId) {
        Sujet sujet = sujetRepository.findById(sujetId)
                .orElseThrow(() -> new ResourceNotFoundException("Sujet non trouve avec l'id: " + sujetId));

        if (sujet.getStatut() != StatutSujet.EN_ATTENTE) {
            throw new BadRequestException("Ce sujet n'est pas en attente de validation");
        }

        ResponsablePFE responsable = responsablePFERepository.findById(responsableId)
                .orElseThrow(() -> new ResourceNotFoundException("Responsable PFE non trouve avec l'id: " + responsableId));

        sujet.setStatut(StatutSujet.VALIDE);
        sujet.setValidateur(responsable);
        sujet.setDateValidation(LocalDateTime.now());

        sujet = sujetRepository.save(sujet);
        return toDTO(sujet);
    }

    @Transactional
    public SujetDTO refuserSujet(Long sujetId, Long responsableId) {
        Sujet sujet = sujetRepository.findById(sujetId)
                .orElseThrow(() -> new ResourceNotFoundException("Sujet non trouve avec l'id: " + sujetId));

        if (sujet.getStatut() != StatutSujet.EN_ATTENTE) {
            throw new BadRequestException("Ce sujet n'est pas en attente de validation");
        }

        ResponsablePFE responsable = responsablePFERepository.findById(responsableId)
                .orElseThrow(() -> new ResourceNotFoundException("Responsable PFE non trouve avec l'id: " + responsableId));

        sujet.setStatut(StatutSujet.REFUSE);
        sujet.setValidateur(responsable);
        sujet.setDateValidation(LocalDateTime.now());

        sujet = sujetRepository.save(sujet);
        return toDTO(sujet);
    }

    public List<SujetDTO> getMesSujets(Long enseignantId) {
        return sujetRepository.findByEnseignantId(enseignantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private SujetDTO toDTO(Sujet sujet) {
        String enseignantNom = sujet.getEnseignant() != null
                ? sujet.getEnseignant().getNom() + " " + sujet.getEnseignant().getPrenom()
                : null;

        return SujetDTO.builder()
                .id(sujet.getId())
                .titre(sujet.getTitre())
                .description(sujet.getDescription())
                .motsCles(sujet.getMotsCles())
                .statut(sujet.getStatut())
                .enseignantNom(enseignantNom)
                .dateCreation(sujet.getDateCreation())
                .build();
    }
}
