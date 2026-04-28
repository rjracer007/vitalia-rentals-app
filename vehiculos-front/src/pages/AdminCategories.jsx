import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminCategories = () => {
    // --- ESTADOS ---
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '' });
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    // ¡NUEVO! Estado para los errores
    const [formErrors, setFormErrors] = useState({});

    // ¡CRÍTICO! Necesitamos el token para poder crear/editar/borrar
    const token = localStorage.getItem('jwt');

    // --- CARGAR DATOS ---
    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/categories');
            if (res.ok) setCategories(await res.json());
        } catch (error) {
            console.error("Error cargando categorías", error);
        }
    };

    // --- FUNCIÓN DE VALIDACIÓN ---
    const validateForm = () => {
        const errors = {};

        // Validar Título: No vacío y mínimo 3 letras
        if (!formData.title.trim() || formData.title.length < 3) {
            errors.title = "El título es obligatorio y debe tener al menos 3 caracteres.";
        }

        // Validar URL de Imagen: Formato básico de URL
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        if (!formData.imageUrl.trim()) {
            errors.imageUrl = "La URL de la imagen es obligatoria.";
        } else if (!urlPattern.test(formData.imageUrl)) {
            errors.imageUrl = "Debe ser una URL válida que inicie con http:// o https://";
        }

        // Validar Descripción: Mínimo 10 caracteres
        if (!formData.description.trim() || formData.description.length < 10) {
            errors.description = "La descripción debe tener al menos 10 caracteres.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- MANEJADORES DEL FORMULARIO ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditClick = (cat) => {
        setEditingCategoryId(cat.id);
        setFormData({
            title: cat.title,
            description: cat.description,
            imageUrl: cat.imageUrl
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingCategoryId(null);
        setFormData({ title: '', description: '', imageUrl: '' });
        setFormErrors({}); // ¡NUEVO! Limpiamos los errores al cancelar
    };

    // --- ACCIONES PRINCIPALES (CRUD) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        // ¡BARRERA DE SEGURIDAD!
        if (!validateForm()) {
            return; // Si hay errores, detenemos el envío. Los mensajes rojos ya le avisarán al usuario.
        }

        const url = editingCategoryId
            ? `http://localhost:8080/api/categories/${editingCategoryId}`
            : 'http://localhost:8080/api/categories';
        const method = editingCategoryId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(editingCategoryId ? '✅ Categoría actualizada exitosamente' : '✅ Categoría creada exitosamente');
                cancelEdit();
                fetchCategories();
            } else {
                alert(`❌ Error al guardar la categoría. Código: ${response.status}`);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('❌ Error crítico de conexión con el servidor.');
        }
    };

    const handleDelete = async (id) => {
        // Un mensaje de advertencia más limpio
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Aseguramos el pase VIP
                }
            });

            if (response.ok) {
                alert('✅ Categoría eliminada correctamente.');
                fetchCategories(); // Refrescamos la tabla automáticamente
            } else if (response.status === 409) {
                // ¡AQUÍ ATRAPAMOS EL ERROR DE LA BASE DE DATOS!
                const errorMessage = await response.text();
                alert(`❌ No se puede eliminar: ${errorMessage}`);
            } else {
                alert(`❌ Error al eliminar la categoría. Código: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error de conexión con el servidor.');
        }
    };

    // --- RENDERIZADO ---
    return (
        <div className="mt-4 mb-5 container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Gestión de Categorías</h2>
                <Link to="/admin" className="btn btn-outline-dark fw-semibold">
                    Volver a Vehículos
                </Link>
            </div>

            <div className="row">
                {/* FORMULARIO */}
                <div className="col-lg-4 mb-4 mb-lg-0">
                    <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '100px' }}>
                        <h4 className="mb-3">
                            {editingCategoryId ? '✏️ Editar Categoría' : 'Agregar Categoría'}
                        </h4>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Título</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${formErrors.title ? 'is-invalid' : ''}`}
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                                {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">URL Imagen</label>
                                <input
                                    type="url"
                                    className={`form-control form-control-sm ${formErrors.imageUrl ? 'is-invalid' : ''}`}
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                />
                                {formErrors.imageUrl && <div className="invalid-feedback">{formErrors.imageUrl}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Descripción</label>
                                <textarea
                                    className={`form-control form-control-sm ${formErrors.description ? 'is-invalid' : ''}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                                {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#e3b155', color: '#fff' }}>
                                    {editingCategoryId ? 'Actualizar Categoría' : 'Guardar Categoría'}
                                </button>

                                {editingCategoryId && (
                                    <button type="button" className="btn btn-outline-secondary fw-bold" onClick={cancelEdit}>
                                        Cancelar Edición
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* TABLA DE CATEGORÍAS */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 p-4 mb-4">
                        <h4 className="mb-3">Categorías Actuales</h4>

                        {categories.length === 0 ? (
                            <div className="alert alert-secondary text-center">No hay categorías registradas.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Imagen</th>
                                            <th>Título</th>
                                            <th>Descripción</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((cat) => (
                                            <tr key={cat.id}>
                                                <td>
                                                    <img src={cat.imageUrl} alt={cat.title} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                                                </td>
                                                <td className="fw-semibold small">{cat.title}</td>
                                                <td className="small text-truncate" style={{ maxWidth: '200px' }}>{cat.description}</td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleEditClick(cat)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(cat.id)}
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

export default AdminCategories;