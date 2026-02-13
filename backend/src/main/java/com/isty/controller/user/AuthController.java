package com.isty.controller.user;

import com.isty.dto.user.JwtResponse;
import com.isty.dto.user.LoginRequest;
import com.isty.dto.user.RegisterRequest;
import com.isty.dto.user.UserDTO;
import com.isty.entity.user.Utilisateur;
import com.isty.service.user.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Endpoints pour l'authentification et l'inscription")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Connexion", description = "Authentifie un utilisateur et retourne un token JWT")
    @ApiResponse(responseCode = "200", description = "Connexion réussie")
    @ApiResponse(responseCode = "401", description = "Identifiants invalides")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterRequest request) {
        Utilisateur utilisateur = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toUserDTO(utilisateur));
    }

    @PostMapping("/register/etudiant")
    public ResponseEntity<UserDTO> registerEtudiant(@Valid @RequestBody RegisterRequest request) {
        Utilisateur utilisateur = authService.registerEtudiant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toUserDTO(utilisateur));
    }

    @PostMapping("/register/enseignant")
    public ResponseEntity<UserDTO> registerEnseignant(@Valid @RequestBody RegisterRequest request) {
        Utilisateur utilisateur = authService.registerEnseignant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toUserDTO(utilisateur));
    }

    private UserDTO toUserDTO(Utilisateur utilisateur) {
        return UserDTO.builder()
                .id(utilisateur.getId())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole())
                .build();
    }
}
