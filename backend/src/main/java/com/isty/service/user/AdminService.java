package com.isty.service.user;

import com.isty.dto.user.UserDTO;
import com.isty.entity.user.Role;
import com.isty.entity.user.Utilisateur;
import com.isty.exception.ResourceNotFoundException;
import com.isty.repository.user.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;

    public List<UserDTO> getAllUtilisateurs() {
        return utilisateurRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUtilisateurById(Long id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouve avec l'id: " + id));
        return toDTO(u);
    }

    @Transactional
    public UserDTO updateRole(Long id, Role newRole) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouve avec l'id: " + id));
        u.setRole(newRole);
        u = utilisateurRepository.save(u);
        return toDTO(u);
    }

    @Transactional
    public void deleteUtilisateur(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur non trouve avec l'id: " + id);
        }
        utilisateurRepository.deleteById(id);
    }

    public Map<String, Object> getSystemStats() {
        List<Utilisateur> all = utilisateurRepository.findAll();
        Map<Role, Long> countByRole = all.stream()
                .collect(Collectors.groupingBy(Utilisateur::getRole, Collectors.counting()));

        return Map.of(
                "totalUtilisateurs", (long) all.size(),
                "parRole", countByRole
        );
    }

    private UserDTO toDTO(Utilisateur u) {
        return UserDTO.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .email(u.getEmail())
                .role(u.getRole())
                .build();
    }
}
