package com.isty.entity.projets;

import com.isty.entity.user.Enseignant;
import com.isty.entity.user.ResponsablePFE;
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
@Table(name = "sujets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sujet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String motsCles;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutSujet statut = StatutSujet.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "validateur_id")
    private ResponsablePFE validateur;

    private String entreprisePartenaire;

    @CreationTimestamp
    private LocalDateTime dateCreation;

    private LocalDateTime dateValidation;

    @OneToMany(mappedBy = "sujet", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Candidature> candidatures = new ArrayList<>();
}
