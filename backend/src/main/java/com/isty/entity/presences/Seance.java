package com.isty.entity.presences;

import com.isty.entity.user.Enseignant;
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
@Table(name = "seances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String matiere;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeSeance typeSeance;

    @Column(nullable = false)
    private LocalDateTime dateHeureDebut;

    @Column(nullable = false)
    private LocalDateTime dateHeureFin;

    private String groupe;

    private String salle;

    @Column(unique = true)
    private String tokenQR;

    private LocalDateTime expirationQR;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @OneToMany(mappedBy = "seance", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Presence> presences = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime dateCreation;
}
