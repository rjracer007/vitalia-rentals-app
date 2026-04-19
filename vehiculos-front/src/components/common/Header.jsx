import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    // Leemos si hay un usuario logueado en el navegador
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('jwt');

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userName');
        navigate('/'); // Lo mandamos al Home
    };

    // Función para obtener las iniciales del usuario (Ej: Juan Perez -> JP)
    const getInitials = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
    };

    return (
        <header className="fixed-top w-100 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            <nav className="navbar navbar-expand-lg navbar-light container px-3 px-lg-0">

                <Link className="navbar-brand fw-bold fs-4" to="/">
                    <span style={{ color: '#27242a' }}>Vitalia</span><span style={{ color: '#e3b155' }}>Rentals</span>
                </Link>

                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
                    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">

                        {/* RENDERIZADO CONDICIONAL */}
                        {token && userName ? (
                            // Vista de Usuario Logueado
                            <div className="d-flex align-items-center gap-3">
                                {/* Opcional: Enlace al Admin temporal */}
                                <Link to="/admin" className="text-decoration-none fw-semibold text-muted small">Panel Admin</Link>

                                <div className="d-flex align-items-center border-start ps-3">
                                    <div
                                        className="rounded-circle text-white d-flex justify-content-center align-items-center fw-bold me-2"
                                        style={{ width: '40px', height: '40px', backgroundColor: '#27242a' }}
                                    >
                                        {getInitials(userName).toUpperCase()}
                                    </div>
                                    <div className="d-flex flex-column me-3">
                                        <span className="small text-muted mb-0 lh-1">Hola,</span>
                                        <span className="fw-bold" style={{ color: '#e3b155' }}>{userName}</span>
                                    </div>

                                    {/* ¡NUEVO BOTÓN! */}
                                    <Link to="/mis-reservas" className="btn btn-outline-dark btn-sm rounded-pill px-3">
                                        Mis Reservas
                                    </Link>

                                    <button onClick={handleLogout} className="btn btn-sm btn-outline-danger fw-semibold">
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Vista de Usuario Anónimo (Invitado)
                            <>
                                <Link to="/register" className="btn btn-outline-dark fw-semibold">Crear cuenta</Link>
                                <Link to="/login" className="btn fw-semibold" style={{ backgroundColor: '#e3b155', color: '#fff' }}>Iniciar sesión</Link>
                            </>
                        )}

                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;