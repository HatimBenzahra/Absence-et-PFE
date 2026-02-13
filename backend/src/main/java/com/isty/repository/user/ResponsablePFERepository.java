package com.isty.repository.user;

import com.isty.entity.user.ResponsablePFE;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResponsablePFERepository extends JpaRepository<ResponsablePFE, Long> {

    Optional<ResponsablePFE> findByEmail(String email);
}
