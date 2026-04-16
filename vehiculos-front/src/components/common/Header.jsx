import React, { useState } from 'react'; // <-- Importamos useState
import { Link } from 'react-router-dom';

const Header = () => {
    // Estado para controlar si el menú está abierto o cerrado
    const [isNavOpen, setIsNavOpen] = useState(false);

    // Función para alternar el estado
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    return (
        <header className="fixed-top w-100 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            <nav className="navbar navbar-expand-lg navbar-light container px-3 px-lg-0">

                <Link className="navbar-brand fw-bold fs-4" to="/">
                    <span style={{ color: '#27242a' }}>Vitalia</span>
                    <span style={{ color: '#e3b155' }}>Rentals</span>
                </Link>

                {/* 1. Quitamos los data-bs-* y agregamos el evento onClick */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={toggleNav}
                    aria-expanded={isNavOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* 2. Agregamos la clase 'show' de Bootstrap dinámicamente si el estado es true */}
                <div
                    className={`collapse navbar-collapse justify-content-end ${isNavOpen ? 'show' : ''}`}
                    id="navbarContent"
                >
                    <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
                        <Link
                            to="/register"
                            className="btn btn-outline-dark fw-semibold"
                            onClick={() => setIsNavOpen(false)} // Cierra el menú al hacer clic
                        >
                            Crear cuenta
                        </Link>
                        <Link
                            to="/login"
                            className="btn fw-semibold"
                            style={{ backgroundColor: '#e3b155', color: '#fff' }}
                            onClick={() => setIsNavOpen(false)} // Cierra el menú al hacer clic
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>

            </nav>
        </header>
    );
};

export default Header;