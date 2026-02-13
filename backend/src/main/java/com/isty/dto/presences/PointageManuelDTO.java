package com.isty.dto.presences;

import com.isty.entity.presences.StatutPresence;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointageManuelDTO {

    @NotNull
    private Long etudiantId;

    @NotNull
    private StatutPresence statut;
}
