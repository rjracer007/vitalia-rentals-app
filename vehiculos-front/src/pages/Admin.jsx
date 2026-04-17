import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
    // 1. ESTADOS
    const [formData, setFormData] = useState({
        name: '', description: '', pricePerDay: '', imageUrl: '',
        categoryId: '' // ¡NUEVO! Estado para guardar el ID de la categoría seleccionada
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);

    // ¡NUEVO! Estado para almacenar las categorías en el select
    const [categories, setCategories] = useState([]);

    // 2. PETICIONES (GET)
    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/vehicles');
            setVehicles(await response.json());
        } catch (error) { console.error('Error:', error); }
        finally { setLoadingVehicles(false); }
    };

    // ¡NUEVO! Función para traer las categorías y poblar el menú desplegable
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/categories');
            setCategories(await response.json());
        } catch (error) { console.error('Error:', error); }
    };

    useEffect(() => {
        fetchVehicles();
        fetchCategories(); // ¡NUEVO! Llamamos a las categorías al cargar la página
    }, []);

    // 3. MANEJADORES DE EVENTOS
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        // ¡NUEVO! Formateamos el payload para que Spring Boot entienda la relación
        const payload = {
            name: formData.name,
            description: formData.description,
            pricePerDay: formData.pricePerDay,
            imageUrl: formData.imageUrl,
            category: { id: formData.categoryId } // Pasamos un objeto categoría solo con el ID
        };

        try {
            const response = await fetch('http://localhost:8080/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage({ text: '¡Vehículo creado exitosamente!', type: 'success' });
                setFormData({ name: '', description: '', pricePerDay: '', imageUrl: '', categoryId: '' });
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

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;
        try {
            const response = await fetch(`http://localhost:8080/api/vehicles/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setVehicles(vehicles.filter((v) => v.id !== id));
                setMessage({ text: 'Vehículo eliminado.', type: 'success' });
            }
        } catch (error) { console.error('Error:', error); }
    };

    // 4. RENDERIZADO (UI)
    return (
        <div className="mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Panel de Administración</h2>
                <Link to="/admin/categories" className="btn btn-outline-dark fw-semibold">
                    Gestionar Categorías
                </Link>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} py-2 mb-4`} role="alert">{message.text}</div>
            )}

            <div className="row">
                {/* FORMULARIO */}
                <div className="col-lg-4 mb-4 mb-lg-0">
                    <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '100px' }}>
                        <h4 className="mb-3">Agregar Vehículo</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Nombre</label>
                                <input type="text" className="form-control form-control-sm" name="name" value={formData.name} onChange={handleChange} required />
                            </div>

                            {/* ¡NUEVO! SELECT DE CATEGORÍAS */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Categoría</label>
                                <select
                                    className="form-select form-select-sm"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Selecciona una categoría...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>
                                {categories.length === 0 && (
                                    <div className="form-text text-danger small">Debes crear categorías primero.</div>
                                )}
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

                {/* TABLA DE VEHÍCULOS */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 p-4 h-100">
                        <h4 className="mb-3">Inventario Actual</h4>
                        {loadingVehicles ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Cargando...</span></div>
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="alert alert-secondary text-center">No hay vehículos registrados.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">Vehículo</th>
                                            <th scope="col">Categoría</th> {/* ¡NUEVO! Columna en tabla */}
                                            <th scope="col">Precio/Día</th>
                                            <th scope="col" className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((v) => (
                                            <tr key={v.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img src={v.imageUrl} alt={v.name} className="rounded me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'; }} />
                                                        <span className="fw-semibold">{v.name}</span>
                                                    </div>
                                                </td>
                                                {/* ¡NUEVO! Mostramos el título de la categoría si existe */}
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {v.category ? v.category.title : 'Sin Categoría'}
                                                    </span>
                                                </td>
                                                <td>${v.pricePerDay}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.id)}>Eliminar</button>
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