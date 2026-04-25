package com.tuempresa.vehiculos.config;

import org.springframework.security.config.Customizer;
import org.springframework.http.HttpMethod;
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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                // Es vital decirle a Spring que no guarde sesiones, que use tokens
                .sessionManagement(session -> session.sessionCreationPolicy(
                        org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Peticiones fantasma de React (CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Rutas públicas (Login y Registro)
                        .requestMatchers("/api/auth/**").permitAll()

                        // 3. Rutas de Lectura públicas (Catálogo)
                        .requestMatchers(HttpMethod.GET, "/api/vehicles/**", "/api/categories/**", "/api/features/**")
                        .permitAll()

                        // 4. Rutas EXCLUSIVAS del Administrador
                        .requestMatchers("/api/users/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/vehicles/**", "/api/categories/**", "/api/features/**")
                        .hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/vehicles/**", "/api/categories/**", "/api/features/**")
                        .hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**", "/api/categories/**",
                                "/api/features/**")
                        .hasAuthority("ADMIN")

                        // 5. Cualquier otra ruta (como Favoritos o Reservas) exige estar logueado
                        .anyRequest().authenticated());

        // ¡LA LÍNEA MÁGICA QUE NOS FALTABA! Ponemos a nuestro guardia en la puerta
        http.addFilterBefore(jwtRequestFilter,
                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}