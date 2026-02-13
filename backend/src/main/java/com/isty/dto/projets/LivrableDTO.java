package com.isty.dto.projets;

import com.isty.entity.projets.TypeLivrable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LivrableDTO {
    private Long id;
    private TypeLivrable type;
    private String titre;
    private String urlFichier;
    private LocalDateTime dateDepot;
}
