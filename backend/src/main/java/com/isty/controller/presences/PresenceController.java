package com.isty.controller.presences;

import com.isty.dto.presences.PointageManuelDTO;
import com.isty.dto.presences.PointageQRDTO;
import com.isty.dto.presences.PresenceDTO;
import com.isty.entity.user.Utilisateur;
import com.isty.service.presences.PresenceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presences")
@RequiredArgsConstructor
@Tag(name = "Présences", description = "Pointage et suivi des présences")
public class PresenceController {

    private final PresenceService presenceService;

    @PostMapping("/pointer")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<PresenceDTO> pointerParQR(
            @Valid @RequestBody PointageQRDTO dto,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(presenceService.pointerParQR(dto, utilisateur.getId()));
    }

    @PostMapping("/seance/{seanceId}/manuel")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<PresenceDTO>> saisirPresencesManuelles(
            @PathVariable Long seanceId,
            @Valid @RequestBody List<PointageManuelDTO> presences) {
        return ResponseEntity.ok(presenceService.saisirPresencesManuelles(seanceId, presences));
    }

    @GetMapping("/mes-presences")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<List<PresenceDTO>> getMesPresences(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(presenceService.getMesPresences(utilisateur.getId()));
    }

    @GetMapping("/seance/{seanceId}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<PresenceDTO>> getPresencesSeance(@PathVariable Long seanceId) {
        return ResponseEntity.ok(presenceService.getPresencesSeance(seanceId));
    }
}
