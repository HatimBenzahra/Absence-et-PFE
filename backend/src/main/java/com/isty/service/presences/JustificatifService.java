package com.isty.service.presences;

import com.isty.dto.presences.JustificatifCreateDTO;
import com.isty.dto.presences.JustificatifDTO;
import com.isty.entity.presences.Justificatif;
import com.isty.entity.presences.Presence;
import com.isty.entity.presences.StatutJustificatif;
import com.isty.entity.presences.StatutPresence;
import com.isty.exception.BadRequestException;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.presences.JustificatifRepository;
import com.isty.repository.presences.PresenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JustificatifService {

    private final JustificatifRepository justificatifRepository;
    private final PresenceRepository presenceRepository;

    @Transactional
    public JustificatifDTO deposerJustificatif(JustificatifCreateDTO dto, Long etudiantId) {
        Presence presence = presenceRepository.findById(dto.getPresenceId())
                .orElseThrow(() -> new ResourceNotFoundException("Presence non trouvee avec l'id: " + dto.getPresenceId()));

        if (!presence.getEtudiant().getId().equals(etudiantId)) {
            throw new BadRequestException("Vous ne pouvez deposer un justificatif que pour vos propres presences");
        }

        if (presence.getStatut() != StatutPresence.ABSENT && presence.getStatut() != StatutPresence.RETARD) {
            throw new BadRequestException("Un justificatif ne peut etre depose que pour une absence ou un retard");
        }

        if (presence.getJustificatif() != null) {
            throw new BadRequestException("Un justificatif existe deja pour cette presence");
        }

        Justificatif justificatif = Justificatif.builder()
                .motif(dto.getMotif())
                .urlFichier(dto.getUrlFichier())
                .statut(StatutJustificatif.EN_ATTENTE)
                .presence(presence)
                .build();

        justificatif = justificatifRepository.save(justificatif);
        return toDTO(justificatif);
    }

    @Transactional
    public JustificatifDTO validerJustificatif(Long justificatifId, boolean accepter, String commentaire) {
        Justificatif justificatif = justificatifRepository.findById(justificatifId)
                .orElseThrow(() -> new ResourceNotFoundException("Justificatif non trouve avec l'id: " + justificatifId));

        if (justificatif.getStatut() != StatutJustificatif.EN_ATTENTE) {
            throw new BadRequestException("Ce justificatif a deja ete traite");
        }

        justificatif.setStatut(accepter ? StatutJustificatif.ACCEPTE : StatutJustificatif.REFUSE);
        justificatif.setCommentaireValidation(commentaire);
        justificatif.setDateValidation(LocalDateTime.now());

        if (accepter) {
            Presence presence = justificatif.getPresence();
            presence.setStatut(StatutPresence.EXCUSE);
            presenceRepository.save(presence);
        }

        justificatif = justificatifRepository.save(justificatif);
        return toDTO(justificatif);
    }

    public List<JustificatifDTO> getJustificatifsAValider(Long enseignantId) {
        return justificatifRepository.findByPresenceSeanceEnseignantIdAndStatut(enseignantId, StatutJustificatif.EN_ATTENTE)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<JustificatifDTO> getMesJustificatifs(Long etudiantId) {
        return justificatifRepository.findByPresenceEtudiantId(etudiantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private JustificatifDTO toDTO(Justificatif justificatif) {
        return JustificatifDTO.builder()
                .id(justificatif.getId())
                .motif(justificatif.getMotif())
                .urlFichier(justificatif.getUrlFichier())
                .statut(justificatif.getStatut())
                .dateDepot(justificatif.getDateDepot())
                .presenceId(justificatif.getPresence().getId())
                .commentaireValidation(justificatif.getCommentaireValidation())
                .build();
    }
}
