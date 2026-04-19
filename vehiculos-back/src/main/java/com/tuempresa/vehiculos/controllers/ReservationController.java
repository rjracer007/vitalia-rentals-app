package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.Reservation;
import com.tuempresa.vehiculos.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.UserRepository;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import com.tuempresa.vehiculos.services.EmailService;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    // Endpoint para obtener las reservas de un vehículo específico
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Reservation>> getReservationsByVehicle(@PathVariable Long vehicleId) {
        List<Reservation> reservations = reservationRepository.findByVehicleId(vehicleId);
        return ResponseEntity.ok(reservations);
    }

    @PostMapping("/user/{userId}/vehicle/{vehicleId}")
    public ResponseEntity<?> createReservation(
            @PathVariable Long userId,
            @PathVariable Long vehicleId,
            @RequestBody Reservation reservationRequest) {

        Optional<User> user = userRepository.findById(userId);
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);

        if (user.isPresent() && vehicle.isPresent()) {
            reservationRequest.setUser(user.get());
            reservationRequest.setVehicle(vehicle.get());

            Reservation savedReservation = reservationRepository.save(reservationRequest);

            // ¡NUEVO! Disparamos el correo electrónico de confirmación (US #35)
            // Nota: Asegúrate de que el usuario tenga un campo de email en tu modelo User.
            // Si en tu modelo el campo se llama 'email', úsalo. Aquí asumo que existe
            // getEmail().
            try {
                emailService.sendReservationEmail(
                        user.get().getEmail(),
                        user.get().getFirstName(),
                        vehicle.get().getName(),
                        savedReservation.getStartDate().toString(),
                        savedReservation.getEndDate().toString());
            } catch (Exception e) {
                System.out.println("Error al enviar el correo: " + e.getMessage());
                // No rompemos la reserva si falla el correo, solo lo avisamos en consola
            }

            return ResponseEntity.ok(savedReservation);
        }

        return ResponseEntity.badRequest().body("Usuario o Vehículo no encontrado");
    }

    // ¡NUEVO! Endpoint para obtener las reservas de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Long userId) {
        List<Reservation> userReservations = reservationRepository.findByUserId(userId);
        return ResponseEntity.ok(userReservations);
    }

    @Autowired
    private EmailService emailService; // ¡NUEVO!
}