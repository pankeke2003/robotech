
import { useState, useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { clubService } from '../../services/clubService';
import { FaBuilding, FaMapMarkerAlt, FaPaperPlane, FaUpload, FaIdCard, FaTimes, FaHourglassHalf } from 'react-icons/fa';
import loadingGif from "../../assets/images/loading.gif";
import { motion, AnimatePresence } from 'framer-motion';

// Fix for Leaflet marker icons not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, setAddress }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setAddress(`Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}`);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function CrearClubView({ onClubCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        fiscal_address: '',
        dni: '',
        logo: '',
    });
    const [mapPosition, setMapPosition] = useState(null);
    const [userInfo, setUserInfo] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const isCompetitor = userInfo?.role === 'competitor';

    // Default center (Lima, Peru)
    const defaultCenter = { lat: -12.046374, lng: -77.042793 };

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await clubService.createClub({
                ...formData,
                fiscal_address: formData.fiscal_address || (mapPosition ? `Lat: ${mapPosition.lat}, Lng: ${mapPosition.lng}` : '')
            });

            if (isCompetitor) {
                setShowModal(true);
            } else {
                setSuccess(true);
                if (onClubCreated) onClubCreated();
            }
        } catch (err) {
            setError(err.message || "Error al crear el club.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSuccess(true);
        if (onClubCreated) onClubCreated();
    };

    if (success && !showModal) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <FaBuilding className="text-green-400 text-4xl" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                    {isCompetitor ? "¡Solicitud Enviada!" : "¡Club Creado!"}
                </h3>
                <p className="text-gray-400 mb-8 max-w-md">
                    {isCompetitor
                        ? "Tu solicitud ha sido enviada al administrador. Una vez aprobada, tendrás acceso completo a las funciones de dueño."
                        : "Tu club ha sido registrado exitosamente en la plataforma. Ahora puedes empezar a gestionar torneos y miembros."}
                </p>
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 mb-8 w-full max-w-sm">
                    <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Nombre del Club</p>
                    <p className="text-cyan-400 font-bold text-xl">{formData.name}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-4 lg:p-8 overflow-y-auto custom-scrollbar">

            {/* LEFT COLUMN: FORM */}
            <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-white mb-2">Crear mi Club</h2>
                    <p className="text-gray-400">
                        {isCompetitor
                            ? "Postula para administrar tu propio club de robótica. Tu solicitud será revisada por un administrador."
                            : "Inicia tu legado en la robótica competitiva. Completa la información para registrar tu organización oficial."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Club Name Input */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Nombre de la Organización</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaBuilding className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej. Robotech Dynamics"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-[#0B1124] border border-[#1E90FF33] rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Logo URL Input */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">URL del Logo (Opcional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaUpload className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/logo.png"
                                className="w-full pl-11 pr-4 py-3 bg-[#0B1124] border border-[#1E90FF33] rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* DNI Input (Only for competitors) */}
                    {isCompetitor && (
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">DNI del Solicitante</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaIdCard className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu DNI"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-[#0B1124] border border-[#1E90FF33] rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Address Input */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Dirección Fiscal / Sede</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaMapMarkerAlt className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="fiscal_address"
                                value={formData.fiscal_address}
                                onChange={handleChange}
                                placeholder="Selecciona una ubicación en el mapa..."
                                required
                                className="w-full pl-11 pr-4 py-3 bg-[#0B1124] border border-[#1E90FF33] rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 pl-1">
                            * Puedes escribir la dirección o hacer clic en el mapa para autocompletar.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${loading
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 hover:shadow-cyan-500/40"
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-3">
                                <img src={loadingGif} className="w-5 h-5 opacity-50" alt="loading" />
                                <span>Procesando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <FaPaperPlane />
                                <span>{isCompetitor ? "Enviar Solicitud" : "Registrar Club"}</span>
                            </div>
                        )}
                    </button>

                </form>
            </div>

            {/* RIGHT COLUMN: MAP */}
            <div className="flex-1 h-[400px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden border border-[#1E90FF33] relative shadow-2xl">
                <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        position={mapPosition}
                        setPosition={setMapPosition}
                        setAddress={(addr) => setFormData(prev => ({ ...prev, fiscal_address: addr }))}
                    />
                </MapContainer>

                {/* Map Overlay Badge */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 z-[400] text-xs text-gray-300 flex items-center gap-2 pointer-events-none">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Modo Selección Activo</span>
                </div>
            </div>

            {/* MODAL DE ESPERAR SOLICITUD */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#101735] border border-cyan-500/30 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaHourglassHalf className="text-cyan-400 text-3xl animate-spin-slow" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Esperar Solicitud</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Tu solicitud para crear el club <span className="text-white font-bold">{formData.name}</span> ha sido enviada exitosamente.
                                    Por favor, espera a que un administrador apruebe tu solicitud. Se te notificará una vez sea aceptada.
                                </p>

                                <button
                                    onClick={handleCloseModal}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span>Entendido, cerrar</span>
                                    <FaTimes className="group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            <style jsx>{`
                                @keyframes spin-slow {
                                    from { transform: rotate(0deg); }
                                    to { transform: rotate(360deg); }
                                }
                                .animate-spin-slow {
                                    animation: spin-slow 3s linear infinite;
                                }
                            `}</style>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
