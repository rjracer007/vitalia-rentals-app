package com.tuempresa.vehiculos.repositories;

import com.tuempresa.vehiculos.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Buscar todas las reseñas de un auto en específico
    List<Review> findByVehicleId(Long vehicleId);
}