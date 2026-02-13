package com.isty.dto.presences;

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
public class JustificatifCreateDTO {

    @NotNull
    private Long presenceId;

    @NotBlank
    private String motif;

    private String urlFichier;
}
