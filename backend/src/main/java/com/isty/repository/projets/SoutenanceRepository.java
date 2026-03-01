package com.isty.repository.projets;

import com.isty.entity.projets.Soutenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoutenanceRepository extends JpaRepository<Soutenance, Long> {
    List<Soutenance> findByAffectationId(Long affectationId);
}
