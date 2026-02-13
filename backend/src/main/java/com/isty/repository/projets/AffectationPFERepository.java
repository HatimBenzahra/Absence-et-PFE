package com.isty.repository.projets;

import com.isty.entity.projets.AffectationPFE;
import com.isty.entity.projets.StatutAffectation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AffectationPFERepository extends JpaRepository<AffectationPFE, Long> {

    Optional<AffectationPFE> findByEtudiantId(Long etudiantId);

    Optional<AffectationPFE> findBySujetId(Long sujetId);

    List<AffectationPFE> findByEncadrantId(Long encadrantId);

    List<AffectationPFE> findByStatut(StatutAffectation statut);
}
