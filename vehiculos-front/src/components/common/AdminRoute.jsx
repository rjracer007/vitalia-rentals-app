import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    // 1. Leemos los datos que guardamos al hacer Login
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    // 2. Si no hay token (no está logueado), lo mandamos al Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si está logueado pero NO es ADMIN, lo mandamos al Home
    if (role !== 'ADMIN') {
        // Opcional: Puedes agregar un alert() aquí para decirle que no tiene permisos
        return <Navigate to="/" replace />;
    }

    // 4. Si tiene token y es ADMIN, lo dejamos pasar y dibujamos la página
    return children;
};

export default AdminRoute;