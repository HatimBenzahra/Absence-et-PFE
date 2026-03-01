package com.isty.repository.user;

import com.isty.entity.user.Administratif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministratifRepository extends JpaRepository<Administratif, Long> {
    Optional<Administratif> findByEmail(String email);
}
