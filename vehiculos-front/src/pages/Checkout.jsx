import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';

const Checkout = () => {
    const { id } = useParams(); // ID del vehículo
    const location = useLocation();
    const navigate = useNavigate();

    // Recuperamos los datos que nos mandó el VehicleDetail de forma invisible
    const { checkIn, checkOut, vehicleParams } = location.state || {};

    // Recuperamos los datos del usuario logueado
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('jwt');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Si alguien entra a esta URL directo sin pasar por el calendario, lo devolvemos
    if (!checkIn || !checkOut || !vehicleParams) {
        return (
            <div className="container mt-5 text-center">
                <h3>Faltan datos para la reserva</h3>
                <Link to="/" className="btn btn-warning mt-3">Volver al inicio</Link>
            </div>
        );
    }

    // Formateamos las fechas para que se vean bonitas
    const formatearFecha = (fechaIso) => new Date(fechaIso).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Función para confirmar y guardar en la base de datos
    const handleConfirmReservation = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/reservations/user/${userId}/vehicle/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    startDate: checkIn.split('T')[0], // Mandamos solo la fecha YYYY-MM-DD
                    endDate: checkOut.split('T')[0]
                })
            });

            if (response.ok) {
                // ¡CAMBIO AQUÍ! Redirigimos a la página de éxito
                navigate('/reserva-exitosa');
            } else {
                setError("Hubo un problema al procesar tu reserva. Las fechas podrían ya estar ocupadas.");
            }
        } catch (err) {
            setError("Error de conexión con el servidor. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 pt-4 mb-5">
            <h2 className="fw-bold mb-4">Confirma tu Reserva</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {/* Columna Izquierda: Datos del Usuario */}
                <div className="col-lg-7 mb-4">
                    <div className="card border-0 shadow-sm p-4 mb-4">
                        <h4 className="fw-bold mb-4">Tus Datos</h4>
                        <form>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted small">Nombre Registrado</label>
                                    <input type="text" className="form-control" value={userName} disabled />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small">Correo Electrónico</label>
                                    <input type="text" className="form-control" value="correo@oculto.com" disabled />
                                    <div className="form-text">Asociado a tu cuenta.</div>
                                </div>
                                <div className="col-12 mt-4">
                                    <label className="form-label text-muted small">Comentarios adicionales (Opcional)</label>
                                    <textarea className="form-control" rows="2" placeholder="Ej. Necesito silla para bebé..."></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Columna Derecha: Resumen de la Reserva */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-4">Detalle del Viaje</h4>

                        <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                            <img src={vehicleParams.imageUrl} alt={vehicleParams.name} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div className="ms-3">
                                <h6 className="fw-bold mb-0">{vehicleParams.name}</h6>
                                <small className="text-muted">{vehicleParams.category?.title}</small>
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-muted small mb-1">Recogida</p>
                            <p className="fw-semibold text-capitalize">{formatearFecha(checkIn)}</p>
                        </div>

                        <div className="mb-4 pb-3 border-bottom">
                            <p className="text-muted small mb-1">Devolución</p>
                            <p className="fw-semibold text-capitalize">{formatearFecha(checkOut)}</p>
                        </div>

                        <button
                            className="btn w-100 fw-bold py-3 shadow-sm"
                            style={{ backgroundColor: '#27242a', color: '#fff', fontSize: '1.1rem' }}
                            onClick={handleConfirmReservation}
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Confirmar Reserva'}
                        </button>
                        <p className="text-center text-muted small mt-3 mb-0">No se te cobrará nada aún.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;