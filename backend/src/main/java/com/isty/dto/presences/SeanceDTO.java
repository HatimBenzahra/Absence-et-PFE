package com.isty.dto.presences;

import com.isty.entity.presences.TypeSeance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeanceDTO {
    private Long id;
    private String matiere;
    private TypeSeance typeSeance;
    private LocalDateTime dateHeureDebut;
    private LocalDateTime dateHeureFin;
    private String groupe;
    private String salle;
    private String enseignantNom;
}
