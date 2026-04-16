package com.tuempresa.vehiculos.repositories;

import com.tuempresa.vehiculos.models.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // Aquí luego agregaremos métodos personalizados, ej:
    // List<Vehicle> findByCategory(String category);
}