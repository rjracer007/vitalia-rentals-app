package com.tuempresa.vehiculos.models;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    // El email debe ser único, no pueden haber dos usuarios con el mismo correo
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    // ¡NUEVO! Relación Muchos a Muchos para los Favoritos
    @ManyToMany
    @JoinTable(name = "user_favorites", // Nombre de la tabla intermedia que creará Postgres
            joinColumns = @JoinColumn(name = "user_id"), // Llave del usuario
            inverseJoinColumns = @JoinColumn(name = "vehicle_id") // Llave del vehículo
    )
    private Set<Vehicle> favoriteVehicles = new HashSet<>();

    // Constructores
    public User() {
    }

    public User(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    public Set<Vehicle> getFavoriteVehicles() {
        return favoriteVehicles;
    }

    public void setFavoriteVehicles(Set<Vehicle> favoriteVehicles) {
        this.favoriteVehicles = favoriteVehicles;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}