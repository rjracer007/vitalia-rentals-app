package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    // 1. Obtener todos (Ya lo teníamos)
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    // 2. CREAR un nuevo vehículo (NUEVO)
    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }

    // 3. ELIMINAR un vehículo por su ID (NUEVO)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
        // Primero verificamos si existe
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(id);

        if (vehicleOptional.isPresent()) {
            vehicleRepository.deleteById(id);
            return ResponseEntity.ok("Vehículo eliminado exitosamente.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ¡NUEVO! Endpoint para el buscador con fechas
    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchVehicles(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) String keyword) {

        // Convertimos el texto ("2024-12-01") a formato Fecha de Java
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        // Si el keyword viene vacío en lugar de nulo, lo limpiamos
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : "";
        // Llamamos a nuestra super consulta
        List<Vehicle> availableVehicles = vehicleRepository.findAvailableVehicles(start, end, searchKeyword);

        return ResponseEntity.ok(availableVehicles);
    }

    // Endpoint para obtener un solo vehículo por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}