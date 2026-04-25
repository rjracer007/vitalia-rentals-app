package com.tuempresa.vehiculos.security;

import com.tuempresa.vehiculos.models.User;
import com.tuempresa.vehiculos.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // ¡NUEVO! Inyectamos el repositorio para poder buscar tu rol
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // 1. Buscamos el token en la cabecera
        final String authorizationHeader = request.getHeader("Authorization");

        // 2. Si trae la palabra "Bearer ", extraemos solo el código
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);

            // 3. Verificamos si el token es válido
            if (jwtUtil.validateToken(jwt)) {
                String email = jwtUtil.extractUsername(jwt); // Tu username es el email

                // ¡LA SOLUCIÓN! Buscamos al usuario en la BD
                Optional<User> userOpt = userRepository.findByEmail(email);

                if (userOpt.isPresent()) {
                    User user = userOpt.get();

                    // Extraemos el nombre del rol (Si no tiene, le ponemos USER por defecto)
                    String roleName = user.getRole() != null ? user.getRole().getName() : "USER";

                    // Creamos el "Gafete Oficial" (Authority)
                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(roleName));

                    // 4. Le avisamos a Spring Security pasándole el gafete
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            email, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        chain.doFilter(request, response);
    }
}