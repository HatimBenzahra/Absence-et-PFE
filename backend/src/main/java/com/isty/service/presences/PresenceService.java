package com.isty.service.presences;

import com.isty.dto.presences.PointageManuelDTO;
import com.isty.dto.presences.PointageQRDTO;
import com.isty.dto.presences.PresenceDTO;
import com.isty.entity.presences.ModeSaisie;
import com.isty.entity.presences.Presence;
import com.isty.entity.presences.Seance;
import com.isty.entity.presences.StatutPresence;
import com.isty.entity.user.Etudiant;
import com.isty.exception.BadRequestException;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.presences.PresenceRepository;
import com.isty.repository.presences.SeanceRepository;
import com.isty.repository.user.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresenceService {

    private final PresenceRepository presenceRepository;
    private final SeanceRepository seanceRepository;
    private final EtudiantRepository etudiantRepository;

    @Transactional
    public PresenceDTO pointerParQR(PointageQRDTO dto, Long etudiantId) {
        Seance seance = seanceRepository.findByTokenQR(dto.getTokenQR())
                .orElseThrow(() -> new BadRequestException("Token QR invalide"));

        if (seance.getExpirationQR() != null && seance.getExpirationQR().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Le QR code a expire");
        }

        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new ResourceNotFoundException("Etudiant non trouve avec l'id: " + etudiantId));

        if (presenceRepository.findByEtudiantIdAndSeanceId(etudiantId, seance.getId()).isPresent()) {
            throw new BadRequestException("Presence deja enregistree pour cette seance");
        }

        LocalDateTime now = LocalDateTime.now();
        StatutPresence statut = determinerStatutPresence(seance, now);

        Presence presence = Presence.builder()
                .statut(statut)
                .modeSaisie(ModeSaisie.QR_CODE)
                .horodatage(now)
                .etudiant(etudiant)
                .seance(seance)
                .build();

        presence = presenceRepository.save(presence);
        return toDTO(presence);
    }

    @Transactional
    public List<PresenceDTO> saisirPresencesManuelles(Long seanceId, List<PointageManuelDTO> presences) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Seance non trouvee avec l'id: " + seanceId));

        List<PresenceDTO> result = new ArrayList<>();

        for (PointageManuelDTO dto : presences) {
            Etudiant etudiant = etudiantRepository.findById(dto.getEtudiantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Etudiant non trouve avec l'id: " + dto.getEtudiantId()));

            Presence presence = presenceRepository.findByEtudiantIdAndSeanceId(dto.getEtudiantId(), seanceId)
                    .orElse(Presence.builder()
                            .etudiant(etudiant)
                            .seance(seance)
                            .modeSaisie(ModeSaisie.MANUEL)
                            .build());

            presence.setStatut(dto.getStatut());
            presence.setHorodatage(LocalDateTime.now());
            presence.setModeSaisie(ModeSaisie.MANUEL);

            presence = presenceRepository.save(presence);
            result.add(toDTO(presence));
        }

        return result;
    }

    public List<PresenceDTO> getMesPresences(Long etudiantId) {
        return presenceRepository.findByEtudiantId(etudiantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PresenceDTO> getPresencesSeance(Long seanceId) {
        return presenceRepository.findBySeanceId(seanceId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PresenceDTO> getAllPresences() {
        return presenceRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PresenceDTO> getPresencesParGroupe(String groupe) {
        return presenceRepository.findBySeance_Groupe(groupe)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private StatutPresence determinerStatutPresence(Seance seance, LocalDateTime horodatage) {
        if (horodatage.isAfter(seance.getDateHeureDebut().plusMinutes(15))) {
            return StatutPresence.RETARD;
        }
        return StatutPresence.PRESENT;
    }

    private PresenceDTO toDTO(Presence presence) {
        Etudiant etudiant = presence.getEtudiant();
        String etudiantNom = etudiant != null
                ? etudiant.getNom() + " " + etudiant.getPrenom()
                : null;
        String etudiantNumero = etudiant != null ? etudiant.getNumEtudiant() : null;

        var seance = presence.getSeance();
        String seanceMatiere = seance != null ? seance.getMatiere() : null;
        var seanceDate = seance != null ? seance.getDateHeureDebut() : null;

        return PresenceDTO.builder()
                .id(presence.getId())
                .etudiantNom(etudiantNom)
                .etudiantNumero(etudiantNumero)
                .statut(presence.getStatut())
                .modeSaisie(presence.getModeSaisie())
                .horodatage(presence.getHorodatage())
                .aJustificatif(presence.getJustificatif() != null)
                .seanceMatiere(seanceMatiere)
                .seanceDate(seanceDate)
                .build();
    }
}
