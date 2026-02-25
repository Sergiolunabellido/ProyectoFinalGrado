import './App.css';
import { Routes, Route } from 'react-router-dom';
import Principal from './Pages/Principal/principal';
import Login from './Pages/Login/login';
import PageBook from './Pages/Libros/paginaLibro';
import Perfil from './Pages/Perfil/perfil'
import Catalogo from './Pages/Catalogo/catalogo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/book" element={<PageBook />} />
        <Route path="/catalogo" element={<Catalogo />} />
      </Routes>
    </div>
  );
}

export default App;
