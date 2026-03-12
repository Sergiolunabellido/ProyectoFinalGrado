import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Principal from './Pages/Principal/principal';
import Login from './Pages/Login/login';
import PageBook from './Pages/Libros/paginaLibro';
import Perfil from './Pages/Perfil/perfil'
import Catalogo from './Pages/Catalogo/catalogo';
import Carrito from './Pages/Carrito/carrito';

/**
 * @brief Componente raiz con rutas principales.
 * @fecha 2026-01-08
 * @returns {JSX.Element} Contenedor de rutas.
 */
function App() {
  return (
    <div className="App">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a2e1f',
            color: '#4ade80',
            border: '1px solid #22c55e',
            fontWeight: '600',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#1a2e1f',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a2e1f',
            },
            style: {
              background: '#2d1f1f',
              color: '#f87171',
              border: '1px solid #ef4444',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/libro/:id" element={<PageBook />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </div>
  );
}

export default App;
