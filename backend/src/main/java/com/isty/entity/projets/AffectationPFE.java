package com.isty.entity.projets;

import com.isty.entity.user.Enseignant;
import com.isty.entity.user.Etudiant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "affectations_pfe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffectationPFE {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false, unique = true)
    private Etudiant etudiant;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sujet_id", nullable = false, unique = true)
    private Sujet sujet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encadrant_id")
    private Enseignant encadrant;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutAffectation statut = StatutAffectation.EN_COURS;

    @CreationTimestamp
    private LocalDateTime dateAffectation;

    private LocalDateTime dateSoutenancePrevue;

    @OneToMany(mappedBy = "affectation", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Livrable> livrables = new ArrayList<>();
}
