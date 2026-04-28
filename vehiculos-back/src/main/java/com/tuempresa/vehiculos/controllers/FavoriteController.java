package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.dtos.VehicleDTO;
import com.tuempresa.vehiculos.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    // Ya no usamos Repositorios aquí, solo nuestro nuevo Servicio
    @Autowired
    private FavoriteService favoriteService;

    // 1. Obtener la lista de favoritos
    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(favoriteService.getFavoritesByUserId(userId));
    }

    // 2. Agregar un vehículo a favoritos
    @PostMapping("/{vehicleId}")
    public ResponseEntity<String> addFavorite(@PathVariable Long userId, @PathVariable Long vehicleId) {
        favoriteService.addFavorite(userId, vehicleId);
        return ResponseEntity.ok("Vehículo agregado a favoritos.");
    }

    // 3. Quitar un vehículo de favoritos
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<String> removeFavorite(@PathVariable Long userId, @PathVariable Long vehicleId) {
        favoriteService.removeFavorite(userId, vehicleId);
        return ResponseEntity.ok("Vehículo eliminado de favoritos.");
    }
}