package com.isty.dto.presences;

import com.isty.entity.presences.StatutJustificatif;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JustificatifDTO {
    private Long id;
    private String motif;
    private String urlFichier;
    private StatutJustificatif statut;
    private LocalDateTime dateDepot;
    private Long presenceId;
    private String commentaireValidation;
}
