package com.isty.dto.projets;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatureCreateDTO {

    @NotNull(message = "L'ID du sujet est obligatoire")
    private Long sujetId;

    @NotNull(message = "Le rang de preference est obligatoire")
    @Min(value = 1, message = "Le rang de preference doit etre superieur ou egal a 1")
    private Integer rangPreference;

    private String motivation;
}
