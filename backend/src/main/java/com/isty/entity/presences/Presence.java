package com.isty.entity.presences;

import com.isty.entity.user.Etudiant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "presences", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"etudiant_id", "seance_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Presence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutPresence statut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModeSaisie modeSaisie;

    private LocalDateTime horodatage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seance_id", nullable = false)
    private Seance seance;

    @OneToOne(mappedBy = "presence", cascade = CascadeType.ALL)
    private Justificatif justificatif;
}
