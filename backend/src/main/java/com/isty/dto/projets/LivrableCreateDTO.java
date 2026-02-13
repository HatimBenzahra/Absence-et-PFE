package com.isty.dto.projets;

import com.isty.entity.projets.TypeLivrable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LivrableCreateDTO {

    @NotNull(message = "Le type de livrable est obligatoire")
    private TypeLivrable type;

    private String titre;

    @NotBlank(message = "L'URL du fichier est obligatoire")
    private String urlFichier;

    private String commentaire;
}
