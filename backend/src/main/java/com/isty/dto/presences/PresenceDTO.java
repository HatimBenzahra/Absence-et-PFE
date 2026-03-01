package com.isty.dto.presences;

import com.isty.entity.presences.ModeSaisie;
import com.isty.entity.presences.StatutPresence;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresenceDTO {
    private Long id;
    private String etudiantNom;
    private String etudiantNumero;
    private StatutPresence statut;
    private ModeSaisie modeSaisie;
    private LocalDateTime horodatage;
    private boolean aJustificatif;
    private String seanceMatiere;
    private LocalDateTime seanceDate;
}
