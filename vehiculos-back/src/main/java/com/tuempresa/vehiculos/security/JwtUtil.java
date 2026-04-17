package com.tuempresa.vehiculos.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Llave secreta para firmar los tokens (En un proyecto real iría en el
    // application.properties)
    // Generamos una llave segura automáticamente
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Tiempo de expiración del token (Ej: 24 horas)
    private final long EXPIRATION_TIME = 86400000;

    // Método para crear la pulsera VIP (Token)
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email) // A quién le pertenece
                .setIssuedAt(new Date()) // Fecha de creación
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Fecha de caducidad
                .signWith(key) // Firmado con nuestra llave secreta
                .compact();
    }
}