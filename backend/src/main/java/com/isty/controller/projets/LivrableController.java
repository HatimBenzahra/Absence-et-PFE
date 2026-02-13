package com.isty.controller.projets;

import com.isty.dto.projets.LivrableCreateDTO;
import com.isty.dto.projets.LivrableDTO;
import com.isty.service.projets.LivrableService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livrables")
@RequiredArgsConstructor
@Tag(name = "Livrables", description = "Dépôt et suivi des livrables PFE")
public class LivrableController {

    private final LivrableService livrableService;

    @PostMapping("/affectation/{affectationId}")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<LivrableDTO> deposerLivrable(
            @PathVariable Long affectationId,
            @Valid @RequestBody LivrableCreateDTO dto) {
        LivrableDTO livrable = livrableService.deposerLivrable(dto, affectationId);
        return ResponseEntity.status(HttpStatus.CREATED).body(livrable);
    }

    @GetMapping("/affectation/{affectationId}")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ENSEIGNANT') or hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<List<LivrableDTO>> getLivrablesForAffectation(
            @PathVariable Long affectationId) {
        return ResponseEntity.ok(livrableService.getLivrablesForAffectation(affectationId));
    }
}
