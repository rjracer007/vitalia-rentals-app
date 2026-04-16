import React, { useState, useEffect } from 'react';

const Admin = () => {
    // ==========================================
    // 1. ESTADOS
    // ==========================================
    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '', description: '', pricePerDay: '', imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Nuevo: Estado de la tabla de vehículos
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);

    // ==========================================
    // 2. EFECTOS Y PETICIONES A LA API (GET)
    // ==========================================
    // Función para obtener los vehículos (la separamos para poder reutilizarla)
    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/vehicles');
            const data = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error('Error al cargar la tabla:', error);
        } finally {
            setLoadingVehicles(false);
        }
    };

    // Se ejecuta una sola vez al entrar al panel
    useEffect(() => {
        fetchVehicles();
    }, []);

    // ==========================================
    // 3. MANEJADORES DE EVENTOS (POST Y DELETE)
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch('http://localhost:8080/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({ text: '¡Vehículo creado exitosamente!', type: 'success' });
                setFormData({ name: '', description: '', pricePerDay: '', imageUrl: '' });

                // ¡Magia aquí! Recargamos la tabla automáticamente
                fetchVehicles();
            } else {
                setMessage({ text: 'Hubo un error al crear el vehículo.', type: 'danger' });
            }
        } catch (error) {
            setMessage({ text: 'Error de conexión con el servidor.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    // NUEVO: Función para eliminar un vehículo
    const handleDelete = async (id) => {
        // Evitamos borrados accidentales con una confirmación nativa
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.');

        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/vehicles/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Actualizamos el estado filtrando el vehículo eliminado para que desaparezca al instante
                setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
                setMessage({ text: 'Vehículo eliminado correctamente.', type: 'success' });
            } else {
                setMessage({ text: 'No se pudo eliminar el vehículo.', type: 'danger' });
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            setMessage({ text: 'Error de conexión al intentar eliminar.', type: 'danger' });
        }
    };

    // ==========================================
    // 4. RENDERIZADO (UI)
    // ==========================================
    return (
        <div className="mt-4 mb-5">
            <h2 className="fw-bold mb-4">Panel de Administración</h2>

            {/* Mensajes globales de éxito/error */}
            {message.text && (
                <div className={`alert alert-${message.type} py-2 mb-4`} role="alert">
                    {message.text}
                </div>
            )}

            <div className="row">
                {/* COLUMNA IZQUIERDA: FORMULARIO */}
                <div className="col-lg-4 mb-4 mb-lg-0">
                    <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '100px' }}>
                        <h4 className="mb-3">Agregar Vehículo</h4>
                        <form onSubmit={handleSubmit}>
                            {/* Inputs del formulario (Igual que antes) */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Nombre</label>
                                <input type="text" className="form-control form-control-sm" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Precio por Día ($)</label>
                                <input type="number" step="0.01" className="form-control form-control-sm" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">URL Imagen</label>
                                <input type="url" className="form-control form-control-sm" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold small">Descripción</label>
                                <textarea className="form-control form-control-sm" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                            </div>
                            <button type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: '#e3b155', color: '#fff' }} disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLUMNA DERECHA: TABLA DE VEHÍCULOS */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 p-4 h-100">
                        <h4 className="mb-3">Inventario Actual</h4>

                        {loadingVehicles ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="alert alert-secondary text-center">No hay vehículos registrados.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Vehículo</th>
                                            <th scope="col">Precio/Día</th>
                                            <th scope="col" className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((v) => (
                                            <tr key={v.id}>
                                                <td className="fw-bold text-muted">#{v.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={v.imageUrl}
                                                            alt={v.name}
                                                            className="rounded me-3"
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'; }}
                                                        />
                                                        <span className="fw-semibold">{v.name}</span>
                                                    </div>
                                                </td>
                                                <td>${v.pricePerDay}</td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(v.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Admin;