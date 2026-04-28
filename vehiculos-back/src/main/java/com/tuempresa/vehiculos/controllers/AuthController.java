package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.Role;
import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.repositories.RoleRepository;
import com.tuempresa.vehiculos.repositories.UserRepository;
import com.tuempresa.vehiculos.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
    private RoleRepository roleRepository;

    // ==========================================================
    // ¡MOTORES DE SEGURIDAD ACTIVADOS!
    // ==========================================================
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error crítico: Rol 'USER' no encontrado en el sistema. Verifica tu RoleSeeder.");
        }

        // 3. ¡MAGIA SENIOR! Encriptar la contraseña antes de guardar
        String encodedPassword = passwordEncoder.encode(userRequest.getPassword());
        userRequest.setPassword(encodedPassword);

        // 4. Guardar usuario en la base de datos
        userRepository.save(userRequest);

        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    /**
     * ENDPOINT DE LOGIN
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            // 1. Validar credenciales (Spring compara la clave que ingresas con la
            // encriptada)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            // 2. Si las credenciales son correctas, generamos el JWT
            String token = jwtUtil.generateToken(authentication.getName());

            // 3. Buscar al usuario en la BD para obtener sus datos
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // 4. Armar el JSON de respuesta para React
            Map<String, Object> response = new HashMap<>();
            response.put("jwt", token);
            response.put("userId", user.getId());
            response.put("userName", user.getFirstName());

            // Verificamos de forma segura el rol
            if (user.getRole() != null) {
                response.put("role", user.getRole().getName());
            } else {
                response.put("role", "USER");
            }

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            // ¡PROTECCIÓN! Si la clave está mal, entra aquí y devuelve 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales incorrectas o usuario no encontrado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error en el servidor: " + e.getMessage());
        }
    }
}