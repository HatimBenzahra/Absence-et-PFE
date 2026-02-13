package com.isty.repository.presences;

import com.isty.entity.presences.Justificatif;
import com.isty.entity.presences.StatutJustificatif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JustificatifRepository extends JpaRepository<Justificatif, Long> {

    List<Justificatif> findByStatut(StatutJustificatif statut);

    @Query("SELECT j FROM Justificatif j WHERE j.presence.etudiant.id = :etudiantId")
    List<Justificatif> findByPresenceEtudiantId(@Param("etudiantId") Long etudiantId);

    @Query("SELECT j FROM Justificatif j WHERE j.presence.seance.enseignant.id = :enseignantId AND j.statut = :statut")
    List<Justificatif> findByPresenceSeanceEnseignantIdAndStatut(
            @Param("enseignantId") Long enseignantId,
            @Param("statut") StatutJustificatif statut);
}
