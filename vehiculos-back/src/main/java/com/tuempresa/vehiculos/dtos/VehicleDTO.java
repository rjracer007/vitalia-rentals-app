package com.tuempresa.vehiculos.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class VehicleDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal pricePerDay;
    private String imageUrl;
    private List<String> gallery;

    private Map<String, Object> category;

    private List<Map<String, Object>> features;

    // El espacio para las reseñas
    private java.util.List<java.util.Map<String, Object>> reviews;

    private java.util.List<java.util.Map<String, Object>> reservations;

    public VehicleDTO() {
    }

    // --- GETTERS Y SETTERS ---
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

    public Map<String, Object> getCategory() {
        return category;
    }

    public void setCategory(Map<String, Object> category) {
        this.category = category;
    }

    public List<Map<String, Object>> getFeatures() {
        return features;
    }

    public void setFeatures(List<Map<String, Object>> features) {
        this.features = features;
    }

    public java.util.List<String> getGallery() {
        return gallery;
    }

    public void setGallery(java.util.List<String> gallery) {
        this.gallery = gallery;
    }

    public java.util.List<java.util.Map<String, Object>> getReviews() {
        return reviews;
    }

    public void setReviews(java.util.List<java.util.Map<String, Object>> reviews) {
        this.reviews = reviews;
    }

    public java.util.List<java.util.Map<String, Object>> getReservations() {
        return reservations;
    }

    public void setReservations(java.util.List<java.util.Map<String, Object>> reservations) {
        this.reservations = reservations;
    }
}