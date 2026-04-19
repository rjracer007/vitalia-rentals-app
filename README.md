# 🚗 Vitalia Rentals - Plataforma de Alquiler de Vehículos

Vitalia Rentals es una aplicación web Fullstack End-to-End para la reserva y gestión de alquiler de vehículos. Construida con una arquitectura moderna que separa el Frontend interactivo del Backend robusto y seguro. 

Este proyecto fue desarrollado a través de metodologías ágiles en 4 Sprints, evolucionando desde un catálogo básico hasta un sistema completo de reservas con notificaciones en tiempo real e integraciones externas.

---

## 🛠️ Tecnologías y Herramientas

**Frontend:**
* React.js (con Vite)
* React Router DOM (Enrutamiento y protección de rutas)
* Bootstrap (Maquetación y UI responsiva)
* React Datepicker & Date-fns (Lógica de calendarios)

**Backend:**
* Java 17+
* Spring Boot 3
* Spring Security & JWT (JSON Web Tokens)
* Spring Data JPA / Hibernate
* JavaMailSender (Integración SMTP)

**Base de Datos & Herramientas:**
* PostgreSQL (Base de datos relacional)
* Postman (Testing de API)
* Git & GitHub (Control de versiones)

---

## 🚀 Funcionalidades y Evolución del Proyecto

### Sprint 1: Catálogo y Estructura Base
* **Listado de Vehículos:** Visualización dinámica de la flota disponible.
* **Gestión de Categorías:** Creación de un sistema de filtrado visual por tipos de vehículos (SUV, Deportivos, Económicos, etc.).
* **Arquitectura de Base de Datos:** Relaciones iniciales (One-to-Many) entre Vehículos y Categorías en PostgreSQL.

### Sprint 2: Seguridad y Administración
* **Autenticación y Autorización:** Implementación de Login y Registro de usuarios con contraseñas encriptadas y generación de Tokens JWT.
* **Protección de Rutas (Filtros):** Configuración de `JwtRequestFilter` en Spring Security para denegar el acceso a usuarios no autorizados.
* **Panel de Administración:** Interfaz privada para la creación, edición y eliminación de vehículos y categorías (Operaciones CRUD).

### Sprint 3: Experiencia de Reserva y Búsqueda
* **Motor de Búsqueda por Fechas:** Algoritmo en el backend que filtra el catálogo en tiempo real descartando vehículos con reservas superpuestas (`LEFT JOIN` y lógica de exclusión).
* **Calendario Interactivo:** Visualización de fechas bloqueadas y disponibles dinámicamente en el detalle del vehículo.
* **Sistema de Favoritos (Wishlist):** Relación Many-to-Many que permite a los usuarios autenticados guardar sus vehículos preferidos.
* **Puntuación y Reseñas:** Sistema interactivo de 5 estrellas para dejar opiniones, calculando el promedio de calificación matemáticamente en tiempo real.
* **Políticas y Redes:** Inserción de bloques de reglas de alquiler e integración nativa de enlaces para compartir en WhatsApp, Facebook y X.

### Sprint 4: Checkout e Integraciones (Final)
* **Flujo de Checkout Seguro:** Interfaz de confirmación de reservas con validación de sesión y pase de parámetros en memoria mediante React Router.
* **Historial del Usuario:** Panel privado (`Mis Reservas`) donde los clientes pueden gestionar y visualizar la información de sus viajes confirmados.
* **Integración con WhatsApp:** Botón flotante global para comunicación directa con soporte.
* **Notificaciones por Correo Electrónico:** Configuración de servidor SMTP para disparar correos automáticos al usuario validando el éxito de su transacción.

---

## ⚙️ Instalación y Configuración Local

### Prerrequisitos
* Java JDK 17 o superior.
* Node.js y npm instalados.
* PostgreSQL instalado y corriendo en el puerto por defecto (5432).

### 1. Configuración de la Base de Datos
Crea una base de datos en PostgreSQL llamada `vitalia_rentals`.

### 2. Configuración del Backend (Spring Boot)
1. Navega a la carpeta del backend.
2. Abre el archivo `src/main/resources/application.properties`.
3. Configura tus credenciales de base de datos y de correo SMTP:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/vitalia_rentals
   spring.datasource.username=TU_USUARIO
   spring.datasource.password=TU_CONTRASEÑA
   
   spring.mail.username=tu_correo@gmail.com
   spring.mail.password=tu_contraseña_de_aplicacion
