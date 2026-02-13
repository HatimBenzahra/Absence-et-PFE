package com.isty.entity.presences;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "justificatifs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Justificatif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String motif;

    private String urlFichier;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutJustificatif statut = StatutJustificatif.EN_ATTENTE;

    private String commentaireValidation;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "presence_id", nullable = false, unique = true)
    private Presence presence;

    @CreationTimestamp
    private LocalDateTime dateDepot;

    private LocalDateTime dateValidation;
}
