import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminCategories = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', imageUrl: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch('http://localhost:8080/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({ text: '¡Categoría creada exitosamente!', type: 'success' });
                setFormData({ title: '', description: '', imageUrl: '' });
                fetchCategories(); // Actualizamos la lista
            } else {
                setMessage({ text: 'Hubo un error al crear la categoría.', type: 'danger' });
            }
        } catch (error) {
            setMessage({ text: 'Error de conexión con el servidor.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 mb-5">
            {/* Sub-navegación del Panel Admin */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Gestión de Categorías</h2>
                <Link to="/admin" className="btn btn-outline-dark">Volver a Vehículos</Link>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} py-2`} role="alert">{message.text}</div>
            )}

            <div className="row">
                {/* Formulario de Categorías */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '100px' }}>
                        <h4 className="mb-3">Agregar Categoría</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Título</label>
                                <input type="text" className="form-control form-control-sm" name="title" value={formData.title} onChange={handleChange} placeholder="Ej. Autos Deportivos" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">URL de Imagen</label>
                                <input type="url" className="form-control form-control-sm" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold small">Descripción</label>
                                <textarea className="form-control form-control-sm" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                            </div>
                            <button type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: '#e3b155', color: '#fff' }} disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Categoría'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lista de Categorías */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 p-4 h-100">
                        <h4 className="mb-3">Categorías Existentes</h4>
                        {categories.length === 0 ? (
                            <div className="alert alert-secondary text-center">No hay categorías registradas.</div>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-2 g-3">
                                {categories.map((cat) => (
                                    <div className="col" key={cat.id}>
                                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                                            <img
                                                src={cat.imageUrl}
                                                alt={cat.title}
                                                className="mx-auto rounded-circle mb-2"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'; }}
                                            />
                                            <h5 className="fw-bold">{cat.title}</h5>
                                            <p className="small text-muted mb-0">{cat.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;