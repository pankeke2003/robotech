import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, Shield, Cpu, Gauge, Trophy } from 'lucide-react';
import { GiRobotGrab, GiBangingGavel, GiBoxingGlove, GiMaze } from "react-icons/gi";
import { FaFlagCheckered, FaFutbol } from "react-icons/fa";

const CategoriasView = ({ categories: dbCategories = [] }) => {
    const [activeType, setActiveType] = useState("Todos");
    const [activeDifficulty, setActiveDifficulty] = useState("Todos");

    // Helper para asignar visuales a categorías de la DB
    const getVisuals = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("sumo")) return {
            type: "Combate",
            difficulty: "Intermedio",
            icon: <GiRobotGrab className="text-4xl" />,
            color: "from-red-500 to-orange-500",
            image: "https://cdn.pixabay.com/photo/2020/12/22/20/38/robot-5854326_960_720.jpg"
        };
        if (lowerName.includes("line")) return {
            type: "Carreras",
            difficulty: "Principiante",
            icon: <Gauge className="text-4xl" />,
            color: "from-blue-500 to-cyan-400",
            image: "https://cdn.pixabay.com/photo/2016/03/27/07/08/robot-1285091_960_720.jpg"
        };
        if (lowerName.includes("maze") || lowerName.includes("laberinto")) return {
            type: "Habilidad",
            difficulty: "Avanzado",
            icon: <GiMaze className="text-4xl" />,
            color: "from-purple-500 to-indigo-600",
            image: "https://cdn.pixabay.com/photo/2018/05/11/11/24/robot-3390234_1280.jpg"
        };
        if (lowerName.includes("combate")) return {
            type: "Combate",
            difficulty: "Avanzado",
            icon: <GiBangingGavel className="text-4xl" />,
            color: "from-zinc-500 to-red-600",
            image: "https://cdn.pixabay.com/photo/2017/10/12/21/53/robot-2847476_960_720.jpg"
        };
        if (lowerName.includes("dron")) return {
            type: "Carreras",
            difficulty: "Experto",
            icon: <FaFlagCheckered className="text-4xl" />,
            color: "from-emerald-400 to-teal-500",
            image: "https://cdn.pixabay.com/photo/2017/09/06/14/35/drone-2721245_1280.jpg"
        };
        if (lowerName.includes("futbol") || lowerName.includes("soccer")) return {
            type: "Deportes",
            difficulty: "Intermedio",
            icon: <FaFutbol className="text-4xl" />,
            color: "from-green-500 to-lime-400",
            image: "https://cdn.pixabay.com/photo/2016/11/19/15/32/robot-1839958_1280.jpg"
        };

        // Default visuals
        return {
            type: "Habilidad",
            difficulty: "Intermedio",
            icon: <Cpu className="text-4xl" />,
            color: "from-blue-600 to-purple-600",
            image: "https://cdn.pixabay.com/photo/2017/10/12/21/53/robot-2847476_960_720.jpg"
        };
    };

    // Si hay categorías de la DB, las usamos. Si no, usamos las mock.
    const categories = dbCategories.length > 0
        ? dbCategories.map(cat => ({
            id: cat.id,
            title: cat.name,
            description: cat.description || "Sin descripción disponible.",
            stats: { robots: cat._count?.robots || 0, tournaments: cat._count?.tournaments || 0 },
            ...getVisuals(cat.name)
        }))
        : [
            {
                id: 1,
                title: "Sumo",
                type: "Combate",
                difficulty: "Intermedio",
                icon: <GiRobotGrab className="text-4xl" />,
                description: "Dos robots autónomos intentan empujarse fuera del dohyo (ring). Fuerza bruta y sensores estratégicos.",
                stats: { robots: 145, tournaments: 12 },
                color: "from-red-500 to-orange-500",
                image: "https://cdn.pixabay.com/photo/2020/12/22/20/38/robot-5854326_960_720.jpg"
            },
            {
                id: 2,
                title: "Mini-Sumo",
                type: "Combate",
                difficulty: "Principiante",
                icon: <GiRobotGrab className="text-4xl" />,
                description: "Versión más pequeña y rápida del sumo clásico. Ideal para iniciarse en la robótica competitiva.",
                stats: { robots: 320, tournaments: 25 },
                color: "from-orange-400 to-yellow-500",
                image: "https://cdn.pixabay.com/photo/2019/02/10/09/22/robot-3986638_1280.jpg"
            },
            {
                id: 3,
                title: "Combate 1lb",
                type: "Combate",
                difficulty: "Avanzado",
                icon: <GiBangingGavel className="text-4xl" />,
                description: "Pequeños pero destructivos. Robots diseñados para destruir al oponente con armas activas.",
                stats: { robots: 65, tournaments: 8 },
                color: "from-zinc-500 to-red-600",
                image: "https://cdn.pixabay.com/photo/2017/10/12/21/53/robot-2847476_960_720.jpg"
            },
            {
                id: 4,
                title: "Seguidor de Línea",
                type: "Carreras",
                difficulty: "Principiante",
                icon: <Gauge className="text-4xl" />,
                description: "Velocidad pura y algoritmos PID. Recorre un circuito marcado por una línea negra en el menor tiempo.",
                stats: { robots: 500, tournaments: 40 },
                color: "from-blue-500 to-cyan-400",
                image: "https://cdn.pixabay.com/photo/2016/03/27/07/08/robot-1285091_960_720.jpg"
            },
            {
                id: 5,
                title: "Laberinto (Maze)",
                type: "Habilidad",
                difficulty: "Avanzado",
                icon: <GiMaze className="text-4xl" />,
                description: "Resolución de problemas en tiempo real. El robot debe mapear y resolver un laberinto desconocido.",
                stats: { robots: 80, tournaments: 15 },
                color: "from-purple-500 to-indigo-600",
                image: "https://cdn.pixabay.com/photo/2018/05/11/11/24/robot-3390234_1280.jpg"
            },
            {
                id: 6,
                title: "Carreras de Drones",
                type: "Carreras",
                difficulty: "Experto",
                icon: <FaFlagCheckered className="text-4xl" />,
                description: "Vuelo FPV a altas velocidades a través de obstáculos tridimensionales.",
                stats: { robots: 110, tournaments: 18 },
                color: "from-emerald-400 to-teal-500",
                image: "https://cdn.pixabay.com/photo/2017/09/06/14/35/drone-2721245_1280.jpg"
            },
            {
                id: 7,
                title: "Fútbol Robótico",
                type: "Deportes",
                difficulty: "Intermedio",
                icon: <FaFutbol className="text-4xl" />,
                description: "Equipos de robots coordinados jugando fútbol. Estrategia en equipo e IA.",
                stats: { robots: 90, tournaments: 10 },
                color: "from-green-500 to-lime-400",
                image: "https://cdn.pixabay.com/photo/2016/11/19/15/32/robot-1839958_1280.jpg"
            },
            {
                id: 8,
                title: "Boxeo",
                type: "Combate",
                difficulty: "Avanzado",
                icon: <GiBoxingGlove className="text-4xl" />,
                description: "Robots humanoides intercambiando golpes. Estabilidad y control de movimiento complejo.",
                stats: { robots: 45, tournaments: 5 },
                color: "from-pink-500 to-rose-600",
                image: "https://cdn.pixabay.com/photo/2016/11/29/07/45/robot-1869729_960_720.jpg"
            }
        ];

    const types = ["Todos", "Combate", "Carreras", "Habilidad", "Deportes"];
    const difficulties = ["Todos", "Principiante", "Intermedio", "Avanzado", "Experto"];

    const filteredCategories = categories.filter(cat => {
        const matchType = activeType === "Todos" || cat.type === activeType;
        const matchDiff = activeDifficulty === "Todos" || cat.difficulty === activeDifficulty;
        return matchType && matchDiff;
    });

    return (
        <div className="relative text-center h-full overflow-y-auto flex flex-col w-full custom-scrollbar">
            {/* === Fondo animado === */}
            <div className="fixed inset-0 bg-[#0B1124] -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                {/* Pattern Hexagonal */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E90FF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}>
                </div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 flex flex-col flex-1 min-h-0">

                {/* HEADER */}
                <div className="mb-4 md:mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-5xl font-extrabold text-white mb-2 tracking-tight"
                    >
                        Categorías <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Oficiales</span>
                    </motion.h2>
                    <p className="text-gray-400 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
                        Encuentra tu disciplina ideal. Desde la fuerza bruta del Sumo hasta la precisión milimétrica de los laberintos.
                    </p>
                </div>

                {/* FILTROS */}
                <div className="flex flex-col xl:flex-row gap-4 justify-center items-center mb-6">

                    {/* Filtro Tipo */}
                    <div className="flex flex-wrap gap-2 justify-center bg-[#0F1629]/80 backdrop-blur-sm p-1.5 rounded-2xl border border-white/5 shadow-lg">
                        {types.map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`
                                    px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 relative overflow-hidden group
                                    ${activeType === type ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {activeType === type && (
                                    <motion.div
                                        layoutId="typeBubble"
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {type === "Combate" && <Shield size={14} />}
                                    {type === "Carreras" && <Zap size={14} />}
                                    {type === "Habilidad" && <Cpu size={14} />}
                                    {type === "Deportes" && <Trophy size={14} />}
                                    {type}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Filtro Dificultad */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {difficulties.map(diff => (
                            <button
                                key={diff}
                                onClick={() => setActiveDifficulty(diff)}
                                className={`
                                    px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg border transition-all
                                    ${activeDifficulty === diff
                                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                        : 'border-transparent bg-white/5 text-gray-500 hover:bg-white/10'}
                                `}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID DE CATEGORÍAS */}
                <motion.div
                    layout
                    className="
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-6
                    "
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.map((cat) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative bg-[#131B36]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.15)] hover:bg-[#162041] flex flex-col h-auto"
                            >
                                {/* Imagen con Overlay */}
                                <div className="h-48 w-full overflow-hidden relative">
                                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-20 mix-blend-overlay group-hover:opacity-40 transition-opacity`}></div>
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#131B36] via-transparent to-transparent"></div>

                                    {/* Icono Flotante */}
                                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/90 shadow-lg group-hover:scale-110 transition-transform">
                                        {cat.icon}
                                    </div>

                                    {/* Badge Dificultad */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`
                                            backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border bg-black/40
                                            ${cat.difficulty === 'Principiante' ? 'text-green-400 border-green-500/30' : ''}
                                            ${cat.difficulty === 'Intermedio' ? 'text-yellow-400 border-yellow-500/30' : ''}
                                            ${cat.difficulty === 'Avanzado' ? 'text-orange-400 border-orange-500/30' : ''}
                                            ${cat.difficulty === 'Experto' ? 'text-red-400 border-red-500/30' : ''}
                                        `}>
                                            {cat.difficulty}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-1">
                                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                                            {cat.type}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                        {cat.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">
                                        {cat.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                                        <div className="text-center bg-white/5 rounded-lg py-2">
                                            <div className="text-white font-bold text-sm">{cat.stats.robots}</div>
                                            <div className="text-[10px] text-gray-500 uppercase">Robots</div>
                                        </div>
                                        <div className="text-center bg-white/5 rounded-lg py-2">
                                            <div className="text-white font-bold text-sm">{cat.stats.tournaments}</div>
                                            <div className="text-[10px] text-gray-500 uppercase">Torneos</div>
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

export default CategoriasView;
