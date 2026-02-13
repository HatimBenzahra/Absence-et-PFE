package com.isty.controller.presences;

import com.isty.dto.presences.StatistiquesDTO;
import com.isty.service.presences.StatistiquesService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/statistiques")
@RequiredArgsConstructor
@Tag(name = "Statistiques", description = "Statistiques d'assiduité et exports")
public class StatistiquesController {

    private final StatistiquesService statistiquesService;

    @GetMapping("/etudiant/{id}")
    @PreAuthorize("hasAnyRole('ETUDIANT', 'ENSEIGNANT', 'RESPONSABLE_PFE')")
    public ResponseEntity<StatistiquesDTO> getStatistiquesEtudiant(@PathVariable Long id) {
        return ResponseEntity.ok(statistiquesService.getStatistiquesEtudiant(id));
    }

    @GetMapping("/groupe/{groupe}")
    @PreAuthorize("hasAnyRole('ENSEIGNANT', 'RESPONSABLE_PFE')")
    public ResponseEntity<StatistiquesDTO> getStatistiquesGroupe(@PathVariable String groupe) {
        return ResponseEntity.ok(statistiquesService.getStatistiquesGroupe(groupe));
    }

    @GetMapping("/matiere/{matiere}")
    @PreAuthorize("hasAnyRole('ENSEIGNANT', 'RESPONSABLE_PFE')")
    public ResponseEntity<StatistiquesDTO> getStatistiquesMatiere(@PathVariable String matiere) {
        return ResponseEntity.ok(statistiquesService.getStatistiquesMatiere(matiere));
    }

    @GetMapping("/export/csv")
    @PreAuthorize("hasAnyRole('ENSEIGNANT', 'RESPONSABLE_PFE')")
    public ResponseEntity<byte[]> exporterCSV(
            @RequestParam String groupe,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {

        byte[] csv = statistiquesService.exporterCSV(groupe, debut, fin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=presences_" + groupe + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('ENSEIGNANT', 'RESPONSABLE_PFE')")
    public ResponseEntity<byte[]> exporterPDF(
            @RequestParam String groupe,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {

        byte[] pdf = statistiquesService.exporterPDF(groupe, debut, fin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=presences_" + groupe + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
