package com.isty.controller.user;

import com.isty.dto.user.UserDTO;
import com.isty.entity.user.Role;
import com.isty.service.user.AdminService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administration", description = "Gestion des utilisateurs et du systeme")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<UserDTO>> getAllUtilisateurs() {
        return ResponseEntity.ok(adminService.getAllUtilisateurs());
    }

    @GetMapping("/utilisateurs/{id}")
    public ResponseEntity<UserDTO> getUtilisateurById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUtilisateurById(id));
    }

    @PutMapping("/utilisateurs/{id}/role")
    public ResponseEntity<UserDTO> updateRole(@PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity.ok(adminService.updateRole(id, role));
    }

    @DeleteMapping("/utilisateurs/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        adminService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }
}
