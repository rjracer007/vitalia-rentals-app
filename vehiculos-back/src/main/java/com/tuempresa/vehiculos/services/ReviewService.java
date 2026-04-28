package com.tuempresa.vehiculos.services;

import com.tuempresa.vehiculos.dtos.ReviewDTO;
import com.tuempresa.vehiculos.exceptions.ResourceNotFoundException;
import com.tuempresa.vehiculos.models.Review;
import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.ReviewRepository;
import com.tuempresa.vehiculos.repositories.UserRepository;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private UserRepository userRepository;

    // 1. Obtener reseñas y convertirlas a DTO
    public List<ReviewDTO> getReviewsByVehicle(Long vehicleId) {
        return reviewRepository.findByVehicleId(vehicleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 2. Crear la reseña (¡Toda la lógica está aquí!)
    @Transactional
    public ReviewDTO createReview(Long userId, Long vehicleId, ReviewDTO reviewDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado"));

        // Armamos la Entidad para guardarla en la base de datos
        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setUser(user);
        review.setVehicle(vehicle);

        Review savedReview = reviewRepository.save(review);

        // Devolvemos el DTO limpio para React
        return convertToDTO(savedReview);
    }

    // --- MAPPER: Convierte Entidad a DTO ---
    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());

        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getId());
            // ¡Esta línea extrae el nombre del usuario y soluciona el bug!
            dto.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        }

        if (review.getVehicle() != null) {
            dto.setVehicleId(review.getVehicle().getId());
        }

        return dto;
    }
}