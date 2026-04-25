package com.tuempresa.vehiculos.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private BigDecimal pricePerDay;

    @Column(nullable = false)
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "vehicle_gallery", joinColumns = @JoinColumn(name = "vehicle_id"))
    @Column(name = "image_url")
    private java.util.List<String> gallery = new java.util.ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "vehicle_features", joinColumns = @JoinColumn(name = "vehicle_id"), inverseJoinColumns = @JoinColumn(name = "feature_id"))
    private java.util.Set<Feature> features = new java.util.HashSet<>();

    // vehículo dentro de tu modelo Review
    @OneToMany(mappedBy = "vehicle", cascade = jakarta.persistence.CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore // Opcional, pero recomendado para evitar bucles infinitos
    private java.util.List<Review> reviews = new java.util.ArrayList<>();

    // Asegúrate de que el 'mappedBy' coincida con cómo llamaste al vehículo en tu
    // modelo Reservation
    @OneToMany(mappedBy = "vehicle", cascade = jakarta.persistence.CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore // Previene bucles infinitos
    private java.util.List<Reservation> reservations = new java.util.ArrayList<>();

    // Constructores vacíos exigidos por JPA
    public Vehicle() {
    }

    public Vehicle(String name, String description, BigDecimal pricePerDay, String imageUrl) {
        this.name = name;
        this.description = description;
        this.pricePerDay = pricePerDay;
        this.imageUrl = imageUrl;
    }

    // Getters y Setters

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(BigDecimal pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public java.util.Set<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(java.util.Set<Feature> features) {
        this.features = features;
    }

    public java.util.List<String> getGallery() {
        return gallery;
    }

    public void setGallery(java.util.List<String> gallery) {
        this.gallery = gallery;
    }

    public java.util.List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(java.util.List<Review> reviews) {
        this.reviews = reviews;
    }

    public java.util.List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(java.util.List<Reservation> reservations) {
        this.reservations = reservations;
    }
}