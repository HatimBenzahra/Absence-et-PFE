package com.isty.dto.projets;

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
public class SoutenanceCreateDTO {

    @NotNull
    private Long affectationId;

    @NotNull
    private LocalDateTime dateSoutenance;

    private String lieu;

    private String jury;
}
