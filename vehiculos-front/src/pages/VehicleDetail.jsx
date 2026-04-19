import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, eachDayOfInterval } from 'date-fns';
import es from 'date-fns/locale/es';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Agregamos useNavigate

registerLocale('es', es);

const VehicleDetail = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showShareModal, setShowShareModal] = useState(false);

    // ¡NUEVO! Estados para las Reseñas
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [hoverRating, setHoverRating] = useState(0); // Para el efecto visual de las estrellas
    const [submittingReview, setSubmittingReview] = useState(false);

    // Leemos si hay un usuario logueado
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwt');

    const navigate = useNavigate(); // ¡NUEVO! Hook para navegar
    const [dateRange, setDateRange] = useState([null, null]); // ¡NUEVO! Estado para el rango de fechas
    const [startDate, endDate] = dateRange;

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // 1. Datos del auto
                const vRes = await fetch(`http://localhost:8080/api/vehicles/${id}`);
                if (!vRes.ok) throw new Error("Vehículo no encontrado");
                setVehicle(await vRes.json());

                // 2. Reservas (para el calendario)
                const rRes = await fetch(`http://localhost:8080/api/reservations/vehicle/${id}`);
                if (rRes.ok) {
                    const reservas = await rRes.json();
                    let fechasOcupadas = [];
                    reservas.forEach(reserva => {
                        const start = parseISO(reserva.startDate);
                        const end = parseISO(reserva.endDate);
                        fechasOcupadas = [...fechasOcupadas, ...eachDayOfInterval({ start, end })];
                    });
                    setBlockedDates(fechasOcupadas);
                }

                // ¡NUEVO! 3. Traer las reseñas del auto
                const revRes = await fetch(`http://localhost:8080/api/reviews/vehicle/${id}`);
                if (revRes.ok) {
                    setReviews(await revRes.json());
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, [id]);

    // ¡NUEVO! Función para enviar una reseña
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (newReview.rating === 0) {
            alert("Por favor, selecciona al menos 1 estrella.");
            return;
        }

        setSubmittingReview(true);
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/user/${userId}/vehicle/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newReview)
            });

            if (response.ok) {
                const savedReview = await response.json();
                // Agregamos la nueva reseña a la lista para que se vea INMEDIATAMENTE (Tiempo real)
                setReviews([...reviews, savedReview]);
                setNewReview({ rating: 0, comment: '' }); // Limpiamos el formulario
            } else {
                alert("Hubo un error al guardar tu reseña.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("¡Enlace copiado al portapapeles!");
    };

    // ¡NUEVO! Cálculos matemáticos para el promedio
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "Nuevo";

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;
    if (!vehicle) return <div className="text-center mt-5 h3">Vehículo no encontrado</div>;

    const currentUrl = window.location.href;
    const shareText = `¡Mira este increíble ${vehicle.name} en Vitalia Rentals!`;

    return (
        <div className="container mt-5 mb-5 pt-4 position-relative">

            {/* Modal de Compartir (Oculto por defecto) */}
            {showShareModal && (
                <div className="modal-backdrop bg-dark bg-opacity-50 d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
                    <div className="card shadow-lg border-0 p-4 text-center" style={{ maxWidth: '350px', borderRadius: '15px' }}>
                        <h5 className="fw-bold mb-3">Compartir Vehículo</h5>
                        <div className="d-flex justify-content-center gap-3 mb-4">
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`} target="_blank" rel="noreferrer" className="btn btn-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>📱</a>
                        </div>
                        <button className="btn btn-outline-secondary w-100 mb-2" onClick={handleCopyLink}>Copiar Enlace</button>
                        <button className="btn btn-light w-100 text-danger" onClick={() => setShowShareModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            <Link to="/" className="btn btn-outline-dark mb-4">← Volver al catálogo</Link>

            <div className="row">
                {/* Columna Izquierda */}
                <div className="col-lg-7 mb-4">

                    {/* Tarjeta Principal del Vehículo */}
                    <div className="card border-0 shadow-sm overflow-hidden mb-4">
                        <img src={vehicle.imageUrl} alt={vehicle.name} style={{ width: '100%', height: '400px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'; }} />
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h2 className="fw-bold mb-0">{vehicle.name}</h2>
                                    <span className="badge bg-secondary fs-6 mt-1 me-2">{vehicle.category?.title}</span>

                                    {/* ¡NUEVO! Etiqueta visual del Promedio de Estrellas */}
                                    <span className="badge bg-warning text-dark fs-6 mt-1">
                                        ★ {averageRating} ({reviews.length} valoraciones)
                                    </span>
                                </div>
                                <button className="btn btn-outline-dark rounded-circle" onClick={() => setShowShareModal(true)} title="Compartir">📤</button>
                            </div>
                            <h4 className="text-warning fw-bold mb-4">${vehicle.pricePerDay} <span className="text-muted fs-6 fw-normal">/día</span></h4>
                            <h5 className="fw-bold mt-4">Descripción</h5>
                            <p className="text-muted">{vehicle.description}</p>
                        </div>
                    </div>

                    {/* Políticas */}
                    <div className="card border-0 shadow-sm p-4 mb-4">
                        <h4 className="fw-bold mb-4">Políticas de Alquiler</h4>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <h6 className="fw-bold text-dark">🚗 Normas de uso</h6>
                                <ul className="text-muted small"><li>Prohibido fumar.</li><li>Mascotas en guacales.</li></ul>
                            </div>
                            <div className="col-md-6 mb-3">
                                <h6 className="fw-bold text-dark">⛽ Combustible</h6>
                                <ul className="text-muted small"><li>Devolver con el mismo nivel.</li></ul>
                            </div>
                        </div>
                    </div>

                    {/* ¡NUEVO! SECCIÓN DE RESEÑAS */}
                    <div className="card border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-4">Opiniones de Usuarios</h4>

                        {/* Formulario (Solo si está logueado) */}
                        {userId && token ? (
                            <form onSubmit={handleSubmitReview} className="mb-5 p-3 bg-light rounded-3">
                                <h6 className="fw-bold mb-2">Deja tu calificación:</h6>
                                <div className="mb-3 fs-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            style={{ cursor: 'pointer', color: star <= (hoverRating || newReview.rating) ? '#ffc107' : '#e4e5e9', transition: 'color 0.2s' }}
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control" rows="3" placeholder="Cuéntanos tu experiencia con este vehículo..." required
                                        value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#27242a', color: '#fff' }} disabled={submittingReview}>
                                    {submittingReview ? 'Enviando...' : 'Publicar Reseña'}
                                </button>
                            </form>
                        ) : (
                            <div className="alert alert-secondary mb-4">Inicia sesión para dejar una reseña.</div>
                        )}

                        {/* Lista de Reseñas */}
                        {reviews.length === 0 ? (
                            <p className="text-muted text-center my-4">Aún no hay valoraciones. ¡Sé el primero en opinar!</p>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {reviews.map((rev, index) => (
                                    <div key={index} className="border-bottom pb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <strong className="text-dark">{rev.user?.firstName} {rev.user?.lastName}</strong>
                                            <span className="text-warning">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                                        </div>
                                        <p className="text-muted small mb-0">{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Columna Derecha: Calendario Interactivo */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                        <h4 className="fw-bold mb-1">Disponibilidad</h4>
                        <p className="small text-muted mb-4">Selecciona las fechas de tu viaje.</p>

                        <div className="d-flex justify-content-center">
                            {/* ¡NUEVO! Calendario configurado para seleccionar rangos */}
                            <DatePicker
                                inline
                                locale="es"
                                minDate={new Date()}
                                excludeDates={blockedDates}
                                monthsShown={2}
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => setDateRange(update)}
                                dateFormat="yyyy/MM/dd"
                            />
                        </div>

                        <div className="mt-4 border-top pt-3 text-center">
                            <span className="badge bg-danger me-2"> </span> Ocupadas
                            <span className="badge border bg-light text-dark ms-3 me-2"> </span> Disponibles
                            <span className="badge text-dark ms-3 me-2" style={{ backgroundColor: '#e3b155' }}> </span> Tu Selección
                        </div>

                        {/* ¡NUEVO! Lógica del botón Iniciar Reserva */}
                        <button
                            className="btn w-100 fw-bold mt-4 py-2 shadow-sm"
                            style={{ backgroundColor: '#e3b155', color: '#fff' }}
                            onClick={() => {
                                // 1. Validamos que haya elegido ambas fechas
                                if (!startDate || !endDate) {
                                    alert("Por favor, selecciona una fecha de recogida y una de devolución en el calendario.");
                                    return;
                                }

                                // 2. Validamos si el usuario está logueado (US #30)
                                if (!userId || !token) {
                                    alert("Para realizar una reserva, necesitas iniciar sesión o crear una cuenta.");
                                    navigate('/login');
                                    return;
                                }

                                // 3. Si todo está bien, lo mandamos a la nueva página de Checkout (que crearemos en el paso 2)
                                // Pasamos las fechas seleccionadas en la memoria de la ruta (state)
                                navigate(`/checkout/${id}`, {
                                    state: {
                                        checkIn: startDate.toISOString(),
                                        checkOut: endDate.toISOString(),
                                        vehicleParams: vehicle
                                    }
                                });
                            }}
                        >
                            Iniciar Reserva
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetail;