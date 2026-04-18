import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Importamos las páginas
import Admin from './pages/Admin';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminCategories from './pages/AdminCategories';
import VehicleDetail from './pages/VehicleDetail';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Header />

        <main className="container pt-5 mt-4 flex-grow-1">
          {/* El componente Routes decide qué mostrar según la URL */}
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;