package com.isty.dto.projets;

import com.isty.entity.projets.StatutCandidature;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatureDTO {
    private Long id;
    private Long sujetId;
    private String sujetTitre;
    private Long etudiantId;
    private String etudiantNom;
    private Integer rangPreference;
    private String motivation;
    private StatutCandidature statut;
    private LocalDateTime dateCandidature;
}
