package com.tuempresa.vehiculos.repositories;

import com.tuempresa.vehiculos.models.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

        // MAGIA SQL: "Busca vehículos cuyo ID NO ESTÉ en la lista de reservas que se
        // cruzan con estas fechas"
        // ¡Ojo a la primera línea con el LEFT JOIN y la 'c'!
        @Query("SELECT v FROM Vehicle v LEFT JOIN v.category c WHERE " +
                        "v.id NOT IN (" +
                        "  SELECT r.vehicle.id FROM Reservation r " +
                        "  WHERE r.startDate <= :endDate AND r.endDate >= :startDate" +
                        ") " +
                        // Ahora usamos c.title en lugar de v.category.title
                        "AND (:keyword = '' OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')))")
        List<Vehicle> findAvailableVehicles(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("keyword") String keyword);
}