package com.isty.repository.user;

import com.isty.entity.user.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {

    Optional<Etudiant> findByEmail(String email);

    Optional<Etudiant> findByNumEtudiant(String numEtudiant);

    boolean existsByNumEtudiant(String numEtudiant);
}
