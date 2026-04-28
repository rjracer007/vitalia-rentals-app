package com.tuempresa.vehiculos.services;

import com.tuempresa.vehiculos.dtos.VehicleDTO;
import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.UserRepository;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    // ¡TRUCO SENIOR! Inyectamos tu VehicleService para reutilizar su conversor a
    // DTO
    @Autowired
    private VehicleService vehicleService;

    // 1. Obtener la lista de favoritos (y convertirlos a DTO)
    @Transactional(readOnly = true)
    public List<VehicleDTO> getFavoritesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return user.getFavoriteVehicles().stream()
                // Reutilizamos el método que ya tienes en VehicleService para empacar
                .map(vehicle -> vehicleService.convertToDTO(vehicle))
                .collect(Collectors.toList());
    }

    // 2. Agregar a favoritos
    @Transactional
    public void addFavorite(Long userId, Long vehicleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        user.getFavoriteVehicles().add(vehicle);
        userRepository.save(user); // Guarda en la tabla intermedia
    }

    // 3. Quitar de favoritos
    @Transactional
    public void removeFavorite(Long userId, Long vehicleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        user.getFavoriteVehicles().remove(vehicle);
        userRepository.save(user);
    }
}