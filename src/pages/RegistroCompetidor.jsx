/**
 * 🌐 API INTEGRATION TIP:
 * Para el registro real de competidores:
 * 
 * const handleRegister = async (data) => {
 *   const response = await fetch('/api/competitors/register', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data)
 *   });
 *   if (response.ok) navigate('/menu');
 * };
 */
// ... (imports remain similar)
import { useState, useEffect } from "react";
import logoimg from "../assets/images/logo.png";
import resetbg from "../assets/images/reset.png";
import { useNavigate, Link } from "react-router-dom";
import loadingGif from "../assets/images/loading.gif";
import { authService } from "../services/authService";
import { clubService } from "../services/clubService";

// ✅ Íconos
import {
  FaIdCard,
  FaUser,
  FaSmile,
  FaUserTag,
  FaCalendarAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPaperPlane,
  FaUsers
} from "react-icons/fa";

function RegistroCompetidor() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    nickname: "",
    age: "",
    nickname: "",
    age: "",
    email: "",
    user_password: "",
    role: "competitor",
    club_id: "" // Ahora requerido
  });

  const [clubs, setClubs] = useState([]);
  const [menuActive, setMenuActive] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const toggleMenu = () => setMenuActive(!menuActive);
  const closeMenu = () => setMenuActive(false);

  // 🔹 Cargar clubes al iniciar
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await clubService.getClubs();
        setClubs(res.data || []);
      } catch (err) {
        console.error("Error cargando clubes:", err);
      }
    };
    fetchClubs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    setError("");

    if (formData.age < 18) {
      setError("Debes tener al menos 18 años para registrarte.");
      setLoading(false);
      return;
    }

    try {
      // Cast club_id to Number and ensure it's not empty
      if (!formData.club_id) {
        setError("Por favor, selecciona un club.");
        setLoading(false);
        return;
      }

      await authService.register({
        ...formData,
        age: Number(formData.age),
        club_id: Number(formData.club_id)
      });

      setShowConfirm(true);
      setMensaje("✅ Registro exitoso. ¡Bienvenido a Robotech!");
      e.target.reset();
    } catch (err) {
      setError(err.message || "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative transition-all duration-500"
      style={{ backgroundImage: `url(${resetbg})` }}
    >
      {/* Navbar - (Mismo código de antes) */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md z-50">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-white font-bold text-sm cursor-pointer hover:opacity-80 transition-all px-3 py-2 ml-2"
        >
          <img src={logoimg} alt="Logo" className="h-[45px] w-auto drop-shadow-[0_0_8px_rgba(0,198,255,0.7)]" />
          <h1 className="text-[1.7rem] m-0">Robotech</h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white hover:text-cyan-400 font-medium">Inicio</Link>
          <button onClick={() => navigate("/login")} className="px-6 py-2 border-2 border-cyan-400 rounded-lg text-cyan-400 hover:bg-cyan-400 hover:text-black transition">
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* Modal Confirm */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[9999] flex items-center justify-center">
          <div className="bg-black/70 border border-cyan-400 p-8 rounded-2xl text-center shadow-2xl max-w-sm w-[90%]">
            <img src={loadingGif} className="w-28 mx-auto mb-4" alt="success" />
            <h2 className="text-white text-xl font-semibold mb-2">¡Registro Exitoso!</h2>
            <p className="text-cyan-300 text-sm mb-6">Tu cuenta ha sido creada correctamente.</p>
            <button onClick={() => navigate("/login")} className="w-full py-2 bg-cyan-400 rounded-lg text-black font-bold hover:bg-white transition">Ir al Login</button>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="absolute md:right-[5%] left-1/2 md:left-auto top-1/2 transform -translate-x-1/2 md:translate-x-0 -translate-y-1/2 bg-black/85 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/70 scrollbar-track-transparent">

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Únete a Robotech</h2>
          <p className="text-gray-400 text-sm">Registro estricto de competidores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">





          <div className="relative">
            <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <select
              name="club_id"
              onChange={handleChange}
              required
              className="w-full pl-12 pr-3 py-3 rounded-lg text-white bg-[#0A0F24] border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none appearance-none cursor-pointer"
              value={formData.club_id}
            >
              <option value="" disabled>Selecciona tu Club</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required className="w-full pl-10 pr-2 py-3 rounded-lg text-white bg-transparent border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none" />
            </div>
            <div className="relative">
              <FaUserTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" name="lastName" placeholder="Apellidos" onChange={handleChange} required className="w-full pl-10 pr-2 py-3 rounded-lg text-white bg-transparent border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <FaSmile className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" name="nickname" placeholder="Apodo" onChange={handleChange} required className="w-full pl-10 pr-2 py-3 rounded-lg text-white bg-transparent border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none" />
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="number" name="age" placeholder="Edad (Min 18)" min="18" max="99" onChange={handleChange} required className="w-full pl-10 pr-2 py-3 rounded-lg text-white bg-transparent border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none" />
            </div>
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} required className="w-full pl-12 pr-3 py-3 rounded-lg text-white bg-transparent border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none" />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type={showPassword ? "text" : "password"} name="user_password" placeholder="Contraseña" onChange={handleChange} required className="w-full pl-12 pr-12 py-3 rounded-lg text-white bg-transparent border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg cursor-pointer" onClick={togglePassword}>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
          </div>

          {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

          <button type="submit" disabled={loading} className={`w-full py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-cyan-400 text-black hover:bg-white"}`}>
            {loading ? "Registrando..." : <><FaPaperPlane /> Registrarme</>}
          </button>
        </form>




      </div>
    </div>
  );
}

export default RegistroCompetidor;
