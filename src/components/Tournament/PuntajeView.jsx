import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, Award, Zap, Activity } from 'lucide-react';

const PuntajeView = ({ navigate, rankings = [] }) => {
    const [activeTier, setActiveTier] = useState("Todos");

    // Helper para calcular Tier basado en puntaje
    const getTier = (score) => {
        if (score >= 3000) return "Leyenda";
        if (score >= 2000) return "Pro";
        return "Avanzado";
    };

    // Mapear datos de la DB al formato de la vista
    const mappedPlayers = rankings.length > 0
        ? rankings.map(r => ({
            id: r.competitor_id,
            rank: r.position,
            name: r.competitor?.user?.nickname || `${r.competitor?.user?.name} ${r.competitor?.user?.lastName}`,
            country: r.competitor?.club?.name || "Independiente",
            wins: r.wins || 0,
            score: Number(r.total_points) || 0,
            robotName: r.mainRobot?.name || "Sin Robot",
            tier: getTier(Number(r.total_points)),
            specialty: r.mainRobot?.category || "Multidisciplina",
            avatar: r.competitor?.user?.nickname || "Pilot",
            robotImg: r.competitor_id % 10
        }))
        : [
            { id: 101, rank: 1, name: "NeoBlade", country: "EE.UU.", wins: 56, score: 3420, robotName: "X-Calibur", tier: "Leyenda", specialty: "Combate", avatar: "Neo", robotImg: 1 },
            { id: 102, rank: 2, name: "KiraX", country: "Japón", wins: 52, score: 3310, robotName: "Ronin-7", tier: "Leyenda", specialty: "Velocidad", avatar: "Kira", robotImg: 2 },
            { id: 103, rank: 3, name: "SteelRex", country: "Alemania", wins: 48, score: 3150, robotName: "Panzer V", tier: "Pro", specialty: "Defensa", avatar: "Rex", robotImg: 3 },
            { id: 104, rank: 4, name: "Dr. Volt", country: "Perú", wins: 44, score: 2980, robotName: "Thunderbolt", tier: "Pro", specialty: "Energía", avatar: "Volt", robotImg: 4 },
            { id: 105, rank: 5, name: "OmegaNova", country: "México", wins: 41, score: 2860, robotName: "Azteca Prime", tier: "Pro", specialty: "Estrategia", avatar: "Nova", robotImg: 5 },
            { id: 106, rank: 6, name: "QuantumEdge", country: "Brasil", wins: 38, score: 2750, robotName: "Samba Bot", tier: "Avanzado", specialty: "Movilidad", avatar: "Edge", robotImg: 6 },
            { id: 107, rank: 7, name: "AeroByte", country: "Canadá", wins: 34, score: 2590, robotName: "Frostbite", tier: "Avanzado", specialty: "Control", avatar: "Aero", robotImg: 7 },
            { id: 108, rank: 8, name: "PulseFire", country: "Argentina", wins: 31, score: 2480, robotName: "Fenix", tier: "Avanzado", specialty: "Fuego", avatar: "Fire", robotImg: 8 },
        ];

    const filteredPlayers = activeTier === "Todos" ? mappedPlayers : mappedPlayers.filter(p => p.tier === activeTier);
    const tiers = ["Todos", "Leyenda", "Pro", "Avanzado"];

    return (
        <div className="relative text-center h-full overflow-y-auto flex flex-col w-full custom-scrollbar">

            {/* Background FX */}
            <div className="fixed inset-0 bg-[#0B1124] -z-10">
                <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[20%] right-[20%] w-80 h-80 bg-blue-600/5 rounded-full blur-[80px]"></div>
            </div>

            <div className="relative z-10 p-6 flex flex-col flex-1 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="mb-4 md:mb-8">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-2xl md:text-3xl font-extrabold text-white mb-2"
                    >
                        Mejores <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Pilotos</span>
                    </motion.h2>
                    <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto">
                        Ranking oficial de la temporada 2025 basado en rendimiento de combate.
                    </p>
                </div>

                {/* Filtros Tier */}
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                    {tiers.map(tier => (
                        <button
                            key={tier}
                            onClick={() => setActiveTier(tier)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border 
                            ${activeTier === tier
                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                    : 'bg-[#0F1629] border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}
                        >
                            {tier}
                        </button>
                    ))}
                </div>

                {/* Grid Cards */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                    <AnimatePresence>
                        {filteredPlayers.map((player) => (
                            <motion.div
                                layout
                                key={player.rank}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative bg-[#131B36]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl h-auto flex flex-col"
                            >
                                {/* Rank Badge */}
                                <div className="absolute top-0 right-0 bg-[#0F1629]/90 backdrop-blur-md px-3 py-2 rounded-bl-2xl border-b border-l border-white/5 z-20">
                                    <span className={`text-xl font-black italic 
                                        ${player.rank === 1 ? 'text-yellow-400' :
                                            player.rank === 2 ? 'text-gray-300' :
                                                player.rank === 3 ? 'text-amber-700' : 'text-cyan-800'}`}>
                                        #{player.rank}
                                    </span>
                                </div>

                                {/* Main Visual - Robot & Avatar */}
                                <div className="h-24 sm:h-32 bg-gradient-to-b from-cyan-900/20 to-[#131B36] relative group-hover:from-cyan-900/30 transition-colors">
                                    <img
                                        src={`https://picsum.photos/400/200?random=${player.robotImg + 10}`}
                                        className="w-full h-full object-cover mix-blend-overlay opacity-50 block"
                                        alt="Robot BG"
                                    />
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                                        <img
                                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${player.avatar}`}
                                            className="w-20 h-20 rounded-full border-4 border-[#131B36] bg-[#0F1629] shadow-lg"
                                            alt={player.name}
                                        />
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="pt-8 pb-6 px-4 flex flex-col items-center flex-1">
                                    <button
                                        onClick={() => navigate(`/perfilusuario?userId=${player.id}`, { state: { userData: player } })}
                                        className="text-xl font-bold text-white mb-0.5 hover:text-cyan-400 hover:underline transition-colors"
                                    >
                                        {player.name}
                                    </button>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">{player.country}</p>

                                    {/* Stats Grid */}
                                    <div className="w-full grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center border border-white/5">
                                            <span className="text-[10px] text-gray-500 uppercase">Victorias</span>
                                            <span className="text-lg font-bold text-white flex items-center gap-1">
                                                <Award size={14} className="text-cyan-400" /> {player.wins}
                                            </span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center border border-white/5">
                                            <span className="text-[10px] text-gray-500 uppercase">Puntaje</span>
                                            <span className="text-lg font-bold text-yellow-400 flex items-center gap-1">
                                                <Activity size={14} /> {player.score}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Robot Info */}
                                    <div className="w-full bg-[#0F1629] rounded-xl p-3 border border-white/5 flex items-center justify-between group-hover:border-cyan-500/20 transition-colors">
                                        <div className="text-left">
                                            <p className="text-[10px] text-gray-500 uppercase">Robot Principal</p>
                                            <p className="text-sm font-semibold text-cyan-100">{player.robotName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase">Espec.</p>
                                            <div className="flex items-center gap-1 justify-end text-xs text-cyan-400 font-medium">
                                                <Zap size={12} /> {player.specialty}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default PuntajeView;
