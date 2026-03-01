package com.isty.dto.projets;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoutenanceDTO {
    private Long id;
    private Long affectationId;
    private String etudiantNom;
    private String sujetTitre;
    private LocalDateTime dateSoutenance;
    private String lieu;
    private String jury;
    private String observations;
}
