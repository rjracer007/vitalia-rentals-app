import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    // 1. Estado para los datos del usuario
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // 2. Estado para manejar errores de validación en la UI
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // 3. Manejador de cambios en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Limpiamos el error de ese campo en específico cuando el usuario vuelve a escribir
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    // 4. Lógica de Validación (El "Toque Senior" de la US #13)
    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar emails

        if (formData.firstName.trim().length < 2) newErrors.firstName = 'El nombre debe tener al menos 2 caracteres.';
        if (formData.lastName.trim().length < 2) newErrors.lastName = 'El apellido debe tener al menos 2 caracteres.';
        if (!emailRegex.test(formData.email)) newErrors.email = 'Ingresa un correo electrónico válido.';
        if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    // 5. Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Si la validación falla, detenemos el envío
        if (!validateForm()) return;

        setLoading(true);
        setMessage({ text: '', type: '' });

        // Simulamos la llamada a la API por ahora (Lo conectaremos a Spring Boot luego)
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (response.ok) {
                setMessage({ text: '¡Registro exitoso! Ya puedes iniciar sesión.', type: 'success' });
                setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
            } else {
                const errorMsg = await response.text();
                setMessage({ text: errorMsg || 'Hubo un error al registrar el usuario.', type: 'danger' });
            }
        } catch (error) {
            setMessage({ text: 'Error de conexión con el servidor.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row mt-5 justify-content-center mb-5">
            <div className="col-12 col-md-8 col-lg-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold">Crear Cuenta</h2>
                    <p className="text-muted">Únete a Vitalia Rentals para gestionar tus reservas</p>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type} py-2`} role="alert">
                        {message.text}
                    </div>
                )}

                <div className="card shadow-sm p-4 border-0">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Nombre */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Nombre</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                            </div>

                            {/* Apellido */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Apellido</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Correo Electrónico</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ejemplo@correo.com"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Contraseña</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold small">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 fw-bold mb-3"
                            style={{ backgroundColor: '#e3b155', color: '#fff' }}
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrarme'}
                        </button>

                        <div className="text-center small">
                            ¿Ya tienes una cuenta? <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#27242a' }}>Inicia sesión aquí</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;