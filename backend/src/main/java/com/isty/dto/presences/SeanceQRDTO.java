package com.isty.dto.presences;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeanceQRDTO {
    private Long seanceId;
    private String tokenQR;
    private LocalDateTime expirationQR;
}
