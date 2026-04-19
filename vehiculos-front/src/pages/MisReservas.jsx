import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MisReservas = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        // Si no está logueado, lo mandamos al login
        if (!userId || !token) {
            navigate('/login');
            return;
        }

        const fetchReservations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/reservations/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Ordenamos para que las reservas más recientes salgan primero
                    const sortedData = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                    setReservations(sortedData);
                } else {
                    console.error("Error al obtener las reservas");
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [userId, token, navigate]);

    const formatearFecha = (fechaIso) => new Date(fechaIso).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 pt-4 mb-5" style={{ minHeight: '60vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Mis Reservas</h2>
                <Link to="/" className="btn btn-outline-dark">Seguir explorando</Link>
            </div>

            {reservations.length === 0 ? (
                <div className="card border-0 shadow-sm p-5 text-center">
                    <h4 className="fw-bold text-muted mb-3">Aún no tienes viajes programados</h4>
                    <p>¡Explora nuestro catálogo y encuentra el vehículo perfecto para tu próxima aventura!</p>
                    <Link to="/" className="btn btn-warning mt-3 mx-auto" style={{ maxWidth: '200px' }}>Ver vehículos</Link>
                </div>
            ) : (
                <div className="row g-4">
                    {reservations.map((reserva) => (
                        <div className="col-md-6 col-lg-4" key={reserva.id}>
                            <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                                <img
                                    src={reserva.vehicle?.imageUrl}
                                    alt={reserva.vehicle?.name}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'; }}
                                />
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="fw-bold mb-0">{reserva.vehicle?.name}</h5>
                                        <span className="badge bg-success">Confirmada</span>
                                    </div>
                                    <p className="text-muted small mb-4">{reserva.vehicle?.category?.title}</p>

                                    <div className="d-flex justify-content-between text-muted small border-top pt-3">
                                        <div>
                                            <span className="d-block fw-semibold text-dark">Recogida</span>
                                            {formatearFecha(reserva.startDate)}
                                        </div>
                                        <div className="text-end">
                                            <span className="d-block fw-semibold text-dark">Devolución</span>
                                            {formatearFecha(reserva.endDate)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisReservas;