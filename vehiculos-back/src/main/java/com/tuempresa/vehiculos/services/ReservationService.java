package com.tuempresa.vehiculos.services;

import com.tuempresa.vehiculos.dtos.ReservationDTO;
import com.tuempresa.vehiculos.models.Reservation;
import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.ReservationRepository;
import com.tuempresa.vehiculos.repositories.UserRepository;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VehicleRepository vehicleRepository;

    // 1. Traer reservas de un vehículo (Sirve para bloquear fechas en el calendario
    // de React)
    public List<ReservationDTO> getReservationsByVehicle(Long vehicleId) {
        return reservationRepository.findByVehicleId(vehicleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 2. Traer reservas de un usuario (Para su panel de "Mis Reservas")
    public List<ReservationDTO> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 3. Crear una reserva
    @Transactional
    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
        User user = userRepository.findById(reservationDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Vehicle vehicle = vehicleRepository.findById(reservationDTO.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        // Opcional: Aquí podrías agregar validaciones de "fechas superpuestas" en el
        // futuro

        Reservation reservation = new Reservation();
        reservation.setStartDate(reservationDTO.getStartDate());
        reservation.setEndDate(reservationDTO.getEndDate());
        reservation.setUser(user);
        reservation.setVehicle(vehicle);

        Reservation savedReservation = reservationRepository.save(reservation);
        return convertToDTO(savedReservation);
    }

    // --- MAPPER ---
    private ReservationDTO convertToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setStartDate(reservation.getStartDate());
        dto.setEndDate(reservation.getEndDate());

        if (reservation.getVehicle() != null)
            dto.setVehicleId(reservation.getVehicle().getId());
        if (reservation.getUser() != null)
            dto.setUserId(reservation.getUser().getId());

        return dto;
    }
}