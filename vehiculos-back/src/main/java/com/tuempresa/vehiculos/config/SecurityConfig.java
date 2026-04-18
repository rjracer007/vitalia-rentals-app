package com.tuempresa.vehiculos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.tuempresa.vehiculos.security.JwtRequestFilter;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter; // ¡NUEVO!

    // Este Bean nos permite usar BCrypt en cualquier parte de la aplicación
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Aquí configuramos las reglas de acceso
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/vehicles/**", "/api/categories/**", "/api/auth/**", "/error",
                                "/api/reservations/**", "/api/reviews/**")
                        .permitAll()
                        .anyRequest().authenticated());

        // ¡NUEVO! Ponemos nuestro filtro personalizado antes del filtro estándar de
        // Spring
        http.addFilterBefore(jwtRequestFilter,
                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}