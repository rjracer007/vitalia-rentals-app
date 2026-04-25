package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.Role;
import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.repositories.RoleRepository;
import com.tuempresa.vehiculos.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // 1. Obtener todos los usuarios (Para mostrarlos en la tabla del panel de
    // Admin)
    // 1. Obtener todos los usuarios (Evitando bucles infinitos de JSON)
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {

        // Transformamos cada entidad User en un simple "Diccionario" (Map)
        List<Map<String, Object>> safeUsers = userRepository.findAll().stream().map(user -> {
            Map<String, Object> userMap = new java.util.HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("firstName", user.getFirstName());
            userMap.put("lastName", user.getLastName());
            userMap.put("email", user.getEmail());

            // Transformamos el rol para evitar traer objetos complejos
            if (user.getRole() != null) {
                Map<String, Object> roleMap = new java.util.HashMap<>();
                roleMap.put("name", user.getRole().getName());
                userMap.put("role", roleMap);
            }

            return userMap;
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(safeUsers);
    }

    // 2. Cambiar el rol de un usuario (El requerimiento del evaluador)
    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newRoleName = request.get("roleName"); // Recibimos "ADMIN" o "USER" desde React

        Optional<User> userOpt = userRepository.findById(id);
        Optional<Role> roleOpt = roleRepository.findByName(newRoleName);

        if (userOpt.isPresent() && roleOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(roleOpt.get()); // Le asignamos el nuevo rol
            userRepository.save(user);
            return ResponseEntity.ok("Rol de " + user.getFirstName() + " actualizado a " + newRoleName);
        }

        return ResponseEntity.badRequest().body("Usuario o Rol no encontrado");
    }
}