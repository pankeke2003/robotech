import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Gavel, Star } from 'lucide-react';
import { dataService } from "../../services/dataService";
import { Skeleton } from "../ui/Skeleton";

const TorneosView = ({ navigate, isFromLogin, searchTerm = "" }) => {
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [activeStatus, setActiveStatus] = useState("Todos");
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ["Todos", "Combate", "Carreras", "Sumo", "Drones", "Estrategia"];
    const statuses = ["Todos", "En Curso", "Inscripciones", "Próximo"];

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await dataService.getTournaments({ take: 50 });
                const fetchedData = response.data || [];

                // Mapear datos del backend al formato visual del frontend
                const mappedTournaments = fetchedData.map(t => ({
                    id: t.id,
                    title: t.title,
                    // Si category es objeto usa name, de lo contrario usa "General" o el string
                    category: t.category?.name || "General",
                    status: mapStatus(t.status), // Función helper si es necesario
                    type: "Nacional", // Placeholder o derivado de ubicación
                    prize: "$1,000", // Placeholder (campo prize no confirmado en backend)
                    location: t.location || "Online",
                    slots: t.current_participants || 0,
                    maxSlots: t.max_participants || 32,
                    judge: "Árbitro Oficial", // Placeholder o relation
                    score: 1000, // Placeholder
                    image: (t.id % 8) + 1 // Random image logic preserved
                }));
                setTournaments(mappedTournaments);
            } catch (error) {
                console.error("Failed to fetch tournaments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    const mapStatus = (backendStatus) => {
        // Mapeo simple de status backend (enum) a frontend labels
        const statusMap = {
            'OPEN': 'Inscripciones',
            'IN_PROGRESS': 'En Curso',
            'FINISHED': 'Finalizado',
            'CANCELED': 'Cancelado'
        };
        return statusMap[backendStatus] || 'Próximo';
    };

    const filteredTournaments = tournaments.filter(t => {
        const matchCat = activeCategory === "Todos" || t.category === activeCategory;
        const matchStat = activeStatus === "Todos" || t.status === activeStatus;
        const matchSearch = ((t.title || "").toLowerCase()).includes(searchTerm.toLowerCase()) ||
            ((t.category || "").toLowerCase()).includes(searchTerm.toLowerCase());
        return matchCat && matchStat && matchSearch;
    });

    return (
        <div className="relative text-center h-full overflow-y-auto flex flex-col w-full custom-scrollbar">
            {/* === Fondo animado === */}
            <div className="fixed inset-0 bg-[#0B1124] -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                {/* Grid Pattern sutil */}
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(#1E90FF 1px, transparent 1px), linear-gradient(90deg, #1E90FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
            </div>

            <div className="relative z-10 p-6 flex flex-col flex-1 min-h-0">

                {/* HEADER SECCIÓN */}
                <div className="mb-4 md:mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-4xl font-extrabold text-white mb-2"
                    >
                        Torneos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Activos</span>
                    </motion.h2>
                    <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto">
                        Competencia de alto nivel. Revisa los detalles y el puntaje oficial.
                    </p>
                </div>

                {/* BARRA DE FILTROS */}
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
                    {/* ... (existing filter code) ... */}
                    {/* Categorías */}
                    <div className="flex flex-wrap gap-2 justify-center bg-[#0F1629] p-1.5 rounded-full border border-white/5">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                    px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 relative
                    ${activeCategory === cat ? 'text-white' : 'text-gray-400 hover:text-white'}
                  `}
                            >
                                {activeCategory === cat && (
                                    <motion.div
                                        layoutId="catBubble"
                                        className="absolute inset-0 bg-blue-600/20 border border-blue-500/30 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </button>
                        ))}
                    </div>

                    {/* Separador móvil */}
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>

                    {/* Estados */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {statuses.map(st => (
                            <button
                                key={st}
                                onClick={() => setActiveStatus(st)}
                                className={`
                   px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg border transition-all
                   ${activeStatus === st
                                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                        : 'border-transparent bg-white/5 text-gray-500 hover:bg-white/10'}
                 `}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                </div>

                {/* GRID DE RESULTADOS */}
                <div className="pb-4">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-[#131B36]/80 border border-white/5 rounded-2xl overflow-hidden h-auto flex flex-col">
                                    <Skeleton className="h-40 w-full" />
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-20 rounded" />
                                            <Skeleton className="h-4 w-12 rounded-full" />
                                        </div>
                                        <Skeleton className="h-6 w-3/4 rounded" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-1/2 rounded" />
                                            <Skeleton className="h-3 w-1/3 rounded" />
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-white/5">
                                            <Skeleton className="h-4 w-16 rounded" />
                                            <Skeleton className="h-6 w-24 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredTournaments.length === 0 ? (
                        <div className="text-gray-500 text-center py-20">No se encontraron torneos activos.</div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredTournaments.map((t) => (
                                    <motion.div
                                        key={t.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group relative bg-[#131B36]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,194,255,0.15)] hover:bg-[#162041] h-auto flex flex-col"
                                    >
                                        {/* Etiqueta Estado flotante */}
                                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                                            <span className={`
                      backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border
                      ${t.status === 'En Curso' ? 'bg-green-500/10 border-green-500/20 text-green-400' : ''}
                      ${t.status === 'Inscripciones' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
                      ${t.status === 'Próximo' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}
                    `}>
                                                {t.status === 'En Curso' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />}
                                                {t.status}
                                            </span>
                                        </div>

                                        {/* Imagen */}
                                        <div className="h-40 w-full overflow-hidden relative">
                                            <img
                                                src={`https://picsum.photos/400/250?random=${t.image}`}
                                                alt={t.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#131B36] via-transparent to-transparent"></div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 text-left relative">
                                            {/* Categoría y Participantes */}
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/20">
                                                    {t.category}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                                                    <Users size={12} className="text-gray-300" />
                                                    <span>{t.slots}/{t.maxSlots}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{t.title}</h3>

                                            {/* Juez y Ubicación */}
                                            <div className="space-y-1 mb-4">
                                                <p className="text-gray-500 text-xs flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                                                    {t.location}
                                                </p>
                                                <p className="text-gray-400 text-xs flex items-center gap-1.5">
                                                    <Gavel size={12} className="text-purple-400" />
                                                    Juez: <span className="text-gray-300">{t.judge}</span>
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Puntos</p>
                                                    <p className="text-yellow-400 font-bold text-sm shadow-yellow-500/20 drop-shadow-sm flex items-center gap-1">
                                                        <Star size={12} fill="currentColor" /> {t.score}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => navigate('/vistatorneo', { state: { fromLogin: isFromLogin, tournamentId: t.id } })}
                                                    className="bg-white/5 hover:bg-cyan-500 hover:text-[#0A0F24] text-white/70 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    Ver Detalles
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TorneosView;
