package com.isty.repository.projets;

import com.isty.entity.projets.StatutSujet;
import com.isty.entity.projets.Sujet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SujetRepository extends JpaRepository<Sujet, Long> {

    List<Sujet> findByStatut(StatutSujet statut);

    List<Sujet> findByEnseignantId(Long enseignantId);

    List<Sujet> findByStatutAndMotsClesContaining(StatutSujet statut, String motCle);
}
