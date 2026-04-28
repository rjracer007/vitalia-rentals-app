package com.tuempresa.vehiculos.config; // Ajusta tu paquete

import com.tuempresa.vehiculos.models.Role;
import com.tuempresa.vehiculos.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Si no existe el rol ADMIN, lo creamos
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
            System.out.println("✅ Rol ADMIN creado en la BD.");
        }

        // Si no existe el rol USER, lo creamos
        if (roleRepository.findByName("USER").isEmpty()) {
            Role userRole = new Role();
            userRole.setName("USER");
            roleRepository.save(userRole);
            System.out.println("✅ Rol USER creado en la BD.");
        }
    }
}