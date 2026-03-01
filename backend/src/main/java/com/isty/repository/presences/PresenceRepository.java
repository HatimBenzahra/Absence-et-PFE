package com.isty.repository.presences;

import com.isty.entity.presences.Presence;
import com.isty.entity.presences.StatutPresence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresenceRepository extends JpaRepository<Presence, Long> {

    List<Presence> findByEtudiantId(Long etudiantId);

    List<Presence> findBySeanceId(Long seanceId);

    List<Presence> findBySeance_Groupe(String groupe);

    Optional<Presence> findByEtudiantIdAndSeanceId(Long etudiantId, Long seanceId);

    List<Presence> findByEtudiantIdAndStatut(Long etudiantId, StatutPresence statut);

    @Query("SELECT COUNT(p) FROM Presence p WHERE p.seance.id = :seanceId AND p.statut = :statut")
    long countBySeanceIdAndStatut(@Param("seanceId") Long seanceId, @Param("statut") StatutPresence statut);

    @Query("SELECT COUNT(p) FROM Presence p WHERE p.etudiant.id = :etudiantId")
    long countByEtudiantId(@Param("etudiantId") Long etudiantId);

    @Query("SELECT COUNT(p) FROM Presence p WHERE p.etudiant.id = :etudiantId AND p.statut = :statut")
    long countByEtudiantIdAndStatut(@Param("etudiantId") Long etudiantId, @Param("statut") StatutPresence statut);

    @Query("SELECT p FROM Presence p WHERE p.seance.groupe = :groupe")
    List<Presence> findByGroupe(@Param("groupe") String groupe);

    @Query("SELECT p FROM Presence p WHERE p.seance.matiere = :matiere")
    List<Presence> findByMatiere(@Param("matiere") String matiere);
}
