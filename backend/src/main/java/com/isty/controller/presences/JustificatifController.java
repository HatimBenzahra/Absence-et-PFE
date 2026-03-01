package com.isty.controller.presences;

import com.isty.dto.presences.JustificatifCreateDTO;
import com.isty.dto.presences.JustificatifDTO;
import com.isty.entity.user.Utilisateur;
import com.isty.service.presences.JustificatifService;
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
@RequestMapping("/api/justificatifs")
@RequiredArgsConstructor
@Tag(name = "Justificatifs", description = "Dépôt et validation des justificatifs d'absence")
public class JustificatifController {

    private final JustificatifService justificatifService;

    @PostMapping
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<JustificatifDTO> deposerJustificatif(
            @Valid @RequestBody JustificatifCreateDTO dto,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        JustificatifDTO justificatif = justificatifService.deposerJustificatif(dto, utilisateur.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(justificatif);
    }

    @PutMapping("/{id}/valider")
    @PreAuthorize("hasRole('ENSEIGNANT') or hasRole('SECRETARIAT')")
    public ResponseEntity<JustificatifDTO> validerJustificatif(
            @PathVariable Long id,
            @RequestParam boolean accepter,
            @RequestParam(required = false) String commentaire) {
        return ResponseEntity.ok(justificatifService.validerJustificatif(id, accepter, commentaire));
    }

    @GetMapping("/a-valider")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<JustificatifDTO>> getJustificatifsAValider(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(justificatifService.getJustificatifsAValider(utilisateur.getId()));
    }

    @GetMapping("/mes-justificatifs")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<List<JustificatifDTO>> getMesJustificatifs(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(justificatifService.getMesJustificatifs(utilisateur.getId()));
    }

    @GetMapping("/tous")
    @PreAuthorize("hasRole('SECRETARIAT')")
    public ResponseEntity<List<JustificatifDTO>> getAllJustificatifs() {
        return ResponseEntity.ok(justificatifService.getAllJustificatifs());
    }

    @GetMapping("/tous/a-valider")
    @PreAuthorize("hasRole('SECRETARIAT')")
    public ResponseEntity<List<JustificatifDTO>> getAllJustificatifsAValider() {
        return ResponseEntity.ok(justificatifService.getAllJustificatifsAValider());
    }
}
