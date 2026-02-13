package com.isty.dto.projets;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SujetCreateDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    private String motsCles;

    private String entreprisePartenaire;
}
