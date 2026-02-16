import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import logoimg from "../assets/images/logo.png";
import resetbg from "../assets/images/reset.png";
import resettablet from "../assets/images/resettablet.png";
import resetmovil from "../assets/images/resetmovil.png";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService"; // Importamos el servicio

function LoginPage() {
  const [menuActive, setMenuActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [background, setBackground] = useState(resetbg);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Nuevo estado de carga

  const toggleMenu = () => setMenuActive(!menuActive);
  const closeMenu = () => setMenuActive(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el estado de carga

    try {
      // Usamos Promise.all para esperar al menos 2 segundos mientras se hace el login
      const [data] = await Promise.all([
        authService.login(email, password),
        new Promise((resolve) => setTimeout(resolve, 2000)) // Retardo simulado de 2 segundos
      ]);

      // Redirigir al menú
      navigate("/menu", { state: { fromLogin: true, user: data.user }, replace: true });

    } catch (error) {
      console.error("Error de conexión:", error);
      alert(error.message || "No se pudo conectar con el servidor backend.");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  // Actualiza el fondo según el tamaño de pantalla
  useEffect(() => {
    const updateBackground = () => {
      const width = window.innerWidth;
      if (width < 640) setBackground(resetmovil);
      else if (width < 1024) setBackground(resettablet);
      else setBackground(resetbg);
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  // ✅ HEADER como Portal (siempre fijo, sin interferencia de padres)
  const HeaderPortal = () => (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-[5%] py-5 bg-black/50 backdrop-blur-sm z-[1000]">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 text-white font-bold text-sm cursor-pointer hover:opacity-80 transition-all"
      >
        <img
          src={logoimg}
          alt="Logo Robotech"
          className="h-[45px] w-auto drop-shadow-[0_0_8px_rgba(0,198,255,0.7)]"
        />
        <h1 className="text-[1.7rem] m-0">Robotech</h1>
      </div>

      {/* Botón hamburguesa móvil */}
      <button
        className={`md:hidden flex flex-col justify-between w-7 h-5 relative z-[1100] ${menuActive ? "rotate-90" : ""
          }`}
        onClick={toggleMenu}
      >
        <span
          className={`block h-[3px] bg-cyan-400 rounded transition-all duration-300 ${menuActive ? "rotate-45 translate-y-[8px]" : ""
            }`}
        ></span>
        <span
          className={`block h-[3px] bg-cyan-400 rounded transition-all duration-300 ${menuActive ? "opacity-0" : ""
            }`}
        ></span>
        <span
          className={`block h-[3px] bg-cyan-400 rounded transition-all duration-300 ${menuActive ? "-rotate-45 -translate-y-[8px]" : ""
            }`}
        ></span>
      </button>

      {/* Links desktop */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex gap-5">
          <Link to="/" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">
            Inicio
          </Link>
          <a onClick={() => navigate("/menu?vista=ranking")} href="#" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">
            Ranking
          </a>
          <a onClick={() => navigate("/menu?vista=clubs")} href="#" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">
            Clubs
          </a>
        </div>
        <button
          onClick={() => navigate("/register")}
          className="relative flex items-center gap-1 bg-neutral-600 px-9 py-4 border-4 border-black text-base bg-inherit rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 hover:text-black hover:rounded-3xl group"
        >
          <svg
            viewBox="0 0 24 24"
            className="absolute w-6 fill-white z-[9] transition-all duration-700 -left-1/4 group-hover:left-4 group-hover:fill-[#212121]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
          <span className="relative z-[1] transition-all duration-700 -translate-x-3 group-hover:translate-x-3">
            Registrar
          </span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full opacity-0 transition-all duration-700 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"></span>
          <svg
            viewBox="0 0 24 24"
            className="absolute w-6 fill-white z-[9] transition-all duration-700 right-4 group-hover:-right-1/4 group-hover:fill-[#212121]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* ✅ Fondo fijo, sin interferir con layout */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${background})` }}
      />

      {/* ✅ Contenido principal */}
      <div className="relative min-h-screen text-white font-[Segoe_UI] z-10 pt-20">
        {/* Menú móvil (no necesita portal, está en overlay) */}
        <div
          className={`fixed top-0 right-0 h-screen w-[70%] bg-black/90 backdrop-blur-lg border-l-2 border-cyan-400 flex flex-col items-center justify-center gap-6 text-white transform transition-all duration-500 z-[999] ${menuActive ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            } md:hidden`}
        >
          <button
            onClick={closeMenu}
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          >
            <span className="absolute w-5 h-[2px] bg-cyan-400 rotate-45"></span>
            <span className="absolute w-5 h-[2px] bg-cyan-400 -rotate-45"></span>
          </button>

          <Link to="/" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">
            Inicio
          </Link>
          <a onClick={() => navigate("/menu?vista=ranking")} href="#" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">
            Ranking
          </a>
          <a onClick={() => navigate("/menu?vista=clubs")} href="#" className="text-white font-medium border-b-2 border-transparent hover:border-cyan-400 transition-all">
            Clubs
          </a>
          <button
            onClick={() => navigate("/register")}
            className="relative flex items-center gap-1 bg-neutral-600 px-9 py-4 border-4 border-black text-base bg-inherit rounded-xl font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 hover:text-black hover:rounded-3xl group"
          >
            <svg
              viewBox="0 0 24 24"
              className="absolute w-6 fill-white z-[9] transition-all duration-700 -left-1/4 group-hover:left-4 group-hover:fill-[#212121]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
            <span className="relative z-[1] transition-all duration-700 -translate-x-3 group-hover:translate-x-3">
              Registrar
            </span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full opacity-0 transition-all duration-700 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"></span>
            <svg
              viewBox="0 0 24 24"
              className="absolute w-6 fill-white z-[9] transition-all duration-700 right-4 group-hover:-right-1/4 group-hover:fill-[#212121]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
            </svg>
          </button>
          <p className="text-gray-300 text-center mt-6 border-t border-white/20 pt-4 max-w-[250px]">
            Bienvenido a <strong>Robotech</strong>
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-black/85 text-center p-8 rounded-2xl shadow-2xl w-[90%] max-w-[400px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:right-[3%] md:left-auto md:translate-x-0">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-1">¡Bienvenido!</h2>
            <h3 className="text-2xl font-medium text-cyan-400">A Robotech</h3>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Usuario"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 text-white placeholder-gray-400 bg-transparent focus:ring-2 focus:ring-cyan-400 outline-none"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 text-white placeholder-gray-400 bg-transparent focus:ring-2 focus:ring-cyan-400 outline-none"
                required
                disabled={loading}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-lg"
                onClick={togglePassword}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <div className="text-right text-sm text-gray-300 mt-1 cursor-pointer hover:underline">
              <Link to="/contrasena">¿Olvidaste tu contraseña?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-lg transition-all ${loading
                ? "bg-gray-500 cursor-not-allowed text-gray-200"
                : "bg-cyan-400 text-black hover:bg-white"
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Cargando...</span>
                </div>
              ) : (
                "Ingresar"
              )}
            </button>

            <div className="text-gray-300 text-sm space-y-2">
              <div>
                ¿No cuentas con una cuenta?{" "}
                <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
                  Regístrate ahora!
                </Link>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/register-leader")}
                  className="w-full py-2 bg-transparent border border-cyan-400 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400 hover:text-black transition-all"
                >
                  Registrar como Dueño de Club
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ RENDERIZA EL HEADER DIRECTAMENTE EN EL BODY */}
      {typeof document !== "undefined"
        ? createPortal(<HeaderPortal />, document.body)
        : null}
    </>
  );
}

export default LoginPage;