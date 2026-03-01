package com.isty.controller.projets;

import com.isty.dto.projets.CandidatureCreateDTO;
import com.isty.dto.projets.CandidatureDTO;
import com.isty.entity.user.Utilisateur;
import com.isty.service.projets.CandidatureService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
@Tag(name = "Candidatures", description = "Gestion des candidatures aux sujets PFE")
public class CandidatureController {

    private final CandidatureService candidatureService;

    @PostMapping
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<CandidatureDTO> candidater(
            @Valid @RequestBody CandidatureCreateDTO dto,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        CandidatureDTO candidature = candidatureService.candidater(dto, utilisateur.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(candidature);
    }

    @GetMapping("/mes-candidatures")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<List<CandidatureDTO>> getMesCandidatures(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(candidatureService.getMesCandidatures(utilisateur.getId()));
    }

    @GetMapping("/sujet/{sujetId}")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<List<CandidatureDTO>> getCandidaturesForSujet(
            @PathVariable Long sujetId) {
        return ResponseEntity.ok(candidatureService.getCandidaturesForSujet(sujetId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<Void> annulerCandidature(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        candidatureService.annulerCandidature(id, utilisateur.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/accepter")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<CandidatureDTO> accepterCandidature(@PathVariable Long id) {
        return ResponseEntity.ok(candidatureService.accepterCandidature(id));
    }

    @PatchMapping("/{id}/refuser")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<CandidatureDTO> refuserCandidature(@PathVariable Long id) {
        return ResponseEntity.ok(candidatureService.refuserCandidature(id));
    }
}
