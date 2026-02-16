import { useState, useEffect } from "react";
import logoimg from "../assets/images/logo.png";
import resetbg from "../assets/images/reset.png";
import { useNavigate, useParams } from "react-router-dom";
import loadingGif from "../assets/images/loading.gif";
import { authService } from "../services/authService";
import { FaLock, FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa";

function RestablecerContrasena() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    // Password Validation State
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        numberOrSpecial: false
    });

    useEffect(() => {
        setValidations({
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            numberOrSpecial: /[0-9!@#$%^&*]/.test(newPassword)
        });
    }, [newPassword]);

    const isPasswordValid = Object.values(validations).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!isPasswordValid) {
            setError("La contraseña no cumple con todos los requisitos.");
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, newPassword);
            setSuccess(true);
            setMessage("¡Contraseña restablecida con éxito!");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "Enlace inválido o expirado.");
        } finally {
            setLoading(false);
        }
    };

    const RequirementItem = ({ fulfilled, text }) => (
        <li className={`flex items-center gap-2 text-xs transition-colors duration-300 ${fulfilled ? "text-green-400" : "text-gray-500"}`}>
            {fulfilled ? <FaCheckCircle size={10} /> : <div className="w-2.5 h-2.5 rounded-full border border-gray-600"></div>}
            {text}
        </li>
    );

    return (
        <div
            className="min-h-screen bg-cover bg-center text-white relative flex items-center justify-center p-4 transition-all duration-500"
            style={{ backgroundImage: `url(${resetbg})` }}
        >
            {/* Simple Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="absolute top-6 left-6 flex items-center gap-3 cursor-pointer z-10" onClick={() => navigate("/")}>
                <img src={logoimg} alt="Logo" className="h-10 w-auto drop-shadow-lg" />
                <h1 className="text-2xl font-bold text-white tracking-wide">Robotech</h1>
            </div>

            <div className="bg-black/80 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-sm border border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">Restablecer</h2>
                    <p className="text-gray-400 text-sm">Crea una contraseña segura.</p>
                </div>

                {success ? (
                    <div className="flex flex-col items-center animate-fade-in-up py-8">
                        <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center mb-4">
                            <FaCheckCircle className="text-green-500 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">¡Actualizada!</h3>
                        <p className="text-gray-400 text-sm mb-6 text-center">Tu cuenta está segura ahora.</p>
                        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-[width_3s_linear_forwards] w-full origin-left"></div>
                        </div>
                        <p className="text-gray-500 text-xs mt-4">Redirigiendo...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* New Password */}
                        <div className="space-y-3">
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nueva contraseña"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full pl-11 pr-12 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {/* Visual Requirements Checklist - Minimalist */}
                            <ul className="grid grid-cols-2 gap-2 pl-1">
                                <RequirementItem fulfilled={validations.length} text="Mín. 8 caracteres" />
                                <RequirementItem fulfilled={validations.uppercase} text="Mayúscula" />
                                <RequirementItem fulfilled={validations.lowercase} text="Minúscula" />
                                <RequirementItem fulfilled={validations.numberOrSpecial} text="Número o Símbolo" />
                            </ul>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative group">
                            <FaCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                className={`w-full pl-11 pr-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:ring-1 outline-none transition-all ${confirmPassword && newPassword !== confirmPassword
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-600 focus:border-white focus:ring-white"
                                    }`}
                            />
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-400 text-xs pl-1">Las contraseñas no coinciden</p>
                        )}


                        {error && (
                            <div className="border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                                <FaExclamationCircle /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !isPasswordValid || newPassword !== confirmPassword}
                            className={`w-full py-3 font-bold rounded-lg transition duration-300 uppercase tracking-wider ${loading || !isPasswordValid || newPassword !== confirmPassword
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                : "bg-white text-black hover:bg-gray-200 border border-white"
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <img src={loadingGif} className="w-5 h-5 opacity-50 grayscale" alt="loading" />
                                    <span>Guardando...</span>
                                </div>
                            ) : (
                                "Establecer"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default RestablecerContrasena;
