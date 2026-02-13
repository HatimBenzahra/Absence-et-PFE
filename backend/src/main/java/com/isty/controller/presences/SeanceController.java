package com.isty.controller.presences;

import com.isty.dto.presences.SeanceCreateDTO;
import com.isty.dto.presences.SeanceDTO;
import com.isty.dto.presences.SeanceQRDTO;
import com.isty.entity.user.Utilisateur;
import com.isty.service.presences.SeanceService;
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
@RequestMapping("/api/seances")
@RequiredArgsConstructor
@Tag(name = "Séances", description = "Création et gestion des séances de cours")
public class SeanceController {

    private final SeanceService seanceService;

    @PostMapping
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<SeanceDTO> creerSeance(
            @Valid @RequestBody SeanceCreateDTO dto,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        SeanceDTO seance = seanceService.creerSeance(dto, utilisateur.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(seance);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeanceDTO> getSeanceById(@PathVariable Long id) {
        return ResponseEntity.ok(seanceService.getSeanceById(id));
    }

    @PostMapping("/{id}/qr")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<SeanceQRDTO> genererQRCode(@PathVariable Long id) {
        return ResponseEntity.ok(seanceService.genererQRCode(id));
    }

    @GetMapping("/mes-seances")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<SeanceDTO>> getMesSeances(
            @AuthenticationPrincipal Utilisateur utilisateur) {
        return ResponseEntity.ok(seanceService.getMesSeances(utilisateur.getId()));
    }

    @GetMapping("/groupe/{groupe}")
    public ResponseEntity<List<SeanceDTO>> getSeancesParGroupe(@PathVariable String groupe) {
        return ResponseEntity.ok(seanceService.getSeancesParGroupe(groupe));
    }
}
