package com.isty.service.presences;

import com.isty.dto.presences.StatistiquesDTO;
import com.isty.entity.presences.Presence;
import com.isty.entity.presences.StatutPresence;
import com.isty.repository.presences.PresenceRepository;
import com.isty.repository.presences.SeanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatistiquesService {

    private final PresenceRepository presenceRepository;
    private final SeanceRepository seanceRepository;

    public StatistiquesDTO getStatistiquesEtudiant(Long etudiantId) {
        long totalSeances = presenceRepository.countByEtudiantId(etudiantId);
        long totalPresent = presenceRepository.countByEtudiantIdAndStatut(etudiantId, StatutPresence.PRESENT);
        long totalAbsent = presenceRepository.countByEtudiantIdAndStatut(etudiantId, StatutPresence.ABSENT);
        long totalRetard = presenceRepository.countByEtudiantIdAndStatut(etudiantId, StatutPresence.RETARD);
        long totalExcuse = presenceRepository.countByEtudiantIdAndStatut(etudiantId, StatutPresence.EXCUSE);

        double tauxAssiduite = totalSeances > 0
                ? ((double) (totalPresent + totalExcuse) / totalSeances) * 100
                : 0.0;

        return StatistiquesDTO.builder()
                .totalSeances(totalSeances)
                .totalPresent(totalPresent)
                .totalAbsent(totalAbsent)
                .totalRetard(totalRetard)
                .tauxAssiduite(Math.round(tauxAssiduite * 100.0) / 100.0)
                .build();
    }

    public StatistiquesDTO getStatistiquesGroupe(String groupe) {
        List<Presence> presences = presenceRepository.findByGroupe(groupe);
        return calculerStatistiques(presences);
    }

    public StatistiquesDTO getStatistiquesMatiere(String matiere) {
        List<Presence> presences = presenceRepository.findByMatiere(matiere);
        return calculerStatistiques(presences);
    }

    public byte[] exporterCSV(String groupe, LocalDateTime debut, LocalDateTime fin) {
        List<Presence> presences = presenceRepository.findByGroupe(groupe);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(baos, true, StandardCharsets.UTF_8)) {
            writer.println("Etudiant,Numero,Seance,Matiere,Date,Statut");

            for (Presence p : presences) {
                if (debut != null && p.getSeance().getDateHeureDebut().isBefore(debut)) continue;
                if (fin != null && p.getSeance().getDateHeureDebut().isAfter(fin)) continue;

                writer.printf("%s %s,%s,%s,%s,%s,%s%n",
                        p.getEtudiant().getNom(),
                        p.getEtudiant().getPrenom(),
                        p.getEtudiant().getNumEtudiant(),
                        p.getSeance().getId(),
                        p.getSeance().getMatiere(),
                        p.getSeance().getDateHeureDebut().toLocalDate(),
                        p.getStatut()
                );
            }
        }

        return baos.toByteArray();
    }

    public byte[] exporterPDF(String groupe, LocalDateTime debut, LocalDateTime fin) {
        return exporterCSV(groupe, debut, fin);
    }

    private StatistiquesDTO calculerStatistiques(List<Presence> presences) {
        long totalSeances = presences.size();
        long totalPresent = presences.stream().filter(p -> p.getStatut() == StatutPresence.PRESENT).count();
        long totalAbsent = presences.stream().filter(p -> p.getStatut() == StatutPresence.ABSENT).count();
        long totalRetard = presences.stream().filter(p -> p.getStatut() == StatutPresence.RETARD).count();
        long totalExcuse = presences.stream().filter(p -> p.getStatut() == StatutPresence.EXCUSE).count();

        double tauxAssiduite = totalSeances > 0
                ? ((double) (totalPresent + totalExcuse) / totalSeances) * 100
                : 0.0;

        return StatistiquesDTO.builder()
                .totalSeances(totalSeances)
                .totalPresent(totalPresent)
                .totalAbsent(totalAbsent)
                .totalRetard(totalRetard)
                .tauxAssiduite(Math.round(tauxAssiduite * 100.0) / 100.0)
                .build();
    }
}
