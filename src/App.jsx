import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/LoginPage.jsx";

import Competidor from "./pages/RegistroCompetidor.jsx";
import RegistroLider from "./pages/RegistroLider.jsx";
import MenuPage from "./pages/Menu.jsx"
import OlvideLaContrasena from "./pages/OlvideContrasena.jsx"
import VistaTorneo from "./pages/VistaTorneo.jsx"
import Perfil from "./pages/Perfilusuario.jsx"
import EditarPerfil from "./pages/Editarperfilusuario.jsx"
import RestablecerContrasena from "./pages/RestablecerContrasena.jsx";
;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Competidor />} />
        <Route path="/register-leader" element={<RegistroLider />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/vistatorneo" element={<VistaTorneo />} />
        <Route path="/contrasena" element={<OlvideLaContrasena />} />
        <Route path="/reset-password/:token" element={<RestablecerContrasena />} />

        <Route path="/perfilusuario" element={<Perfil />} />
        <Route path="/editarperfil" element={<EditarPerfil />} />
      </Routes>
    </Router>
  );
}

export default App;
