package com.tuempresa.vehiculos.repositories;

import com.tuempresa.vehiculos.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Boot implementará este método automáticamente
    Optional<User> findByEmail(String email);
}