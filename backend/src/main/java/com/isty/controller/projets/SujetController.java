package com.isty.controller.projets;

import com.isty.dto.projets.SujetCreateDTO;
import com.isty.dto.projets.SujetDTO;
import com.isty.entity.user.Utilisateur;
import com.isty.service.projets.SujetService;
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
@RequestMapping("/api/sujets")
@RequiredArgsConstructor
@Tag(name = "Sujets PFE", description = "Gestion des sujets de Projet de Fin d'Études")
public class SujetController {

    private final SujetService sujetService;

    @GetMapping
    public ResponseEntity<List<SujetDTO>> getAllSujetsValides() {
        return ResponseEntity.ok(sujetService.getAllSujetsValides());
    }

    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<List<SujetDTO>> getAllSujetsEnAttente() {
        return ResponseEntity.ok(sujetService.getAllSujetsEnAttente());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SujetDTO> getSujetById(@PathVariable Long id) {
        return ResponseEntity.ok(sujetService.getSujetById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<SujetDTO> createSujet(
            @Valid @RequestBody SujetCreateDTO dto,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        SujetDTO sujet = sujetService.createSujet(dto, utilisateur.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(sujet);
    }

    @PutMapping("/{id}/valider")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<SujetDTO> validerSujet(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(sujetService.validerSujet(id, utilisateur.getId()));
    }

    @PutMapping("/{id}/refuser")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<SujetDTO> refuserSujet(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(sujetService.refuserSujet(id, utilisateur.getId()));
    }

    @GetMapping("/mes-sujets")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<SujetDTO>> getMesSujets(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(sujetService.getMesSujets(utilisateur.getId()));
    }
}
