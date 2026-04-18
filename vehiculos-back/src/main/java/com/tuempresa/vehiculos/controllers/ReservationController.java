package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.Reservation;
import com.tuempresa.vehiculos.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    // Endpoint para obtener las reservas de un vehículo específico
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Reservation>> getReservationsByVehicle(@PathVariable Long vehicleId) {
        List<Reservation> reservations = reservationRepository.findByVehicleId(vehicleId);
        return ResponseEntity.ok(reservations);
    }
}