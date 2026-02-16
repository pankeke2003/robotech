import { useState, useCallback } from "react";
import logoimg from "../assets/images/logo.png";
import resetbg from "../assets/images/reset.png";
import { useNavigate } from "react-router-dom";
import loadingGif from "../assets/images/loading.gif";
import { clubService } from "../services/clubService";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import {
    FaBuilding,
    FaMapMarkerAlt,
    FaPaperPlane,
} from "react-icons/fa";

const containerStyle = {
    width: '100%',
    height: '300px'
};

// Default center (can be user's location)
const center = {
    lat: -12.046374,
    lng: -77.042793
};

function PostularClub() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [location, setLocation] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        fiscal_address: "",
    });

    // Load Google Maps Script
    // TODO: Replace 'YOUR_API_KEY' with actual key or env variable
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "YOUR_API_KEY" // ⚠️ User needs to provide this
    });

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setLocation({ lat, lng });
        setFormData(prev => ({
            ...prev,
            fiscal_address: `${prev.fiscal_address || ''} [Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}]`
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Enviar al backend (asegurar tener token)
            await clubService.createClub({
                ...formData,
                // Si el backend soporta coordenadas separadas, enviarlas. Si solo address, ya concatenamos.
            });
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Error al crear el club.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center text-white relative flex items-center justify-center p-4 transition-all duration-500"
            style={{ backgroundImage: `url(${resetbg})` }}
        >
            <div className="absolute top-6 left-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <img src={logoimg} alt="Logo" className="h-10 w-auto drop-shadow-lg" />
                <h1 className="text-2xl font-bold">Robotech</h1>
            </div>

            <div className="bg-black/90 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center border border-gray-800">
                <h2 className="text-3xl font-bold mb-2">Crear mi Club</h2>
                <p className="text-gray-400 text-sm mb-6">Postula para administrar tu propio club de robótica.</p>

                {success ? (
                    <div className="flex flex-col items-center animate-fade-in-up">
                        <h3 className="text-xl font-semibold text-green-400 mb-4">¡Solicitud Enviada!</h3>
                        <p className="text-gray-300">Tu club ha sido creado exitosamente.</p>
                        <button
                            onClick={() => navigate("/menu")}
                            className="mt-6 px-6 py-2 bg-cyan-400 text-black rounded-lg font-bold hover:bg-white transition"
                        >
                            Ir al Menú
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 text-left">

                        {/* Nombre del Club */}
                        <div className="relative">
                            <label className="text-sm text-gray-400 mb-1 block pl-2">Nombre del Club</label>
                            <div className="relative">
                                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Ej. Robotech Lima"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Dirección Fiscal / Mapa */}
                        <div className="relative">
                            <label className="text-sm text-gray-400 mb-1 block pl-2">Ubicación / Dirección Fiscal</label>
                            <div className="relative mb-2">
                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Dirección fiscal"
                                    value={formData.fiscal_address}
                                    onChange={(e) => setFormData({ ...formData, fiscal_address: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                />
                            </div>

                            {/* Google Maps Embed */}
                            <div className="rounded-xl overflow-hidden border border-gray-700 mt-4">
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={location || center}
                                        zoom={12}
                                        onLoad={onLoad}
                                        onUnmount={onUnmount}
                                        onClick={handleMapClick}
                                    >
                                        {/* Mostrar marcador si hay ubicación seleccionada */}
                                        {location && <Marker position={location} />}
                                    </GoogleMap>
                                ) : (
                                    <div className="h-[300px] bg-gray-800 flex items-center justify-center text-gray-500">
                                        Map Loading or API Key Missing...
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2 p-2">
                                    * Haz clic en el mapa para seleccionar la ubicación exacta.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 font-bold rounded-lg transition duration-200 mt-4 ${loading
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <img src={loadingGif} className="w-5 h-5" alt="loading" />
                                    <span>Procesando...</span>
                                </div>
                            ) : (
                                <span className="flex items-center justify-center gap-2"><FaPaperPlane /> Crear Club</span>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default PostularClub;
