package com.isty.service.presences;

import com.isty.dto.presences.SeanceCreateDTO;
import com.isty.dto.presences.SeanceDTO;
import com.isty.dto.presences.SeanceQRDTO;
import com.isty.entity.presences.Seance;
import com.isty.entity.user.Enseignant;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.presences.SeanceRepository;
import com.isty.repository.user.EnseignantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeanceService {

    private final SeanceRepository seanceRepository;
    private final EnseignantRepository enseignantRepository;

    private static final int QR_VALIDITY_MINUTES = 30;

    @Transactional
    public SeanceDTO creerSeance(SeanceCreateDTO dto, Long enseignantId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouve avec l'id: " + enseignantId));

        Seance seance = Seance.builder()
                .matiere(dto.getMatiere())
                .typeSeance(dto.getTypeSeance())
                .dateHeureDebut(dto.getDateHeureDebut())
                .dateHeureFin(dto.getDateHeureFin())
                .groupe(dto.getGroupe())
                .salle(dto.getSalle())
                .enseignant(enseignant)
                .build();

        seance = seanceRepository.save(seance);
        return toDTO(seance);
    }

    @Transactional
    public SeanceQRDTO genererQRCode(Long seanceId) {
        Seance seance = seanceRepository.findById(seanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Seance non trouvee avec l'id: " + seanceId));

        String token = UUID.randomUUID().toString();
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(QR_VALIDITY_MINUTES);

        seance.setTokenQR(token);
        seance.setExpirationQR(expiration);
        seanceRepository.save(seance);

        return SeanceQRDTO.builder()
                .seanceId(seanceId)
                .tokenQR(token)
                .expirationQR(expiration)
                .build();
    }

    public SeanceDTO getSeanceById(Long id) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seance non trouvee avec l'id: " + id));
        return toDTO(seance);
    }

    public List<SeanceDTO> getMesSeances(Long enseignantId) {
        return seanceRepository.findByEnseignantId(enseignantId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SeanceDTO> getSeancesParGroupe(String groupe) {
        return seanceRepository.findByGroupe(groupe)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SeanceDTO> getSeancesParPeriode(LocalDateTime debut, LocalDateTime fin) {
        return seanceRepository.findByDateHeureDebutBetween(debut, fin)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private SeanceDTO toDTO(Seance seance) {
        String enseignantNom = seance.getEnseignant() != null
                ? seance.getEnseignant().getNom() + " " + seance.getEnseignant().getPrenom()
                : null;

        return SeanceDTO.builder()
                .id(seance.getId())
                .matiere(seance.getMatiere())
                .typeSeance(seance.getTypeSeance())
                .dateHeureDebut(seance.getDateHeureDebut())
                .dateHeureFin(seance.getDateHeureFin())
                .groupe(seance.getGroupe())
                .salle(seance.getSalle())
                .enseignantNom(enseignantNom)
                .build();
    }
}
