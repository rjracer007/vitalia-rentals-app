package com.tuempresa.vehiculos.config;

import com.tuempresa.vehiculos.services.UserDetailsServiceImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
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

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public org.springframework.security.authentication.dao.DaoAuthenticationProvider authenticationProvider(
                        UserDetailsServiceImpl userDetailsService,
                        PasswordEncoder passwordEncoder) {

                org.springframework.security.authentication.dao.DaoAuthenticationProvider authProvider = new org.springframework.security.authentication.dao.DaoAuthenticationProvider();

                authProvider.setUserDetailsService(userDetailsService); // ¡Aquí conectamos el puente!
                authProvider.setPasswordEncoder(passwordEncoder); // Y aquí el encriptador
                return authProvider;
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
                                                .requestMatchers(HttpMethod.GET, "/api/vehicles/**",
                                                                "/api/categories/**", "/api/features/**")
                                                .permitAll()

                                                // 4. Rutas EXCLUSIVAS del Administrador (¡AQUÍ ESTÁ EL ARREGLO!)
                                                // Solo bloqueamos el GET de todos los usuarios y el cambio de roles
                                                .requestMatchers(HttpMethod.GET, "/api/users").hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/users/*/role")
                                                .hasAuthority("ADMIN")

                                                // CRUD de vehículos, categorías y características solo para ADMIN
                                                .requestMatchers(HttpMethod.POST, "/api/vehicles/**",
                                                                "/api/categories/**", "/api/features/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/vehicles/**",
                                                                "/api/categories/**", "/api/features/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**",
                                                                "/api/categories/**",
                                                                "/api/features/**")
                                                .hasAuthority("ADMIN")

                                                // 5. Cualquier otra ruta (Favoritos, Reservas, Reseñas) exige estar
                                                // logueado (Sea USER o ADMIN)
                                                .anyRequest().authenticated());

                http.addFilterBefore(jwtRequestFilter,
                                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}