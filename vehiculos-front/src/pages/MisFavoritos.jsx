import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MisFavoritos = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        if (!userId || !token) {
            navigate('/login');
            return;
        }

        const fetchFavoritos = async () => {
            try {
                // Hacemos la petición al endpoint de favoritos de nuestro backend
                // (Asegúrate de que esta URL coincida con la que creaste en el Sprint 3)
                const response = await fetch(`http://localhost:8080/api/users/${userId}/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data);
                } else {
                    console.error("Error al obtener favoritos");
                }
            } catch (error) {
                console.error("Error de red:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, [userId, token, navigate]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <div className="container mt-5 pt-4 mb-5" style={{ minHeight: '60vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Mis Favoritos ❤️</h2>
                <Link to="/" className="btn btn-outline-dark">Explorar más autos</Link>
            </div>

            {favorites.length === 0 ? (
                <div className="card border-0 shadow-sm p-5 text-center">
                    <h4 className="fw-bold text-muted mb-3">Aún no tienes vehículos favoritos</h4>
                    <p>¡Dale clic al corazón en los autos que más te gusten para guardarlos aquí!</p>
                    <Link to="/" className="btn btn-warning mt-3 mx-auto" style={{ maxWidth: '200px' }}>Ver catálogo</Link>
                </div>
            ) : (
                <div className="row g-4">
                    {favorites.map((vehicle) => (
                        <div className="col-md-6 col-lg-4" key={vehicle.id}>
                            <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden position-relative">
                                {/* Corazón rojo pre-marcado */}
                                <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 2 }}>
                                    <span className="fs-4" style={{ cursor: 'pointer', color: 'red' }}>❤️</span>
                                </div>

                                <img
                                    src={vehicle.imageUrl}
                                    alt={vehicle.name}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-1">{vehicle.name}</h5>
                                    <p className="text-muted small mb-3">{vehicle.category?.title}</p>
                                    <h6 className="text-warning fw-bold mb-4">${vehicle.pricePerDay} /día</h6>

                                    <Link to={`/vehicle/${vehicle.id}`} className="btn w-100 fw-bold" style={{ backgroundColor: '#27242a', color: '#fff' }}>
                                        Ver Detalle
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisFavoritos;