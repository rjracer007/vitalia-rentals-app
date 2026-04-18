import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    // Estados para capturar lo que el usuario escribe y selecciona
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validamos que la fecha final no sea antes de la inicial
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            alert("La fecha de devolución no puede ser anterior a la fecha de recogida.");
            return;
        }

        // Le pasamos los datos al componente padre (Home) para que ejecute la búsqueda
        onSearch({ keyword, startDate, endDate });
    };

    // Obtenemos la fecha de hoy para bloquear días en el pasado en el calendario
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
            <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>

                <div className="text-center mb-4">
                    <h3 className="fw-bold" style={{ color: '#27242a' }}>Encuentra tu vehículo ideal</h3>
                    <p className="text-muted mb-0">Selecciona las fechas de tu viaje y descubre nuestra flota disponible.</p>
                </div>

                <form onSubmit={handleSubmit} className="row g-3 align-items-end">

                    {/* Campo de Texto (Autocompletado en el futuro) */}
                    <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold small">¿Qué estás buscando?</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ej. SUV, Deportivo, Económico..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    {/* Calendario Doble (Inicio y Fin) */}
                    <div className="col-12 col-md-6">
                        <div className="row g-2">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Recogida</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    min={today} // Bloquea fechas pasadas
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Devolución</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    min={startDate || today} // La devolución no puede ser antes de la recogida
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botón de Búsqueda */}
                    <div className="col-12 col-md-2">
                        <button
                            type="submit"
                            className="btn w-100 fw-bold shadow-sm"
                            style={{ backgroundColor: '#e3b155', color: '#fff', height: '40px' }}
                        >
                            Buscar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SearchBar;