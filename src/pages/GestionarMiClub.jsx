import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    CheckCircle2,
    XCircle,
    UserMinus,
    Image as ImageIcon,
    Save,
    Clock,
    UserCheck
} from "lucide-react";
import { authService } from "../services/authService";
import { API_BASE_URL } from "../config/api";
import loadingGif from "../assets/images/loading.gif";

export default function GestionarMiClub({ clubId }) {
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newLogoUrl, setNewLogoUrl] = useState("");
    const [showSaveMessage, setShowSaveMessage] = useState(false);

    const fetchClubData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/clubs/${clubId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setClub(data);
                setNewLogoUrl(data.logo || "");
            } else {
                setError("Error al cargar los datos del club");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clubId) fetchClubData();
    }, [clubId]);

    const handleUpdateMember = async (userId, isApproved) => {
        setActionLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem("user"));
            await authService.updateUserProfile(userId, {
                competitor: {
                    club_id: Number(clubId),
                    is_approved: isApproved
                }
            });
            await fetchClubData();
        } catch (err) {
            alert("Error al actualizar miembro: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleExpelMember = async (userId) => {
        if (!window.confirm("¿Estás seguro de que deseas expulsar a este competidor?")) return;
        setActionLoading(true);
        try {
            // Para expulsar, simplemente quitamos el club_id o lo ponemos en null (si el backend lo permite)
            // Pero según el backend, club_id es requerido en el schema si existe relación.
            // Así que lo ideal sería una ruta de eliminación, pero usaremos el PATCH para desvincular si es posible.
            // O simplemente marcar como no aprobado.
            await authService.updateUserProfile(userId, {
                competitor: {
                    club_id: Number(clubId),
                    is_approved: false // Lo desaprobamos
                }
            });
            await fetchClubData();
        } catch (err) {
            alert("Error al expulsar miembro");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateLogo = async () => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/clubs/${clubId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ logo: newLogoUrl })
            });
            if (response.ok) {
                setShowSaveMessage(true);
                setTimeout(() => setShowSaveMessage(false), 3000);
                await fetchClubData();
            }
        } catch (err) {
            alert("Error al actualizar logo");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <img src={loadingGif} alt="loading" className="w-12 h-12" />
            <p className="text-cyan-400 animate-pulse uppercase tracking-widest text-xs font-bold">Cargando gestión del club...</p>
        </div>
    );

    if (error) return <div className="text-red-400 p-8 text-center">{error}</div>;

    const pendingRequests = club?.competitors?.filter(c => !c.is_approved) || [];
    const activeMembers = club?.competitors?.filter(c => c.is_approved) || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* HEADER GESTIÓN */}
            <div className="bg-[#101735] border border-[#1E90FF33] rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-black/40 flex items-center justify-center">
                            {club?.logo ? (
                                <img src={club.logo} alt="Club Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Users size={48} className="text-gray-600" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">{club?.name}</h2>
                        <p className="text-gray-400 text-sm max-w-md">{club?.fiscal_address}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                            <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                                {activeMembers.length} MIEMBROS ACTÍVOS
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold">
                                {pendingRequests.length} SOLICITUDES PENDIENTES
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto space-y-3">
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                value={newLogoUrl}
                                onChange={(e) => setNewLogoUrl(e.target.value)}
                                placeholder="URL del nuevo logo"
                                className="w-full md:w-64 pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleUpdateLogo}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={14} /> Actualizar Logo
                        </button>
                        {showSaveMessage && <p className="text-[10px] text-green-400 text-center animate-bounce">¡Cambios guardados!</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SOLICITUDES PENDIENTES */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <Clock size={18} className="text-yellow-400" />
                        <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Solicitudes Pendientes</h3>
                    </div>

                    <div className="space-y-3">
                        {pendingRequests.length === 0 ? (
                            <div className="p-8 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-gray-500 text-sm">No hay solicitudes nuevas por el momento.</p>
                            </div>
                        ) : (
                            pendingRequests.map((req, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={req.user.id}
                                    className="bg-[#101735] border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-4 hover:border-yellow-500/40 transition-all group"
                                >
                                    <img
                                        src={req.user.profile_picture || "https://www.gravatar.com/avatar/0000?d=mp&f=y"}
                                        alt={req.user.nickname}
                                        className="w-12 h-12 rounded-full border border-white/10 object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-sm tracking-tight">{req.user.name} {req.user.lastName}</h4>
                                        <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">@{req.user.nickname}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleUpdateMember(req.user.id, true)}
                                            disabled={actionLoading}
                                            className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                            title="Aceptar"
                                        >
                                            <UserCheck size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleExpelMember(req.user.id)}
                                            disabled={actionLoading}
                                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                            title="Rechazar"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* MIEMBROS ACTIVOS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <CheckCircle2 size={18} className="text-green-400" />
                        <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Miembros del Club</h3>
                    </div>

                    <div className="space-y-3">
                        {activeMembers.length === 0 ? (
                            <div className="p-8 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-gray-500 text-sm">Aún no tienes miembros en tu club.</p>
                            </div>
                        ) : (
                            activeMembers.map((member, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={member.user.id}
                                    className="bg-[#101735] border border-[#1E90FF33] rounded-2xl p-4 flex items-center gap-4 hover:border-cyan-500/30 transition-all group"
                                >
                                    <img
                                        src={member.user.profile_picture || "https://www.gravatar.com/avatar/0000?d=mp&f=y"}
                                        alt={member.user.nickname}
                                        className="w-12 h-12 rounded-full border border-white/10 object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-sm tracking-tight">{member.user.name} {member.user.lastName}</h4>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Miembro Activo
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleExpelMember(member.user.id)}
                                        disabled={actionLoading}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all"
                                        title="Expulsar"
                                    >
                                        <UserMinus size={18} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* OVERLAY CARGA ACCIONES */}
            <AnimatePresence>
                {actionLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
                    >
                        <div className="relative">
                            <img src={loadingGif} alt="loading" className="w-20 h-20" />
                            <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-white font-black uppercase tracking-[0.2em] italic text-sm">Procesando Cambio...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
