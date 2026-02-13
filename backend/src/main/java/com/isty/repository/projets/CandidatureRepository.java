package com.isty.repository.projets;

import com.isty.entity.projets.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    List<Candidature> findByEtudiantId(Long etudiantId);

    List<Candidature> findBySujetId(Long sujetId);

    Optional<Candidature> findByEtudiantIdAndSujetId(Long etudiantId, Long sujetId);

    List<Candidature> findByEtudiantIdOrderByRangPreferenceAsc(Long etudiantId);
}
