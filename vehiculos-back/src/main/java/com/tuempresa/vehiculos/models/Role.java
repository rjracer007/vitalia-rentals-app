package com.tuempresa.vehiculos.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString; // Importante

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // Aquí guardaremos "USER" o "ADMIN"
    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "role", fetch = jakarta.persistence.FetchType.LAZY)
    private java.util.List<User> users = new java.util.ArrayList<>();

    public Role() {
    }

    public Role(String name) {
        this.name = name;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}