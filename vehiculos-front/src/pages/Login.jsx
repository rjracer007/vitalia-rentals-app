import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Hook para redireccionar al usuario después de loguearse

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json();

                // ¡LA MAGIA SUCEDE AQUÍ!
                // Guardamos el token y el nombre en el "Almacenamiento Local" del navegador
                localStorage.setItem('jwt', data.jwt);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('role', data.role || 'USER');

                const finalName = data.userName || data.firstName || data.email?.split('@')[0] || "Usuario";
                localStorage.setItem('userName', finalName);

                // Redirigimos al usuario al Home y recargamos para que el Header se actualice
                window.location.href = '/';
            } else {
                const errorMsg = await response.text();
                setError(errorMsg || 'Credenciales incorrectas.');
            }
        } catch (err) {
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row mt-5 justify-content-center mb-5">
            <div className="col-12 col-md-6 col-lg-4">
                <div className="text-center mb-4">
                    <h2 className="fw-bold">Iniciar Sesión</h2>
                    <p className="text-muted">Bienvenido de nuevo a Vitalia Rentals</p>
                </div>

                {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

                <div className="card shadow-sm p-4 border-0">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold small">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-100 fw-bold mb-3"
                            style={{ backgroundColor: '#e3b155', color: '#fff' }}
                            disabled={loading}
                        >
                            {loading ? 'Verificando...' : 'Entrar'}
                        </button>
                        <div className="text-center small">
                            ¿No tienes cuenta? <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#27242a' }}>Regístrate aquí</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;