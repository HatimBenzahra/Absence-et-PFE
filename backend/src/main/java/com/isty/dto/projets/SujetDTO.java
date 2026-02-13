package com.isty.dto.projets;

import com.isty.entity.projets.StatutSujet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SujetDTO {
    private Long id;
    private String titre;
    private String description;
    private String motsCles;
    private StatutSujet statut;
    private String enseignantNom;
    private LocalDateTime dateCreation;
}
