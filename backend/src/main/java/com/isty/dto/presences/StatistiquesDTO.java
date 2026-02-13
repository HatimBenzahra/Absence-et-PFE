package com.isty.dto.presences;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatistiquesDTO {
    private long totalSeances;
    private long totalPresent;
    private long totalAbsent;
    private long totalRetard;
    private double tauxAssiduite;
}
