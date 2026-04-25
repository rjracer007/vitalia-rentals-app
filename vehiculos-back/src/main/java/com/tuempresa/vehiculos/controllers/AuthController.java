package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.Role;
import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.repositories.RoleRepository;
import com.tuempresa.vehiculos.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tuempresa.vehiculos.security.JwtUtil;

// IMPORTANTE: Si usas clases como AuthenticationManager, PasswordEncoder o JwtUtil,
// asegúrate de que sus importaciones ("import ...") estén aquí arriba.

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
    private RoleRepository roleRepository;

    // ==========================================================
    // AQUI INYECTA TUS UTILIDADES DE SEGURIDAD (Descomenta y ajusta)
    // ==========================================================
    // @Autowired
    // private AuthenticationManager authenticationManager;

    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; // O JwtService, según cómo lo hayas llamado
    // ==========================================================

    /**
     * ENDPOINT DE REGISTRO
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User userRequest) {

        // 1. Validar si el correo ya existe
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El correo ya está registrado");
        }

        // 2. Buscar y asignar el rol "USER" por defecto
        Optional<Role> defaultRole = roleRepository.findByName("USER");
        if (defaultRole.isPresent()) {
            userRequest.setRole(defaultRole.get());
        } else {
            return ResponseEntity.internalServerError().body("Error crítico: Rol 'USER' no encontrado en el sistema.");
        }

        // 3. Encriptar la contraseña (Si ya usabas PasswordEncoder, descomenta esto)
        // String encodedPassword = passwordEncoder.encode(userRequest.getPassword());
        // userRequest.setPassword(encodedPassword);

        // 4. Guardar usuario y devolverlo directamente (Esto elimina la advertencia
        // amarilla)
        return ResponseEntity.ok(userRepository.save(userRequest));
    }

    /**
     * ENDPOINT DE LOGIN
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {

        // ==========================================================
        // 1. AUTENTICACIÓN Y GENERACIÓN DEL TOKEN
        // Pega aquí tus líneas que validan la contraseña y generan el JWT.
        // Ejemplo estándar:
        // Authentication auth = authenticationManager.authenticate(
        // new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
        // loginRequest.getPassword())
        // );
        // String token = jwtUtil.generateToken(auth.getName());

        String token = jwtUtil.generateToken(loginRequest.getEmail());
        // 2. Buscar al usuario en la BD para obtener sus datos (Esto elimina el error
        // rojo)
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get(); // Nace la variable "user"

            // 3. Armar el JSON de respuesta para React
            Map<String, Object> response = new HashMap<>();
            response.put("jwt", token);
            response.put("userId", user.getId());
            response.put("userName", user.getFirstName());

            // Verificamos de forma segura el rol
            if (user.getRole() != null) {
                response.put("role", user.getRole().getName());
            } else {
                response.put("role", "USER"); // Respaldo por si hay usuarios viejos sin rol
            }

            return ResponseEntity.ok(response);

        } else {
            return ResponseEntity.badRequest().body("Credenciales incorrectas o usuario no encontrado");
        }
    }
}