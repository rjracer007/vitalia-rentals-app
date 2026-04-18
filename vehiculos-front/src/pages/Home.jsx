import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';

const Home = () => {
    // 1. Estados
    const [vehicles, setVehicles] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState(new Set()); // Usamos un 'Set' para búsquedas súper rápidas
    const [loading, setLoading] = useState(true);

    // Leemos los datos del usuario logueado desde el almacenamiento local
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwt');

    // 2. Carga inicial de datos
    useEffect(() => {
        const loadData = async () => {
            try {
                // A. Traemos el catálogo de vehículos (Ruta pública)
                const vRes = await fetch('http://localhost:8080/api/vehicles');
                const vData = await vRes.json();
                setVehicles(vData);

                // B. Si el usuario está logueado, traemos sus favoritos (Ruta protegida)
                if (userId && token) {
                    const fRes = await fetch(`http://localhost:8080/api/users/${userId}/favorites`, {
                        headers: {
                            'Authorization': `Bearer ${token}` // ¡Aquí enviamos el Token JWT!
                        }
                    });

                    if (fRes.ok) {
                        const fData = await fRes.json();
                        // Guardamos solo los IDs de los vehículos favoritos en el Set
                        const fIds = new Set(fData.map(v => v.id));
                        setFavoriteIds(fIds);
                    }
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId, token]);

    // 3. Función para agregar/quitar favoritos
    const toggleFavorite = async (vehicleId) => {
        // Si no está logueado, no lo dejamos hacer nada
        if (!userId || !token) {
            alert("Debes iniciar sesión para guardar tus vehículos favoritos.");
            return;
        }

        const isFavorite = favoriteIds.has(vehicleId);
        const method = isFavorite ? 'DELETE' : 'POST';

        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/favorites/${vehicleId}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Actualizamos la interfaz instantáneamente sin recargar la página
                const newFavorites = new Set(favoriteIds);
                if (isFavorite) {
                    newFavorites.delete(vehicleId); // Lo quitamos
                } else {
                    newFavorites.add(vehicleId); // Lo agregamos
                }
                setFavoriteIds(newFavorites);
            }
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
        }
    };

    // ¡NUEVA! Función real de búsqueda conectada al Backend
    const handleSearch = async (searchParams) => {
        setLoading(true); // Mostramos el spinner mientras busca

        try {
            // Construimos la URL de manera profesional usando URLSearchParams
            const query = new URLSearchParams({
                startDate: searchParams.startDate,
                endDate: searchParams.endDate,
                keyword: searchParams.keyword || '' // Si no escribió nada, mandamos vacío
            }).toString();

            // Hacemos la petición a nuestra nueva ruta mágica
            const response = await fetch(`http://localhost:8080/api/vehicles/search?${query}`);

            if (response.ok) {
                const data = await response.json();
                setVehicles(data); // ¡Actualizamos la pantalla con los autos filtrados!
            } else {
                console.error('Error del servidor al buscar');
            }
        } catch (error) {
            console.error('Error de red al intentar buscar:', error);
        } finally {
            setLoading(false); // Ocultamos el spinner
        }
    };
    return (
        <div className="mt-4 mb-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold">Explora nuestra flota en Vitalia Rentals</h1>
                <p className="lead text-muted">Encuentra el vehículo perfecto para tu próximo viaje.</p>
            </div>

            <SearchBar onSearch={handleSearch} />


            <div className="mt-5 pt-3"></div>

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border" style={{ color: '#e3b155' }} role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {vehicles.map((vehicle) => (
                        <div className="col" key={vehicle.id}>
                            <div className="card h-100 shadow-sm border-0 position-relative">

                                {/* ¡NUEVO! Botón de Favorito en la esquina superior derecha */}
                                <button
                                    className="btn position-absolute top-0 end-0 m-2 rounded-circle p-2 bg-white shadow-sm"
                                    onClick={() => toggleFavorite(vehicle.id)}
                                    style={{ border: 'none', zIndex: 10 }}
                                    title="Agregar a favoritos"
                                >
                                    <span className="fs-5 lh-1">
                                        {favoriteIds.has(vehicle.id) ? '❤️' : '🤍'}
                                    </span>
                                </button>

                                <img
                                    src={vehicle.imageUrl}
                                    className="card-img-top"
                                    alt={vehicle.name}
                                    style={{ height: '220px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'; }}
                                />

                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title fw-bold text-dark mb-0">{vehicle.name}</h5>
                                        {vehicle.category && (
                                            <span className="badge bg-secondary">{vehicle.category.title}</span>
                                        )}
                                    </div>

                                    <p className="card-text text-muted flex-grow-1 small">{vehicle.description}</p>

                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <span className="fs-5 fw-bold" style={{ color: '#27242a' }}>
                                            ${vehicle.pricePerDay} <span className="fs-6 fw-normal text-muted">/día</span>
                                        </span>
                                        <Link
                                            to={`/vehicle/${vehicle.id}`}
                                            className="btn fw-semibold"
                                            style={{ backgroundColor: '#e3b155', color: '#fff' }}
                                        >
                                            Ver Detalle
                                        </Link>
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

export default Home;