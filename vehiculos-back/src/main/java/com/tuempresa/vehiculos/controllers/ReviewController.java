package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.dtos.ReviewDTO;
import com.tuempresa.vehiculos.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    // Ya no inyectamos repositorios aquí, solo el servicio
    @Autowired
    private ReviewService reviewService;

    // 1. Obtener todas las reseñas de un vehículo
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(reviewService.getReviewsByVehicle(vehicleId));
    }

    // 2. Crear una nueva reseña
    @PostMapping("/user/{userId}/vehicle/{vehicleId}")
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable Long userId,
            @PathVariable Long vehicleId,
            @RequestBody ReviewDTO reviewDTO) {

        // El controlador solo delega la tarea
        ReviewDTO savedReview = reviewService.createReview(userId, vehicleId, reviewDTO);
        return ResponseEntity.ok(savedReview);
    }
}