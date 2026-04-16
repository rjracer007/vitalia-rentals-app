import React, { useState, useEffect } from 'react';

const Home = () => {
    // Estados para guardar los vehículos y manejar la pantalla de carga
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect se ejecuta una vez al montar el componente para traer los datos
    useEffect(() => {
        fetch('http://localhost:8080/api/vehicles')
            .then((response) => response.json())
            .then((data) => {
                setVehicles(data);
                setLoading(false); // Apagamos el loader cuando llegan los datos
            })
            .catch((error) => {
                console.error('Error al cargar los vehículos:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="mt-4 mb-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold">Explora nuestra flota en Vitalia Rentals</h1>
                <p className="lead text-muted">Encuentra el vehículo perfecto para tu próximo viaje.</p>
            </div>

            {loading ? (
                // Spinner de carga mientras responde la API
                <div className="text-center my-5">
                    <div className="spinner-border" style={{ color: '#e3b155' }} role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                // Grilla de Bootstrap para mostrar las tarjetas
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {vehicles.map((vehicle) => (
                        <div className="col" key={vehicle.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <img
                                    src={vehicle.imageUrl}
                                    className="card-img-top"
                                    alt={vehicle.name}
                                    style={{ height: '220px', objectFit: 'cover' }} // objectFit evita que las imágenes se deformen
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold text-dark">{vehicle.name}</h5>
                                    <p className="card-text text-muted flex-grow-1">{vehicle.description}</p>

                                    {/* Contenedor del precio y botón */}
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <span className="fs-5 fw-bold" style={{ color: '#27242a' }}>
                                            ${vehicle.pricePerDay} <span className="fs-6 fw-normal text-muted">/día</span>
                                        </span>
                                        <button
                                            className="btn fw-semibold"
                                            style={{ backgroundColor: '#e3b155', color: '#fff' }}
                                        >
                                            Ver Detalle
                                        </button>
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