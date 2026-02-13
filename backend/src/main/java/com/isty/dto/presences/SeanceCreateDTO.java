package com.isty.dto.presences;

import com.isty.entity.presences.TypeSeance;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeanceCreateDTO {

    @NotBlank
    private String matiere;

    @NotNull
    private TypeSeance typeSeance;

    @NotNull
    private LocalDateTime dateHeureDebut;

    @NotNull
    private LocalDateTime dateHeureFin;

    private String groupe;

    private String salle;
}
