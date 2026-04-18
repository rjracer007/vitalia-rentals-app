package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.Review;
import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.ReviewRepository;
import com.tuempresa.vehiculos.repositories.UserRepository;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Obtener todas las reseñas de un vehículo
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Review>> getReviewsByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(reviewRepository.findByVehicleId(vehicleId));
    }

    // 2. Crear una nueva reseña
    @PostMapping("/user/{userId}/vehicle/{vehicleId}")
    public ResponseEntity<?> createReview(
            @PathVariable Long userId,
            @PathVariable Long vehicleId,
            @RequestBody Review reviewRequest) {

        Optional<User> user = userRepository.findById(userId);
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);

        if (user.isPresent() && vehicle.isPresent()) {
            // Le asignamos el usuario y el vehículo a la reseña antes de guardarla
            reviewRequest.setUser(user.get());
            reviewRequest.setVehicle(vehicle.get());

            Review savedReview = reviewRepository.save(reviewRequest);
            return ResponseEntity.ok(savedReview);
        }

        return ResponseEntity.badRequest().body("Usuario o Vehículo no encontrado");
    }
}