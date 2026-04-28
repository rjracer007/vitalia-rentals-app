package com.tuempresa.vehiculos.services;

import com.tuempresa.vehiculos.dtos.VehicleDTO;
import com.tuempresa.vehiculos.exceptions.ResourceNotFoundException;
import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    // 1. Obtener todos los vehículos
    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 2. Obtener un vehículo por ID
    public VehicleDTO getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el vehículo con ID: " + id));
        return convertToDTO(vehicle);
    }

    // 3. Crear un vehículo
    public VehicleDTO createVehicle(Vehicle vehicle) {
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return convertToDTO(savedVehicle);
    }

    // 4. Actualizar un vehículo (¡Con soporte para la Galería!)
    public VehicleDTO updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el vehículo con ID: " + id));

        vehicle.setName(vehicleDetails.getName());
        vehicle.setDescription(vehicleDetails.getDescription());
        vehicle.setPricePerDay(vehicleDetails.getPricePerDay());
        vehicle.setImageUrl(vehicleDetails.getImageUrl());
        vehicle.setCategory(vehicleDetails.getCategory());
        vehicle.setFeatures(vehicleDetails.getFeatures());

        // ¡Mapeamos la galería para que no se pierdan las fotos!
        vehicle.setGallery(vehicleDetails.getGallery());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return convertToDTO(updatedVehicle);
    }

    // 5. Eliminar un vehículo
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el vehículo con ID: " + id));
        vehicleRepository.delete(vehicle);
    }

    // --- MAPPER: Convierte la Entidad a un DTO limpio para React ---
    public VehicleDTO convertToDTO(Vehicle vehicle) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(vehicle.getId());
        dto.setName(vehicle.getName());
        dto.setDescription(vehicle.getDescription());
        dto.setPricePerDay(vehicle.getPricePerDay());
        dto.setImageUrl(vehicle.getImageUrl());

        // Empacamos la galería en el DTO
        dto.setGallery(vehicle.getGallery());

        // Empacamos la Categoría
        if (vehicle.getCategory() != null) {
            java.util.Map<String, Object> categoryMap = new java.util.HashMap<>();
            categoryMap.put("id", vehicle.getCategory().getId());
            categoryMap.put("title", vehicle.getCategory().getTitle());
            dto.setCategory(categoryMap);
        }

        // Empacamos las Características
        if (vehicle.getFeatures() != null) {
            java.util.List<java.util.Map<String, Object>> featuresList = vehicle.getFeatures().stream().map(f -> {
                java.util.Map<String, Object> fMap = new java.util.HashMap<>();
                fMap.put("id", f.getId());
                fMap.put("name", f.getName());
                fMap.put("icon", f.getIcon());
                return fMap;
            }).collect(Collectors.toList());
            dto.setFeatures(featuresList);
        }

        // 3. Empacamos las Reseñas
        if (vehicle.getReviews() != null) {
            java.util.List<java.util.Map<String, Object>> reviewsList = vehicle.getReviews().stream().map(r -> {
                java.util.Map<String, Object> revMap = new java.util.HashMap<>();
                revMap.put("id", r.getId());
                revMap.put("rating", r.getRating());
                revMap.put("comment", r.getComment());

                // Si la reseña guarda al usuario que la hizo, lo enviamos para que React
                // muestre el nombre
                if (r.getUser() != null) {
                    revMap.put("userName", r.getUser().getFirstName() + " " + r.getUser().getLastName());
                }

                return revMap;
            }).collect(java.util.stream.Collectors.toList());
            dto.setReviews(reviewsList);
        }

        // 4. Empacamos las Reservas para bloquear el calendario
        if (vehicle.getReservations() != null) {
            java.util.List<java.util.Map<String, Object>> resList = vehicle.getReservations().stream().map(r -> {
                java.util.Map<String, Object> rMap = new java.util.HashMap<>();
                // Enviamos las fechas como texto (String) a React
                rMap.put("startDate", r.getStartDate().toString());
                rMap.put("endDate", r.getEndDate().toString());
                return rMap;
            }).collect(java.util.stream.Collectors.toList());

            dto.setReservations(resList);
        }

        return dto;
    }

    // ¡NUEVO! Método para procesar la búsqueda
    public List<VehicleDTO> searchAvailableVehicles(java.time.LocalDate startDate, java.time.LocalDate endDate,
            String keyword) {
        // Asegurarnos de que el keyword nunca sea nulo para que el SQL no falle
        String searchKeyword = (keyword == null) ? "" : keyword;

        return vehicleRepository.findAvailableVehicles(startDate, endDate, searchKeyword)
                .stream()
                .map(this::convertToDTO) // Usamos el convertidor que ya tienes
                .collect(java.util.stream.Collectors.toList());
    }
}