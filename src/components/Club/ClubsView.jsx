import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dataService } from "../../services/dataService";
import { clubService } from "../../services/clubService";
import { Skeleton } from "../ui/Skeleton";

const ClubsView = ({ onSelectClub, isFromLogin, searchTerm = "" }) => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState("Todos");
    const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joiningId, setJoiningId] = useState(null);

    const handleJoin = async (club) => {
        setJoiningId(club.id);
        try {
            await clubService.joinClub(club.id);
            alert(`¡Solicitud enviada al club ${club.nombre}! Tu membresía está pendiente de aprobación.`);
        } catch (err) {
            alert(err.message || "Error al intentar unirse al club");
        } finally {
            setJoiningId(null);
        }
    };

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await dataService.getClubs({ take: 50 });
                const fetchedData = response.data || [];

                const mappedClubs = fetchedData.map(c => ({
                    id: c.id,
                    nombre: c.name,
                    puntos: Math.floor(Math.random() * 5000) + 1000, // Placeholder
                    jugadoresActuales: c._count?.members || 0, // Si el backend retorna counts
                    minimo: 5,
                    maximo: 20,
                    estado: "Disponible", // Lógica custom si es necesario
                    creado: new Date(c.created_at || Date.now()).toLocaleDateString(),
                    categoria: "General", // Placeholder
                    rank: Math.floor(Math.random() * 10) + 1,
                    lider: c.owner_id ? `Dueño #${c.owner_id}` : "Desconocido",
                    descripcion: c.fiscal_address || "Club de robótica profesional.",
                    participantes: [], // Placeholder details
                    partidas: [],
                    image: c.logo || `https://picsum.photos/800/400?random=${c.id + 10}`
                }));

                setClubs(mappedClubs);
            } catch (error) {
                console.error("Error loading clubs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const filteredClubs = clubs.filter(c => {
        const matchStatus = activeStatus === "Todos" || c.estado === activeStatus;
        const matchSearch = (c.nombre || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="relative text-center h-full overflow-y-auto flex flex-col w-full custom-scrollbar">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[#0B1124] -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#1E90FF 1px, transparent 1px), linear-gradient(90deg, #1E90FF 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 flex flex-col flex-1"
            >
                {/* Header */}
                <div className="mb-4 md:mb-8">
                    <h2 className="text-2xl md:text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">
                        Arena de <span className="text-[#00C2FF]">Clubes</span>
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto uppercase tracking-widest font-bold opacity-70">
                        Únete a la élite. Compite, progresa y domina el ranking nacional.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-3 mb-6 overflow-x-auto pb-2 px-4 no-scrollbar">
                    {["Todos", "Disponible", "Completo"].map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={`
                                px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border
                                ${activeStatus === status
                                    ? 'bg-[#00C2FF] border-[#00C2FF] text-[#0A0F24] shadow-[0_0_20px_rgba(0,194,255,0.3)]'
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}
                            `}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-6">
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="bg-[#131B36]/80 border border-white/5 rounded-2xl overflow-hidden h-auto flex flex-col">
                                <Skeleton className="h-48 w-full" />
                                <div className="p-5 flex flex-col gap-4 flex-1">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-20 rounded" />
                                        <Skeleton className="h-3 w-16 rounded" />
                                    </div>
                                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                                    <div className="space-y-2 mt-auto">
                                        <Skeleton className="h-3 w-full rounded" />
                                        <Skeleton className="h-2 w-full rounded-full" />
                                        <div className="flex justify-between pt-2">
                                            <Skeleton className="h-3 w-16 rounded" />
                                            <Skeleton className="h-3 w-16 rounded" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Skeleton className="h-10 flex-1 rounded-lg" />
                                        <Skeleton className="h-10 w-20 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredClubs.map((club, index) => (
                            <motion.div
                                key={club.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group bg-[#131B36]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-[#1E90FF]/30 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,194,255,0.2)] h-auto flex flex-col"
                            >
                                <div className="aspect-[16/9] w-full relative">
                                    <img src={club.image} alt={club.nombre} className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#131B36] to-transparent"></div>
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border drop-shadow-lg ${club.estado === 'Disponible' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
                                            }`}>
                                            {club.estado}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3 sm:p-5 text-left flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black text-[#00C2FF] uppercase tracking-widest opacity-80">{club.categoria}</span>
                                        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Rank #{club.rank}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-[#00C2FF] transition-colors">{club.nombre}</h3>

                                    <div className="space-y-2 mb-6 opacity-80">
                                        <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                                            <span>Jugadores:</span>
                                            <span className="text-white">{club.jugadoresActuales}/{club.maximo}</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 to-[#00C2FF]"
                                                style={{ width: `${(club.jugadoresActuales / club.maximo) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                                            <span>Puntaje:</span>
                                            <span className="text-[#00C2FF]">{club.puntos} PTS</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onSelectClub(club)}
                                            className="flex-1 bg-white/5 hover:bg-[#1E90FF] text-white hover:text-[#0A0F24] text-[10px] font-black uppercase py-2.5 rounded-lg border border-white/10 hover:border-[#1E90FF] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Info size={14} /> Detalles
                                        </button>
                                        <button
                                            disabled={club.estado === 'Completo' || joiningId === club.id}
                                            onClick={() => isFromLogin ? handleJoin(club) : setModalRegistroAbierto(true)}
                                            className={`px-4 bg-transparent border border-[#1E90FF]/30 text-[#00C2FF] hover:bg-[#1E90FF]/10 disabled:opacity-30 disabled:pointer-events-none py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${joiningId === club.id ? 'animate-pulse' : ''}`}
                                        >
                                            {joiningId === club.id ? "Uniéndose..." : "Unirme"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>

            {/* REGISTRATION MODAL */}
            <AnimatePresence>
                {modalRegistroAbierto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-[#0A0F24]/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setModalRegistroAbierto(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#131B36] border border-white/10 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-[#1E90FF] mb-6 shadow-inner">
                                    <Plus size={40} className="rotate-45" />
                                </div>

                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                                    Requiere Cuenta
                                </h3>

                                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest leading-relaxed mb-8">
                                    Necesitas tener una cuenta de <span className="text-white">competidor</span> para unirte a un club.
                                </p>

                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="w-full py-4 bg-[#1E90FF] hover:bg-[#00C2FF] text-[#0A0F24] rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-blue-500/20"
                                    >
                                        Ir a registrarme
                                    </button>
                                    <button
                                        onClick={() => setModalRegistroAbierto(false)}
                                        className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClubsView;
