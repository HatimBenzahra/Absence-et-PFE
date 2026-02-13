package com.isty.dto.projets;

import com.isty.entity.projets.StatutAffectation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffectationDTO {
    private Long id;
    private String etudiantNom;
    private String sujetTitre;
    private String encadrantNom;
    private StatutAffectation statut;
    private LocalDateTime dateAffectation;
}
