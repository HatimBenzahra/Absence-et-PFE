package com.isty.controller.projets;

import com.isty.dto.projets.SoutenanceCreateDTO;
import com.isty.dto.projets.SoutenanceDTO;
import com.isty.service.projets.SoutenanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soutenances")
@RequiredArgsConstructor
@Tag(name = "Soutenances", description = "Gestion des soutenances PFE")
public class SoutenanceController {

    private final SoutenanceService soutenanceService;

    @PostMapping
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<SoutenanceDTO> planifier(@RequestBody SoutenanceCreateDTO dto) {
        SoutenanceDTO soutenance = soutenanceService.planifier(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(soutenance);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SoutenanceDTO>> getAll() {
        return ResponseEntity.ok(soutenanceService.getAll());
    }

    @GetMapping("/affectation/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SoutenanceDTO>> getByAffectation(@PathVariable Long id) {
        return ResponseEntity.ok(soutenanceService.getByAffectation(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RESPONSABLE_PFE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        soutenanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
