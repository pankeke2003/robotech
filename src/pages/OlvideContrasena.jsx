import { useState } from "react";
import logoimg from "../assets/images/logo.png";
import resetbg from "../assets/images/reset.png";
import { useNavigate, Link } from "react-router-dom";
import loadingGif from "../assets/images/loading.gif";
import { authService } from "../services/authService"; // Importamos el servicio

// Íconos
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

function OlvideContrasena() {
  const [menuActive, setMenuActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const toggleMenu = () => setMenuActive(!menuActive);
  const closeMenu = () => setMenuActive(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    setError("");

    try {
      await authService.forgotPassword(email);
      setShowConfirm(true);
      setMensaje("📩 Se ha enviado un enlace de recuperación a tu correo.");
      setEmail(""); // Limpiar campo
    } catch (err) {
      setError(err.message || "Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative transition-all duration-500"
      style={{ backgroundImage: `url(${resetbg})` }}
    >
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md z-50">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-white font-bold text-sm cursor-pointer 
                     hover:opacity-80 transition-all px-3 py-2 ml-2"
        >
          <img
            src={logoimg}
            alt="Logo Robotech"
            className="h-[45px] w-auto drop-shadow-[0_0_8px_rgba(0,198,255,0.7)]"
          />
          <h1 className="text-[1.7rem] m-0">Robotech</h1>
        </div>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all"
            >
              Inicio
            </Link>
            <a onClick={() => navigate("/menu?vista=ranking")}
              href="#" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">Ranking</a>
            <a onClick={() => navigate("/menu?vista=clubs")} href="#" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">Clubs</a>

          </div>

          {/* BOTÓN REGRESAR */}
          <button
            onClick={() => navigate("/login")}
            className="relative flex items-center gap-1 bg-neutral-600 px-9 py-4 border-4 border-black 
                       text-base rounded-xl font-semibold text-white cursor-pointer overflow-hidden 
                       transition-all duration-600 ease-custom hover:text-black hover:rounded-3xl group"
          >
            <span className="relative z-[1] transition-all duration-700 ease-custom">
              Regresar
            </span>
            <span className="absolute w-5 h-5 bg-white rounded-full opacity-0 
                             group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 
                             top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700">
            </span>
          </button>
        </div>

        {/* HAMBURGUESA */}
        <button
          className="flex flex-col justify-between w-7 h-5 md:hidden"
          onClick={toggleMenu}
        >
          <span
            className={`h-1 rounded bg-cyan-400 transition-all ${menuActive ? "rotate-45 translate-y-2" : ""
              }`}
          ></span>
          <span
            className={`h-1 rounded bg-cyan-400 transition-all ${menuActive ? "opacity-0" : ""
              }`}
          ></span>
          <span
            className={`h-1 rounded bg-cyan-400 transition-all ${menuActive ? "-rotate-45 -translate-y-2" : ""
              }`}
          ></span>
        </button>
      </nav>

      {/* MENÚ MÓVIL */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 bg-black/95 backdrop-blur-md flex flex-col items-center 
                    justify-center gap-6 text-white transform transition-transform duration-500 border-l-2 
                    border-cyan-400 z-60 md:hidden ${menuActive ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          className="absolute top-5 right-5 text-cyan-400 text-2xl"
          onClick={closeMenu}
        >
          ✕
        </button>

        <Link to="/" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">
          Inicio
        </Link>
        <a onClick={() => navigate("/menu?vista=ranking")}
          href="#" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">Ranking</a>
        <a onClick={() => navigate("/menu?vista=clubs")} href="#" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">Clubs</a>


        <button
          onClick={() => navigate("/login")}
          className="relative flex items-center gap-1 bg-neutral-600 px-9 py-4 border-4 border-black 
                     text-base rounded-xl font-semibold text-white cursor-pointer overflow-hidden 
                     transition-all duration-600 ease-custom hover:text-black hover:rounded-3xl group"
        >
          <span className="z-[1]">Regresar</span>
        </button>
      </div>

      {/* MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[9999] flex items-center justify-center">
          <div className="bg-black/70 border border-cyan-400 p-8 rounded-2xl text-center shadow-2xl max-w-sm w-[90%]">
            <img src={loadingGif} className="w-28 mx-auto mb-4" />

            <h2 className="text-white text-xl font-semibold mb-2">
              Enlace enviado
            </h2>

            <p className="text-cyan-300 text-sm mb-6 leading-relaxed">
              Te enviamos un correo con instrucciones para recuperar tu contraseña.
            </p>

            <button
              onClick={() => setShowConfirm(false)}
              className="w-full py-2 bg-cyan-400 rounded-lg text-black font-bold hover:bg-white transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <div className="absolute top-1/2 left-1/2 md:left-auto md:right-10 transform 
                      -translate-x-1/2 md:translate-x-0 -translate-y-1/2 bg-black/85 p-8 
                      rounded-2xl shadow-2xl w-[90%] sm:w-[80%] md:w-full max-w-md text-center z-50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Recuperar Contraseña</h2>
          <h3 className="text-cyan-400 mt-1 text-sm font-semibold">
            Ingresa tu correo para enviarte un enlace
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              required
              disabled={loading}
              className="w-full pl-12 pr-3 py-3 rounded-lg text-white placeholder-gray-300 
                         bg-transparent border border-gray-700 focus:ring-2 
                         focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-cyan-400 text-black hover:bg-white"}`}
          >
            {loading ? "Enviando..." : <><FaPaperPlane /> Enviar enlace</>}
          </button>

          {error && (
            <p className="mt-4 text-red-400 font-medium text-sm">{error}</p>
          )}

          {mensaje && !showConfirm && (
            <p className="mt-4 text-cyan-300 font-medium text-sm">{mensaje}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default OlvideContrasena;
