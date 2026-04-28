import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
    // Token y Estados Globales
    const token = localStorage.getItem('jwt');
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Estados para Características
    const [features, setFeatures] = useState([]);
    const [featureName, setFeatureName] = useState('');
    const [featureIcon, setFeatureIcon] = useState('');
    const [editingFeatureId, setEditingFeatureId] = useState(null);

    // Estados para Formulario de Vehículos
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [formData, setFormData] = useState({
        name: '', description: '', pricePerDay: '', imageUrl: '', categoryId: '', gallery: ''
    });

    // ¡NUEVO ESTADO! Para guardar los errores de validación
    const [formErrors, setFormErrors] = useState({});

    // --- CARGA INICIAL DE DATOS ---
    useEffect(() => {
        fetchUsers();
        fetchFeatures();
        fetchVehicles();
        fetchCategories();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) setUsers(await res.json());
        } catch (error) { console.error("Error cargando usuarios", error); }
    };

    const fetchFeatures = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/features');
            if (res.ok) setFeatures(await res.json());
        } catch (error) { console.error("Error cargando características", error); }
    };

    const fetchVehicles = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/vehicles');
            if (res.ok) setVehicles(await res.json());
        } catch (error) { console.error("Error cargando vehículos", error); }
        finally { setLoadingVehicles(false); }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/categories');
            if (res.ok) setCategories(await res.json());
        } catch (error) { console.error("Error cargando categorías", error); }
    };

    // Crear o Editar Característica
    const handleSubmitFeature = async (e) => {
        e.preventDefault();
        if (!featureName.trim()) return alert("El nombre es obligatorio");

        const url = editingFeatureId
            ? `http://localhost:8080/api/features/${editingFeatureId}`
            : 'http://localhost:8080/api/features';
        const method = editingFeatureId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: featureName, icon: featureIcon })
            });
            if (res.ok) {
                alert(editingFeatureId ? "Característica actualizada ✅" : "Característica creada ✅");
                setFeatureName('');
                setFeatureIcon('');
                setEditingFeatureId(null);
                fetchFeatures();
            }
        } catch (error) { alert("Error crítico de conexión."); }
    };

    // Eliminar Característica
    const handleDeleteFeature = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta característica?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/features/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Característica eliminada 🗑️");
                fetchFeatures();
            } else {
                alert("No se puede eliminar (podría estar en uso por un vehículo).");
            }
        } catch (error) { alert("Error de conexión."); }
    };

    // Cargar datos en el formulario para editar
    const handleEditFeatureClick = (feature) => {
        setEditingFeatureId(feature.id);
        setFeatureName(feature.name);
        setFeatureIcon(feature.icon || '');
    };

    const handleFeatureToggle = (featureId) => {
        setSelectedFeatures(prev =>
            prev.includes(featureId) ? prev.filter(id => id !== featureId) : [...prev, featureId]
        );
    };

    // --- FUNCIONES DE VEHÍCULOS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Preparar el formulario para Editar
    const handleEditClick = (vehicle) => {
        setEditingVehicleId(vehicle.id);
        setFormData({
            name: vehicle.name,
            description: vehicle.description,
            pricePerDay: vehicle.pricePerDay,
            imageUrl: vehicle.imageUrl,
            categoryId: vehicle.category ? vehicle.category.id : '',
            gallery: vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery.join(', ') : ''
        });
        setSelectedFeatures(vehicle.features ? vehicle.features.map(f => f.id) : []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Limpiar el formulario
    const cancelEdit = () => {
        setEditingVehicleId(null);
        setFormData({ name: '', description: '', pricePerDay: '', imageUrl: '', categoryId: '', gallery: '' });
        setSelectedFeatures([]);
        setMessage({ text: '', type: '' });
        setFormErrors({});
    };

    // --- FUNCIÓN DE VALIDACIÓN ---
    const validateForm = () => {
        const errors = {};

        // Validar Nombre: No vacío y mínimo 3 letras
        if (!formData.name.trim() || formData.name.length < 3) {
            errors.name = "El nombre es obligatorio y debe tener al menos 3 caracteres.";
        }

        // Validar Categoría
        if (!formData.categoryId) {
            errors.categoryId = "Debes seleccionar una categoría.";
        }

        // Validar Precio: Debe ser un número mayor a 0
        if (!formData.pricePerDay || isNaN(formData.pricePerDay) || Number(formData.pricePerDay) <= 0) {
            errors.pricePerDay = "El precio debe ser un número válido mayor a 0.";
        }

        // Validar URL Principal: Formato de URL básico
        const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?.*)?)$/i;
        if (!formData.imageUrl.trim()) {
            errors.imageUrl = "La URL de la imagen principal es obligatoria.";
        } else if (!urlPattern.test(formData.imageUrl)) {
            // Descomenta la siguiente línea si quieres ser muy estricto con que termine en .jpg/.png
            // errors.imageUrl = "Debe ser una URL válida terminada en .jpg, .png, etc.";
        }

        // Validar Descripción: Mínimo 20 caracteres para que sea útil
        if (!formData.description.trim() || formData.description.length < 20) {
            errors.description = "La descripción debe tener al menos 20 caracteres.";
        }

        setFormErrors(errors);

        // Retorna TRUE si NO hay errores (Object.keys(errors).length === 0)
        return Object.keys(errors).length === 0;
    };

    // Crear o Editar Vehículo (POST / PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // ¡LA BARRERA DE SEGURIDAD! Si el formulario no es válido, detenemos todo.
        if (!validateForm()) {
            setMessage({ text: 'Por favor, corrige los errores en el formulario.', type: 'danger' });
            return;
        }
        setLoading(true);
        setMessage({ text: '', type: '' });

        // Empacamos los datos
        const payload = {
            name: formData.name,
            description: formData.description,
            pricePerDay: formData.pricePerDay,
            imageUrl: formData.imageUrl,
            category: { id: formData.categoryId },
            features: selectedFeatures.map(id => ({ id })),
            // Convertimos el texto separado por comas en un arreglo
            gallery: formData.gallery ? formData.gallery.split(',').map(url => url.trim()).filter(url => url !== '') : []
        };

        // Decidimos si es Crear (POST) o Editar (PUT)
        const url = editingVehicleId ? `http://localhost:8080/api/vehicles/${editingVehicleId}` : 'http://localhost:8080/api/vehicles';
        const method = editingVehicleId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setMessage({ text: editingVehicleId ? '¡Vehículo actualizado!' : '¡Vehículo creado!', type: 'success' });
                cancelEdit();
                fetchVehicles();
            } else {
                setMessage({ text: 'Hubo un error al guardar el vehículo.', type: 'danger' });
            }
        } catch (error) {
            setMessage({ text: 'Error de conexión con el servidor.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    // Eliminar Vehículo
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;
        try {
            const response = await fetch(`http://localhost:8080/api/vehicles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('✅ Vehículo eliminado correctamente.');
                fetchVehicles();
            } else if (response.status === 409) {
                const errorMessage = await response.text();
                alert(`❌ ${errorMessage}`);
            } else {
                alert('❌ Hubo un error al intentar eliminar el vehículo.');
            }
        } catch (error) { alert('❌ Error de conexión.'); }
    };

    // --- FUNCIONES DE USUARIOS ---
    const toggleRole = async (userId, currentRoleName) => {
        const newRole = currentRoleName === 'ADMIN' ? 'USER' : 'ADMIN';
        if (!window.confirm(`¿Cambiar este usuario a ${newRole}?`)) return;
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ roleName: newRole })
            });
            if (res.ok) { alert("Rol actualizado"); fetchUsers(); }
        } catch (error) { console.error("Error:", error); }
    };

    // --- RENDERIZADO VISUAL ---
    return (
        <div className="mt-4 mb-5 container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Panel de Administración</h2>
                <Link to="/admin/categories" className="btn btn-outline-dark fw-semibold">
                    Gestionar Categorías
                </Link>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} py-2 mb-4`} role="alert">{message.text}</div>
            )}

            {/* SECCIÓN CARACTERÍSTICAS */}
            <div className="card border-0 shadow-sm p-4 mb-4">
                <h4 className="fw-bold mb-4">Gestión de Características</h4>
                <form onSubmit={handleSubmitFeature} className="row g-3 mb-4">
                    <div className="col-md-5">
                        <input type="text" className="form-control" placeholder="Nombre (Ej. GPS)" value={featureName} onChange={(e) => setFeatureName(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Ícono (Ej. fa-solid fa-compass)" value={featureIcon} onChange={(e) => setFeatureIcon(e.target.value)} />
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button type="submit" className="btn btn-dark flex-grow-1">
                            {editingFeatureId ? 'Actualizar' : 'Agregar'}
                        </button>
                        {editingFeatureId && (
                            <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingFeatureId(null); setFeatureName(''); setFeatureIcon(''); }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
                <div className="d-flex flex-wrap gap-2">
                    {features.map(f => (
                        <span key={f.id} className="badge bg-secondary p-2 fs-6 d-flex align-items-center gap-2">
                            {f.icon && <i className={f.icon}></i>} {f.name}
                            <button type="button" className="btn btn-sm btn-light p-0 px-1 ms-2" onClick={() => handleEditFeatureClick(f)} title="Editar">✏️</button>
                            <button type="button" className="btn btn-sm btn-danger p-0 px-1" onClick={() => handleDeleteFeature(f.id)} title="Eliminar">🗑️</button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="row">
                {/* COLUMNA IZQUIERDA: FORMULARIO DE VEHÍCULOS */}
                <div className="col-lg-4 mb-4 mb-lg-0">
                    <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '100px' }}>
                        <h4 className="mb-3">{editingVehicleId ? '✏️ Editar Vehículo' : 'Agregar Vehículo'}</h4>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Nombre</label>
                                <input type="text" className={`form-control form-control-sm ${formErrors.name ? 'is-invalid' : ''}`} name="name" value={formData.name} onChange={handleChange} />
                                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Categoría</label>
                                <select className={`form-select form-select-sm ${formErrors.categoryId ? 'is-invalid' : ''}`} name="categoryId" value={formData.categoryId} onChange={handleChange}>
                                    <option value="" disabled>Selecciona...</option>
                                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                                </select>
                                {formErrors.categoryId && <div className="invalid-feedback">{formErrors.categoryId}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Precio por Día ($)</label>
                                <input type="number" step="0.01" className={`form-control form-control-sm ${formErrors.pricePerDay ? 'is-invalid' : ''}`} name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} />
                                {formErrors.pricePerDay && <div className="invalid-feedback">{formErrors.pricePerDay}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">URL Imagen Principal</label>
                                <input type="url" className={`form-control form-control-sm ${formErrors.imageUrl ? 'is-invalid' : ''}`} name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                                {formErrors.imageUrl && <div className="invalid-feedback">{formErrors.imageUrl}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Galería (Links separados por coma)</label>
                                <textarea className="form-control form-control-sm" name="gallery" value={formData.gallery} onChange={handleChange} rows="2" placeholder="https://foto1.jpg, https://foto2.jpg"></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Descripción</label>
                                <textarea className={`form-control form-control-sm ${formErrors.description ? 'is-invalid' : ''}`} name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
                                {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Características</label>
                                <div className="d-flex flex-wrap gap-2 p-3 border rounded bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {features.map(feature => (
                                        <div className="form-check w-100" key={feature.id}>
                                            <input className="form-check-input" type="checkbox" id={`feature-${feature.id}`} checked={selectedFeatures.includes(feature.id)} onChange={() => handleFeatureToggle(feature.id)} />
                                            <label className="form-check-label small" htmlFor={`feature-${feature.id}`}>
                                                {feature.icon && <i className={`me-1 ${feature.icon}`}></i>} {feature.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#e3b155', color: '#fff' }} disabled={loading}>
                                    {loading ? 'Guardando...' : (editingVehicleId ? 'Actualizar Vehículo' : 'Guardar Vehículo')}
                                </button>
                                {editingVehicleId && (
                                    <button type="button" className="btn btn-outline-secondary fw-bold" onClick={cancelEdit} disabled={loading}>
                                        Cancelar Edición
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* COLUMNA DERECHA: TABLAS */}
                <div className="col-lg-8">
                    {/* TABLA VEHÍCULOS */}
                    <div className="card shadow-sm border-0 p-4 mb-4">
                        <h4 className="mb-3">Inventario Actual</h4>
                        {loadingVehicles ? (
                            <div className="text-center py-5"><div className="spinner-border text-secondary"></div></div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">Vehículo</th>
                                            <th scope="col">Categoría</th>
                                            <th scope="col">Precio/Día</th>
                                            <th scope="col" className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((v) => (
                                            <tr key={v.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img src={v.imageUrl} alt={v.name} className="rounded me-3" style={{ width: '40px', height: '40px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                                                        <span className="fw-semibold small">{v.name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="badge bg-secondary">{v.category?.title || 'N/A'}</span></td>
                                                <td className="small">${v.pricePerDay}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(v)}>Editar</button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.id)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* TABLA USUARIOS */}
                    <div className="card border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-3">Gestión de Usuarios</h4>
                        <div className="table-responsive">
                            <table className="table align-middle table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th className="text-end">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="small">{user.id}</td>
                                            <td className="small">{user.firstName} {user.lastName}</td>
                                            <td className="small">{user.email}</td>
                                            <td>
                                                <span className={`badge ${user.role?.name === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                                                    {user.role?.name || 'USER'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button className={`btn btn-sm ${user.role?.name === 'ADMIN' ? 'btn-outline-secondary' : 'btn-outline-danger'}`} onClick={() => toggleRole(user.id, user.role?.name)}>
                                                    {user.role?.name === 'ADMIN' ? 'Quitar Admin' : 'Hacer Admin'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;