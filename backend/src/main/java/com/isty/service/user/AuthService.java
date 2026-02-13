package com.isty.service.user;

import com.isty.dto.user.JwtResponse;
import com.isty.dto.user.LoginRequest;
import com.isty.dto.user.RegisterRequest;
import com.isty.entity.user.*;
import com.isty.exception.BadRequestException;
import com.isty.repository.user.EnseignantRepository;
import com.isty.repository.user.EtudiantRepository;
import com.isty.repository.user.ResponsablePFERepository;
import com.isty.repository.user.UtilisateurRepository;
import com.isty.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final EtudiantRepository etudiantRepository;
    private final EnseignantRepository enseignantRepository;
    private final ResponsablePFERepository responsablePFERepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        Utilisateur utilisateur = (Utilisateur) authentication.getPrincipal();

        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .id(utilisateur.getId())
                .email(utilisateur.getEmail())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .role(utilisateur.getRole())
                .build();
    }

    @Transactional
    public Utilisateur register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un utilisateur avec cet email existe deja");
        }

        return switch (request.getRole()) {
            case ETUDIANT -> registerEtudiant(request);
            case ENSEIGNANT -> registerEnseignant(request);
            case RESPONSABLE_PFE -> registerResponsablePFE(request);
            default -> registerUtilisateur(request);
        };
    }

    @Transactional
    public Etudiant registerEtudiant(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un utilisateur avec cet email existe deja");
        }

        if (request.getNumEtudiant() == null || request.getNumEtudiant().isBlank()) {
            throw new BadRequestException("Le numero etudiant est obligatoire");
        }

        if (etudiantRepository.existsByNumEtudiant(request.getNumEtudiant())) {
            throw new BadRequestException("Un etudiant avec ce numero existe deja");
        }

        Etudiant etudiant = new Etudiant();
        setCommonFields(etudiant, request);
        etudiant.setRole(Role.ETUDIANT);
        etudiant.setNumEtudiant(request.getNumEtudiant());
        etudiant.setGroupe(request.getGroupe());
        etudiant.setFiliere(request.getFiliere());

        return etudiantRepository.save(etudiant);
    }

    @Transactional
    public Enseignant registerEnseignant(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un utilisateur avec cet email existe deja");
        }

        Enseignant enseignant = new Enseignant();
        setCommonFields(enseignant, request);
        enseignant.setRole(Role.ENSEIGNANT);
        enseignant.setDepartement(request.getDepartement());
        enseignant.setGrade(request.getGrade());

        return enseignantRepository.save(enseignant);
    }

    @Transactional
    public ResponsablePFE registerResponsablePFE(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un utilisateur avec cet email existe deja");
        }

        ResponsablePFE responsable = new ResponsablePFE();
        setCommonFields(responsable, request);
        responsable.setRole(Role.RESPONSABLE_PFE);
        responsable.setFonction(request.getFonction());

        return responsablePFERepository.save(responsable);
    }

    private Utilisateur registerUtilisateur(RegisterRequest request) {
        Utilisateur utilisateur = new Utilisateur();
        setCommonFields(utilisateur, request);
        utilisateur.setRole(request.getRole());

        return utilisateurRepository.save(utilisateur);
    }

    private void setCommonFields(Utilisateur utilisateur, RegisterRequest request) {
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setActif(true);
    }
}
