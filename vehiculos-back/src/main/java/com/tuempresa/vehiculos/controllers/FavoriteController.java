package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.UserRepository;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/users/{userId}/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    // 1. Obtener la lista de favoritos de un usuario (US #25)
    @GetMapping
    public ResponseEntity<Set<Vehicle>> getFavorites(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getFavoriteVehicles());
        }
        return ResponseEntity.notFound().build();
    }

    // 2. Agregar un vehículo a favoritos (US #24)
    @PostMapping("/{vehicleId}")
    public ResponseEntity<String> addFavorite(@PathVariable Long userId, @PathVariable Long vehicleId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);

        if (userOpt.isPresent() && vehicleOpt.isPresent()) {
            User user = userOpt.get();
            user.getFavoriteVehicles().add(vehicleOpt.get()); // Agregamos a la lista
            userRepository.save(user); // Guardamos los cambios
            return ResponseEntity.ok("Vehículo agregado a favoritos.");
        }
        return ResponseEntity.badRequest().body("Usuario o Vehículo no encontrado.");
    }

    // 3. Quitar un vehículo de favoritos (US #24)
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<String> removeFavorite(@PathVariable Long userId, @PathVariable Long vehicleId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);

        if (userOpt.isPresent() && vehicleOpt.isPresent()) {
            User user = userOpt.get();
            user.getFavoriteVehicles().remove(vehicleOpt.get()); // Quitamos de la lista
            userRepository.save(user); // Guardamos los cambios
            return ResponseEntity.ok("Vehículo eliminado de favoritos.");
        }
        return ResponseEntity.badRequest().body("Usuario o Vehículo no encontrado.");
    }
}