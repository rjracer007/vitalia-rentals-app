import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import AdminRoute from './components/common/AdminRoute';

import Admin from './pages/Admin';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminCategories from './pages/AdminCategories';
import VehicleDetail from './pages/VehicleDetail';
import Checkout from './pages/Checkout';
import ReservationSuccess from './pages/ReservationSuccess';
import MisReservas from './pages/MisReservas';
import MisFavoritos from './pages/MisFavoritos';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Header />

        <main className="container pt-5 mt-4 flex-grow-1">
          <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />

            {/* --- RUTAS DE USUARIO (Si quisieras, podrías crear un <UserRoute> para estas) --- */}
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/reserva-exitosa" element={<ReservationSuccess />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/mis-favoritos" element={<MisFavoritos />} />

            {/* --- RUTAS PROTEGIDAS (Solo ADMIN) --- */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        <Footer />

      </div>
      <WhatsAppButton />
    </Router>
  );
}

export default App;