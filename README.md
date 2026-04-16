# 🚗 Vitalia Rentals - Sistema de Alquiler de Vehículos

Vitalia Rentals es una plataforma moderna para la reserva y gestión de alquiler de vehículos. Este proyecto abarca desde una experiencia de usuario fluida para la visualización del catálogo, hasta un panel administrativo robusto para el manejo del inventario.

## 🎯 Objetivo del Proyecto (Sprint 1)
Desarrollar la estructura base (End-to-End) de la aplicación, implementando el diseño de marca, visualización del catálogo de productos (vehículos) y las funciones de registro y eliminación desde un panel de administración.

## 🛠️ Stack Tecnológico

### Frontend
* **Librería:** React 18
* **Build Tool:** Vite (Optimización y rapidez)
* **Enrutamiento:** React Router DOM (SPA)
* **Estilos:** Bootstrap 5 + CSS Personalizado (Paleta de colores oficial)

### Backend
* **Framework:** Java Spring Boot 3.x
* **API:** Spring Web (API RESTful)
* **ORM:** Spring Data JPA / Hibernate
* **Base de Datos:** PostgreSQL

## ✨ Funcionalidades Actuales
1. **Home (Catálogo):** Visualización de todos los vehículos disponibles extraídos de la base de datos.
2. **Navegación SPA:** Header fijo responsivo con enlaces sin recarga de página.
3. **Panel de Administración (`/admin`):**
   * Creación de nuevos vehículos (POST).
   * Visualización en tiempo real del inventario actual (GET).
   * Eliminación segura de vehículos con alerta de confirmación (DELETE).

---

## 🚀 Instalación y Despliegue Local

### Requisitos Previos
* Node.js (v18+)
* Java JDK (17 o superior)
* PostgreSQL (v14+) instalado y corriendo en el puerto `5432`

### 1. Configuración de la Base de Datos
Crea una base de datos vacía en PostgreSQL llamada `vehiculos_db`. Las tablas se generarán automáticamente gracias a Hibernate.

### 2. Levantar el Backend (Spring Boot)
1. Navega a la carpeta del backend: `cd vehiculos-back`
2. Verifica que las credenciales en `src/main/resources/application.properties` coincidan con tu instalación de Postgres.
3. Ejecuta la aplicación desde tu IDE (VS Code / IntelliJ) o mediante Maven:
   ```bash
   ./mvnw spring-boot:run
