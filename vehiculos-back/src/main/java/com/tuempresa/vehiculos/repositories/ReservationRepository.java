package com.tuempresa.vehiculos.repositories;

import com.tuempresa.vehiculos.models.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Método mágico de Spring Data para buscar todas las reservas de un auto
    // específico
    List<Reservation> findByVehicleId(Long vehicleId);

    List<Reservation> findByUserId(Long userId);
}