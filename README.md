# 🚗 Vitalia Rentals - Sistema de Reserva de Vehículos

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

Vitalia Rentals es una aplicación web Full-Stack diseñada para la gestión y reserva de vehículos de alquiler. Permite a los usuarios explorar un catálogo de vehículos, verificar disponibilidad por fechas, realizar reservas, guardar favoritos y dejar reseñas. Cuenta con un panel de administración seguro para gestionar el inventario y los roles de usuario.

---

## ✨ Características Principales

### 👤 Para Usuarios (Clientes)
*   **Búsqueda Avanzada:** Filtrado de vehículos disponibles según fechas exactas de recogida y devolución (evitando superposición de reservas).
*   **Gestión de Reservas:** Proceso de checkout seguro y panel para visualizar reservas activas.
*   **Interacción:** Sistema de favoritos y capacidad de dejar reseñas/calificaciones (1 a 5 estrellas) en vehículos alquilados.
*   **Seguridad:** Autenticación mediante JWT y encriptación de contraseñas.

### 🛡️ Para Administradores
*   **Panel de Control (Dashboard):** Rutas protegidas exclusivamente para usuarios con rol `ADMIN`.
*   **Gestión de Inventario (CRUD):** Creación, edición y eliminación de Vehículos, Categorías y Características (Features).
*   **Gestión de Usuarios:** Capacidad para asignar o revocar permisos de administrador a otros usuarios.
*   **Validaciones Robustas:** Formularios blindados contra envíos vacíos o datos inconsistentes.

---

## 🏗️ Arquitectura y Buenas Prácticas

Este proyecto fue refactorizado para cumplir con los más altos estándares de calidad de software:

*   **Arquitectura en 3 Capas (Backend):** Separación estricta de responsabilidades entre `Controllers` (endpoints REST), `Services` (lógica de negocio) y `Repositories` (acceso a datos JPA).
*   **Patrón DTO (Data Transfer Object):** Implementado en todos los módulos (Vehículos, Reservas, Reseñas, Favoritos) para evitar exponer entidades completas de la base de datos, previniendo recursividad infinita y optimizando la carga de red.
*   **Seguridad a Nivel de Rutas:** Configuración de `Spring Security` en el backend para bloquear peticiones no autorizadas y componentes envoltorios (`AdminRoute`) en React para proteger la interfaz de usuario.
*   **Manejo de Errores:** Respuestas HTTP semánticas (200, 201, 403, 404, 500) y retroalimentación visual clara (is-invalid) en el frontend.

---

## 🛠️ Tecnologías Utilizadas

**Frontend:**
*   React.js (Vite)
*   React Router DOM (Enrutamiento)
*   React DatePicker (Gestión de calendarios)
*   Bootstrap 5 (UI y diseño responsivo)

**Backend:**
*   Java 17
*   Spring Boot 3
*   Spring Security + JWT (JSON Web Tokens)
*   Spring Data JPA (Hibernate)
*   BCrypt (Encriptación de contraseñas)

---

## 🚀 Instalación y Despliegue Local

### Requisitos previos
*   Node.js (v18 o superior)
*   Java JDK 17
*   Maven
*   MySQL Server (o la base de datos que estés usando)

### 1. Configuración del Backend
1. Navega a la carpeta del backend.
2. Abre el archivo `src/main/resources/application.properties` y configura las credenciales de tu base de datos:
   
```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/vitalia_db
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_contraseña
