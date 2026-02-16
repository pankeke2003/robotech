import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Trophy, Users, HelpCircle, ChevronRight, Calculator, FileText } from "lucide-react";
import { dataService } from "../services/dataService";

const CommandPalette = ({ isOpen, onClose, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState({ tournaments: [], clubs: [], actions: [] });
    const [loading, setLoading] = useState(false);
    const [dataCache, setDataCache] = useState({ tournaments: [], clubs: [] });

    // Acciones estáticas rápidas
    const staticActions = [
        { id: 'act-ranking', title: 'Ver Ranking Global', type: 'Vista', icon: <Calculator size={14} />, action: () => onNavigate('ranking') },
        { id: 'act-calc', title: 'Calculadora de Puntaje', type: 'Herramienta', icon: <Calculator size={14} />, action: () => onNavigate('puntaje') },
        { id: 'act-noticias', title: 'Últimas Noticias', type: 'Vista', icon: <FileText size={14} />, action: () => onNavigate('noticias') },
        { id: 'act-ayuda', title: 'Centro de Ayuda', type: 'Ayuda', icon: <HelpCircle size={14} />, action: () => onNavigate('ayuda') },
    ];

    // Cargar datos al montar (o al abrir por primera vez para optimizar)
    useEffect(() => {
        if (isOpen && dataCache.tournaments.length === 0) {
            setLoading(true);
            Promise.all([
                dataService.getTournaments({ take: 100 }),
                dataService.getClubs({ take: 100 })
            ]).then(([tournamentsRes, clubsRes]) => {
                setDataCache({
                    tournaments: tournamentsRes.data || [],
                    clubs: clubsRes.data || []
                });
                setLoading(false);
            }).catch(err => {
                console.error("Error loading search data", err);
                setLoading(false);
            });
        }
    }, [isOpen]);

    // Filtrar resultados
    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults({ tournaments: [], clubs: [], actions: staticActions.slice(0, 3) });
            return;
        }

        const lowerTerm = searchTerm.toLowerCase();

        const filteredTournaments = dataCache.tournaments
            .filter(t => (t.title || "").toLowerCase().includes(lowerTerm) || (t.category?.name || "").toLowerCase().includes(lowerTerm))
            .slice(0, 3); // Top 3

        const filteredClubs = dataCache.clubs
            .filter(c => (c.name || "").toLowerCase().includes(lowerTerm))
            .slice(0, 3); // Top 3

        const filteredActions = staticActions.filter(a => a.title.toLowerCase().includes(lowerTerm));

        setResults({
            tournaments: filteredTournaments,
            clubs: filteredClubs,
            actions: filteredActions
        });
    }, [searchTerm, dataCache]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-[#0A0F24]/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="w-full max-w-2xl bg-[#101735] border border-[#1E90FF]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header Input */}
                    <div className="flex items-center gap-4 px-6 py-4 border-b border-[#1E90FF]/20 bg-[#131B36]">
                        <Search className="text-[#00C2FF] w-6 h-6" />
                        <input
                            autoFocus
                            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-500"
                            placeholder="¿Qué estás buscando? (Torneos, Clubes, Ayuda...)"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-gray-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
                        {loading && <div className="text-center py-8 text-gray-500">Cargando datos...</div>}

                        {!loading && (results.tournaments.length === 0 && results.clubs.length === 0 && results.actions.length === 0) && (
                            <div className="text-center py-12 text-gray-500">
                                <p>No se encontraron resultados para "{searchTerm}"</p>
                            </div>
                        )}

                        {/* Actions Section */}
                        {results.actions.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Acciones Rápidas</h3>
                                <div className="space-y-1">
                                    {results.actions.map(action => (
                                        <button
                                            key={action.id}
                                            onClick={() => { action.action(); onClose(); }}
                                            className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[#1E90FF]/10 hover:border-[#1E90FF]/30 border border-transparent transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-gray-400 group-hover:text-[#00C2FF]">{action.icon}</div>
                                                <span className="text-gray-300 group-hover:text-white font-medium">{action.title}</span>
                                            </div>
                                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500">{action.type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tournaments Section */}
                        {results.tournaments.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-3 px-2">Torneos</h3>
                                <div className="space-y-1">
                                    {results.tournaments.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { onNavigate('torneos'); onClose(); }}
                                            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#1E90FF]/10 text-left group border border-transparent hover:border-[#1E90FF]/30 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden relative flex-shrink-0">
                                                {/* Placeholder image logic matching TorneosView kinda */}
                                                <img src={`https://picsum.photos/200/200?random=${t.id}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white truncate">{t.title}</h4>
                                                <p className="text-xs text-gray-500 group-hover:text-gray-400 truncate">{t.category?.name || "Categoría General"}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-600 group-hover:text-[#00C2FF]" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Clubs Section */}
                        {results.clubs.length > 0 && (
                            <div className="mb-2">
                                <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-3 px-2">Clubes</h3>
                                <div className="space-y-1">
                                    {results.clubs.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => { onNavigate('club-detalle', c); onClose(); }}
                                            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-purple-500/10 text-left group border border-transparent hover:border-purple-500/30 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden relative flex-shrink-0 border border-white/10">
                                                <img src={c.logo || `https://api.dicebear.com/9.x/identicon/svg?seed=${c.name}`} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white truncate">{c.name}</h4>
                                                <p className="text-xs text-gray-500 group-hover:text-purple-400 truncate">{c.fiscal_address || "Club Internacional"}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-600 group-hover:text-purple-400" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}


                    </div>

                    {/* Footer Shortcuts */}
                    <div className="px-6 py-3 bg-[#0A0F24] border-t border-[#1E90FF]/20 flex justify-between items-center text-[10px] text-gray-500">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">↑↓</kbd> Navegar</span>
                            <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">Enter</kbd> Seleccionar</span>
                            <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">Esc</kbd> Cerrar</span>
                        </div>
                        <span>Robotech Global Search</span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CommandPalette;
