package com.isty.controller.projets;

import com.isty.dto.projets.AffectationDTO;
import com.isty.entity.user.Utilisateur;
import com.isty.service.projets.AffectationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affectations")
@RequiredArgsConstructor
@Tag(name = "Affectations", description = "Gestion des affectations étudiant-sujet")
public class AffectationController {

    private final AffectationService affectationService;

    @PostMapping("/manuelle")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<AffectationDTO> affecterManuellement(
            @RequestParam Long etudiantId,
            @RequestParam Long sujetId,
            @RequestParam(required = false) Long encadrantId) {
        AffectationDTO affectation = affectationService.affecterManuellement(etudiantId, sujetId, encadrantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(affectation);
    }

    @PostMapping("/automatique")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<List<AffectationDTO>> affecterAutomatiquement() {
        List<AffectationDTO> affectations = affectationService.affecterAutomatiquement();
        return ResponseEntity.status(HttpStatus.CREATED).body(affectations);
    }

    @GetMapping("/mon-pfe")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<AffectationDTO> getMonAffectation(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(affectationService.getMonAffectation(utilisateur.getId()));
    }

    @GetMapping("/mes-encadrements")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<AffectationDTO>> getMesEncadrements(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(affectationService.getMesEncadrements(utilisateur.getId()));
    }

    @PutMapping("/{id}/terminer")
    @PreAuthorize("hasRole('RESPONSABLE_PFE') or hasRole('ENSEIGNANT')")
    public ResponseEntity<AffectationDTO> terminerPFE(@PathVariable Long id) {
        return ResponseEntity.ok(affectationService.terminerPFE(id));
    }
}
