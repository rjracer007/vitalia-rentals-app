package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.repositories.UserRepository;
import com.tuempresa.vehiculos.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Inyectamos nuestra nueva clase generadora de Tokens
    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint de REGISTRO (El que ya teníamos)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: El correo ya está registrado.");
        }
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    // ¡NUEVO! Endpoint de LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        // 1. Buscamos al usuario por su correo
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        // 2. Si el usuario existe y las contraseñas coinciden (usando el encoder para
        // desencriptar)
        if (userOptional.isPresent()
                && passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {

            // 3. Generamos el Token JWT
            String token = jwtUtil.generateToken(userOptional.get().getEmail());

            // 4. Se lo enviamos al Frontend junto con el nombre y el ID
            Map<String, Object> response = new HashMap<>(); // Cambiamos String, String por String, Object para aceptar
                                                            // Longs
            response.put("token", token);
            response.put("message", "Login exitoso");
            response.put("name", userOptional.get().getFirstName() + " " + userOptional.get().getLastName());
            response.put("userId", userOptional.get().getId()); // ¡NUEVO! Le enviamos el ID a React

            return ResponseEntity.ok(response);
        }

        // Si falla, devolvemos un error 401 (No autorizado)
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Credenciales incorrectas. Verifica tu correo y contraseña.");
    }
}