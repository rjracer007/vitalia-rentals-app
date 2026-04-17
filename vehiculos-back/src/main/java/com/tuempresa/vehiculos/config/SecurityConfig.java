package com.tuempresa.vehiculos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    // Este Bean nos permite usar BCrypt en cualquier parte de la aplicación
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Aquí configuramos las reglas de acceso
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults()) // Permite conexiones desde React
                .csrf(csrf -> csrf.disable()) // Desactivamos CSRF (necesario para APIs REST)
                .authorizeHttpRequests(auth -> auth
                        // Por ahora, permitimos todo públicamente para no romper lo que hicimos en el
                        // Sprint 1
                        .requestMatchers("/api/vehicles/**", "/api/categories/**", "/api/auth/**").permitAll()
                        .anyRequest().authenticated());
        return http.build();
    }
}