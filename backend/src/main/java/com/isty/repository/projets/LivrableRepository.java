package com.isty.repository.projets;

import com.isty.entity.projets.Livrable;
import com.isty.entity.projets.TypeLivrable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivrableRepository extends JpaRepository<Livrable, Long> {

    List<Livrable> findByAffectationId(Long affectationId);

    List<Livrable> findByAffectationIdAndType(Long affectationId, TypeLivrable type);
}
