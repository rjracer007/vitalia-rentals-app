import React from 'react';
import { Link } from 'react-router-dom';

const ReservationSuccess = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="card border-0 shadow-lg p-5 text-center" style={{ maxWidth: '500px', borderRadius: '20px' }}>

                {/* Ícono de Éxito animado (usando un SVG nativo de Bootstrap/HTML) */}
                <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#28a745" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                </div>

                <h2 className="fw-bold mb-3" style={{ color: '#27242a' }}>¡Reserva Confirmada!</h2>

                <p className="text-muted mb-4">
                    Tu vehículo ha sido reservado con éxito. Hemos enviado un correo electrónico con todos los detalles de tu viaje y los pasos a seguir para la recogida.
                </p>

                <div className="d-grid gap-3">
                    <Link
                        to="/"
                        className="btn fw-bold py-3"
                        style={{ backgroundColor: '#e3b155', color: '#fff', borderRadius: '10px' }}
                    >
                        Volver al Catálogo
                    </Link>

                    <Link
                        to="/mis-reservas"
                        className="btn btn-outline-dark fw-bold py-3"
                        style={{ borderRadius: '10px' }}
                    >
                        Ver mis reservas
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ReservationSuccess;