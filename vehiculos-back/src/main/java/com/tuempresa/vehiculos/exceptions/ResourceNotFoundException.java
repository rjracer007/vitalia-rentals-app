package com.tuempresa.vehiculos.exceptions;

// Esta es una excepción personalizada que lanzaremos cuando algo no exista
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}