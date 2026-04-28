package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.dtos.ReservationDTO;
import com.tuempresa.vehiculos.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // 1. Obtener reservas por vehículo (Para el calendario de bloqueos)
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(reservationService.getReservationsByVehicle(vehicleId));
    }

    // 2. Obtener reservas de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    // 3. Crear nueva reserva
    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@RequestBody ReservationDTO reservationDTO) {
        ReservationDTO savedReservation = reservationService.createReservation(reservationDTO);
        return ResponseEntity.ok(savedReservation);
    }
}