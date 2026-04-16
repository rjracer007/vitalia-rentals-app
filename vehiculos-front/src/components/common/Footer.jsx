import React from 'react';

const Footer = () => {
    return (
        <footer className="w-100 mt-auto py-4" style={{ backgroundColor: '#27242a', color: '#f4e7d5' }}>
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
                <div className="mb-2 mb-md-0">
                    <span className="fw-bold fs-5 text-white">Vitalia</span>
                    <span style={{ color: '#e3b155' }}>Rentals</span>
                </div>
                <div className="small">
                    © {new Date().getFullYear()} Todos los derechos reservados.
                </div>
                <div className="d-flex gap-3 mt-3 mt-md-0">
                    {/* Aquí irían íconos de redes sociales (puedes usar react-icons o bootstrap-icons) */}
                    <a href="#" className="text-decoration-none" style={{ color: '#f4e7d5' }}>Facebook</a>
                    <a href="#" className="text-decoration-none" style={{ color: '#f4e7d5' }}>Instagram</a>
                    <a href="#" className="text-decoration-none" style={{ color: '#f4e7d5' }}>Twitter</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;