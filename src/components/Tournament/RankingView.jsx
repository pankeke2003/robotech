import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Shield, Zap, Target, Cpu } from 'lucide-react';
import { dataService } from "../../services/dataService";
import { Skeleton } from "../ui/Skeleton";

const RankingView = ({ onSelectClub }) => {
    const [activeCategory, setActiveCategory] = useState("Global");
    const [searchTerm, setSearchTerm] = useState("");
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ["Global", "Combate", "Sumo", "Carreras", "Drones"];

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                // Fetch clubs data
                const response = await dataService.getClubs({ take: 100 });
                const fetchedData = response.data || [];

                // Map to ranking structure and mock stats not yet in backend
                const mappedClubs = fetchedData.map((c, index) => ({
                    id: c.id,
                    name: c.name,
                    country: c.fiscal_address || "Internacional", // Placeholder
                    wins: Math.floor(Math.random() * 50),
                    points: Math.floor(Math.random() * 2000) + 500,
                    specialty: "General", // Placeholder
                    robots: c._count?.competitors ? c._count.competitors * 2 : Math.floor(Math.random() * 10), // Estimate
                    winRate: `${Math.floor(Math.random() * 40) + 60}%`,
                    logo: c.name // Seed for avatar
                }));

                // Sort by points desc
                mappedClubs.sort((a, b) => b.points - a.points);

                // Assign rank
                const rankedClubs = mappedClubs.map((c, i) => ({ ...c, rank: i + 1 }));

                setClubs(rankedClubs);
            } catch (error) {
                console.error("Error fetching ranking", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative text-center overflow-hidden flex-1 flex flex-col h-full bg-[#0B1124]">
            {/* Fondos */}
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-500"></div>

            <div className="relative z-10 p-6 flex flex-col h-full max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-extrabold text-white mb-2"
                    >
                        Ranking de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Clubes Élite</span>
                    </motion.h2>
                    <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                        Los mejores equipos del mundo compitiendo por la supremacía tecnológica.
                    </p>
                </div>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex bg-[#0F1629] p-1 rounded-lg border border-white/5">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeCategory === cat ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar club..."
                        className="bg-[#0F1629] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 w-full md:w-64"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tabla Glassmorphism */}
                <div className="flex-1 overflow-hidden rounded-2xl border border-white/5 bg-[#131B36]/60 backdrop-blur-xl shadow-2xl relative">
                    <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#0F1629]/95 backdrop-blur-md z-10 text-xs uppercase text-gray-400 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-center">Rank</th>
                                    <th className="px-6 py-4">Club</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Especialidad</th>
                                    <th className="px-6 py-4 text-center hidden sm:table-cell">Estadísticas</th>
                                    <th className="px-6 py-4 text-right">Puntos Totales</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-white/5">
                                <AnimatePresence>
                                    {loading ? (
                                        [...Array(10)].map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-6 py-4"><Skeleton className="h-6 w-6 rounded-full mx-auto" /></td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                                        <div className="space-y-1">
                                                            <Skeleton className="h-4 w-24 rounded" />
                                                            <Skeleton className="h-3 w-16 rounded" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <div className="flex flex-col gap-1 items-center">
                                                        <Skeleton className="h-3 w-16 rounded" />
                                                        <Skeleton className="h-1.5 w-full rounded-full" />
                                                        <Skeleton className="h-2 w-12 rounded" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-14 ml-auto rounded-lg" /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        filteredClubs.map((club, index) => (
                                            <motion.tr
                                                key={club.rank}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-4 text-center">
                                                    {index === 0 ? <Trophy className="w-6 h-6 text-yellow-400 mx-auto drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" /> :
                                                        index === 1 ? <Medal className="w-6 h-6 text-gray-300 mx-auto" /> :
                                                            index === 2 ? <Medal className="w-6 h-6 text-amber-700 mx-auto" /> :
                                                                <span className="text-gray-500 font-mono">#{club.rank}</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div
                                                        onClick={() => onSelectClub && onSelectClub({ id: club.id, name: club.name, description: club.description || "Club Elite", image: `https://api.dicebear.com/9.x/identicon/svg?seed=${club.logo}`, ...club })}
                                                        className="flex items-center gap-3 cursor-pointer group/item"
                                                    >
                                                        <img
                                                            src={`https://api.dicebear.com/9.x/identicon/svg?seed=${club.logo}`}
                                                            alt={club.name}
                                                            className="w-10 h-10 rounded-lg bg-white/5 p-1 border border-white/10 group-hover/item:border-purple-500/30 transition-colors"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-white group-hover/item:text-purple-400 transition-colors underline decoration-transparent group-hover/item:decoration-purple-400 underline-offset-4">{club.name}</div>
                                                            <div className="text-xs text-gray-500">{club.country}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                                                        {club.specialty.includes("Combate") ? <Shield size={12} /> :
                                                            club.specialty.includes("Velocidad") ? <Zap size={12} /> :
                                                                club.specialty.includes("AI") ? <Cpu size={12} /> : <Target size={12} />}
                                                        {club.specialty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center hidden sm:table-cell">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-gray-400"><span className="text-white font-bold">{club.wins}</span> Victorias</span>
                                                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{ width: club.winRate }}></div>
                                                        </div>
                                                        <span className="text-[10px] text-gray-500">{club.robots} Robots Activos</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-lg font-bold text-white font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/10 group-hover:border-purple-500/50 transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                                        {club.points}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RankingView;
