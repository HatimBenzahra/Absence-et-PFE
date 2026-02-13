package com.isty.repository.presences;

import com.isty.entity.presences.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeanceRepository extends JpaRepository<Seance, Long> {

    List<Seance> findByEnseignantId(Long enseignantId);

    List<Seance> findByGroupe(String groupe);

    List<Seance> findByDateHeureDebutBetween(LocalDateTime debut, LocalDateTime fin);

    Optional<Seance> findByTokenQR(String tokenQR);

    List<Seance> findByEnseignantIdAndDateHeureDebutBetween(Long enseignantId, LocalDateTime debut, LocalDateTime fin);

    List<Seance> findByMatiere(String matiere);

    List<Seance> findByGroupeAndDateHeureDebutBetween(String groupe, LocalDateTime debut, LocalDateTime fin);
}
