import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminCategories = () => {
    // 1. Estados
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '' });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // ¡NUEVO! Estados para la ventana emergente (Modal) de eliminación
    const [showModal, setShowModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // 2. Peticiones (GET)
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/categories');
            setCategories(await response.json());
        } catch (error) { console.error('Error al cargar:', error); }
    };

    useEffect(() => { fetchCategories(); }, []);

    // 3. Crear Categoría (POST)
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage({ text: '', type: '' });

        try {
            const response = await fetch('http://localhost:8080/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({ text: '¡Categoría creada!', type: 'success' });
                setFormData({ title: '', description: '', imageUrl: '' });
                fetchCategories();
            } else {
                setMessage({ text: 'Error al crear.', type: 'danger' });
            }
        } catch (error) { setMessage({ text: 'Error de conexión.', type: 'danger' }); }
        finally { setLoading(false); }
    };

    // ¡NUEVO! 4. Lógica de Eliminación (DELETE)
    // Esta función solo abre el modal y guarda qué categoría queremos borrar
    const triggerDelete = (category) => {
        setCategoryToDelete(category);
        setShowModal(true);
    };

    // Esta función ejecuta el borrado real si el usuario presiona "Confirmar"
    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/categories/${categoryToDelete.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCategories(categories.filter(c => c.id !== categoryToDelete.id));
                setMessage({ text: 'Categoría eliminada correctamente.', type: 'success' });
            } else {
                setMessage({ text: 'No se pudo eliminar la categoría.', type: 'danger' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShowModal(false); // Cerramos el modal
            setCategoryToDelete(null); // Limpiamos el estado
        }
    };

    return (
        <div className="mt-4 mb-5 position-relative">

            {/* ¡NUEVO! Modal de Confirmación Superpuesto */}
            {showModal && (
                <div className="modal-backdrop bg-dark bg-opacity-50 d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
                    <div className="card shadow-lg border-0 p-4" style={{ maxWidth: '400px' }}>
                        <h5 className="fw-bold text-danger mb-3">⚠️ Confirmar Eliminación</h5>
                        <p>
                            Estás a punto de eliminar la categoría <strong>"{categoryToDelete?.title}"</strong>.
                        </p>
                        <p className="small text-muted mb-4">
                            Consecuencia: Esta acción es irreversible y podría eliminar todos los vehículos asociados a esta categoría en la base de datos.
                        </p>
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={confirmDelete}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cabecera y Mensajes */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Gestión de Categorías</h2>
                <Link to="/admin" className="btn btn-outline-dark">Volver a Vehículos</Link>
            </div>

            {message.text && <div className={`alert alert-${message.type} py-2`}>{message.text}</div>}

            <div className="row">
                {/* Formulario (Mismo de antes) */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '100px' }}>
                        <h4 className="mb-3">Agregar Categoría</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Título</label>
                                <input type="text" className="form-control form-control-sm" name="title" value={formData.title} onChange={handleChange} required />
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
                                Guardar Categoría
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
                                        <div className="card h-100 border-0 shadow-sm text-center p-3 position-relative">

                                            {/* ¡NUEVO! Botón de eliminar en la esquina */}
                                            <button
                                                className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                                                onClick={() => triggerDelete(cat)}
                                                title="Eliminar categoría"
                                            >
                                                X
                                            </button>

                                            <img src={cat.imageUrl} alt={cat.title} className="mx-auto rounded-circle mb-2" style={{ width: '80px', height: '80px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'; }} />
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