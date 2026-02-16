import { useState, useEffect } from "react";
import logoimg from "../assets/images/logo.png";
import resetbg from "../assets/images/reset.png";
import resetmovil from "../assets/images/resetmovil.png";
import resettablet from "../assets/images/resettablet.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaIdCard, FaEnvelope, FaPaperPlane, FaSmile, FaCalendarAlt } from "react-icons/fa";
import { authService } from "../services/authService";
import loadingGif from "../assets/images/loading.gif";

function RegistroLider() {
    const [showPassword, setShowPassword] = useState(false);
    const [background, setBackground] = useState(resetbg);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        nickname: "",
        age: "",
        dni: "",
        email: "",
        user_password: "",
        role: "club_owner"
    });

    const togglePassword = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await authService.register({
                ...formData,
                age: Number(formData.age),
            });
            setShowConfirm(true);
        } catch (err) {
            setError(err.message || "Error al registrarse como dueño de club.");
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <>
            <div
                className="fixed inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${background})` }}
            />

            <div className="relative min-h-screen text-white font-[Segoe_UI] z-10 pt-20 flex items-center justify-center">
                {/* Navbar Simplificada */}
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
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 border-2 border-cyan-400 rounded-lg text-cyan-400 hover:bg-cyan-400 hover:text-black transition font-semibold"
                    >
                        Iniciar Sesión
                    </button>
                </nav>

                {/* Modal Confirm */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[9999] flex items-center justify-center">
                        <div className="bg-black/70 border border-cyan-400 p-8 rounded-2xl text-center shadow-2xl max-w-sm w-[90%]">
                            <img src={loadingGif} className="w-28 mx-auto mb-4" alt="success" />
                            <h2 className="text-white text-xl font-semibold mb-2">¡Registro Exitoso!</h2>
                            <p className="text-cyan-300 text-sm mb-6">Tu cuenta de Dueño de Club ha sido creada correctamente.</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-2 bg-cyan-400 rounded-lg text-black font-bold hover:bg-white transition"
                            >
                                Ir al Login
                            </button>
                        </div>
                    </div>
                )}

                {/* Formulario Estilo Login */}
                <div className="bg-black/85 text-center p-8 rounded-2xl shadow-2xl w-[90%] max-w-[450px] md:mr-[3%] md:ml-auto">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-1">Registro</h2>
                        <h3 className="text-2xl font-medium text-cyan-400">Dueño de Club</h3>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="relative">
                            <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                placeholder="DNI"
                                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 text-white placeholder-gray-400 bg-transparent focus:ring-2 focus:ring-cyan-400 outline-none"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <FaSmile className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    placeholder="Apodo"
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 text-white placeholder-gray-400 bg-transparent focus:ring-2 focus:ring-cyan-400 outline-none"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Edad"
                                    min="18"
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 text-white placeholder-gray-400 bg-transparent focus:ring-2 focus:ring-cyan-400 outline-none"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 text-white placeholder-gray-400 bg-transparent focus:ring-2 focus:ring-cyan-400 outline-none"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Apellidos"
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 text-white placeholder-gray-400 bg-transparent focus:ring-2 focus:ring-cyan-400 outline-none"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Correo Electrónico"
                                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 text-white placeholder-gray-400 bg-transparent focus:ring-2 focus:ring-cyan-400 outline-none"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="user_password"
                                value={formData.user_password}
                                onChange={handleChange}
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

                        {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${loading
                                ? "bg-gray-500 cursor-not-allowed text-gray-200"
                                : "bg-cyan-400 text-black hover:bg-white"
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Registrando...</span>
                                </div>
                            ) : (
                                <><FaPaperPlane /> Registrarse</>
                            )}
                        </button>

                        <div className="text-gray-300 text-sm">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
                                Inicia Sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegistroLider;
