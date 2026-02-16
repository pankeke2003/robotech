import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Medal, Crown } from "lucide-react";

// Datos simulados SEGUROS
const MOCK_PARTICIPANTS = [
    { id: 1, player: "Alex", robot: "ThunderBolt", rank: 1, type: "Velocidad", category: "Pelea", club: "Club Alpha", score: 1250, color: "bg-blue-600" },
    { id: 2, player: "Sarah", robot: "IronCrusher", rank: 8, type: "Fuerza", category: "Sumo", club: "Iron Titans", score: 850, color: "bg-red-600" },
    { id: 3, player: "Mike", robot: "PixelBot", rank: 4, type: "Precisión", category: "Estrategia", club: "Logic Masters", score: 1050, color: "bg-yellow-600" },
    { id: 4, player: "Emma", robot: "Viper 2.0", rank: 5, type: "Táctico", category: "Lucha Libre", club: "Viper Squad", score: 980, color: "bg-green-600" },
    { id: 5, player: "David", robot: "GigaTank", rank: 3, type: "Blindado", category: "Sumo", club: "Heavy Metal", score: 1120, color: "bg-purple-600" },
    { id: 6, player: "Luna", robot: "ShadowX", rank: 6, type: "Sigilo", category: "Pelea", club: "Night Owls", score: 920, color: "bg-gray-600" },
    { id: 7, player: "Kevin", robot: "ByteMe", rank: 2, type: "Hacker", category: "Estrategia", club: "Null Pointers", score: 1180, color: "bg-cyan-600" },
    { id: 8, player: "Nina", robot: "SolarFlare", rank: 7, type: "Energía", category: "Lucha Libre", club: "Nova Team", score: 890, color: "bg-orange-600" },
];

/**
 * 🌐 API INTEGRATION TIP:
 * Para el sistema de matchmaking en tiempo real, considera usar WebSockets (Socket.io).
 * Ejemplo de carga de participantes:
 * 
 * useEffect(() => {
 *   const socket = io('/tournaments');
 *   socket.on('new_participant', (p) => setParticipants(prev => [...prev, p]));
 *   return () => socket.disconnect();
 * }, []);
 */

const MatchmakingSection = () => {
    const [phase, setPhase] = useState("registration");
    const [participants, setParticipants] = useState([]);
    const [currentMatches, setCurrentMatches] = useState([]);
    const [winners, setWinners] = useState([]);
    const [history, setHistory] = useState([]);

    // --- EFFECT 1: REGISTRATION PHASE ---
    useEffect(() => {
        if (phase !== "registration") return;

        setParticipants([]);
        setCurrentMatches([]);
        setWinners([]);
        setHistory([]);

        let count = 0;
        const interval = setInterval(() => {
            if (count < MOCK_PARTICIPANTS.length) {
                const nextParticipant = MOCK_PARTICIPANTS[count];
                if (nextParticipant) {
                    setParticipants(prev => [...prev, nextParticipant]);
                }
                count++;
            } else {
                clearInterval(interval);
                // Delay before starting tournament
                setTimeout(() => setPhase("quarters"), 1000);
            }
        }, 300);

        return () => clearInterval(interval);
    }, [phase]);

    // --- EFFECT 2: TOURNAMENT LOGIC ---
    // Runs when phase changes OR participants update (important for quarters start)
    useEffect(() => {
        let timeout;

        if (phase === "quarters") {
            // Wait until we have enough participants
            if (participants.length < 8) return;

            const matches = [];
            for (let i = 0; i < participants.length - 1; i += 2) {
                if (participants[i] && participants[i + 1]) {
                    matches.push({ id: `q-${i}`, p1: participants[i], p2: participants[i + 1], winner: null });
                }
            }
            setCurrentMatches(matches);

            timeout = setTimeout(() => {
                const results = matches.map(m => {
                    const winner = Math.random() > 0.5 ? m.p1 : m.p2;
                    const loser = winner === m.p1 ? m.p2 : m.p1;
                    return { ...m, winner, loser };
                });
                setCurrentMatches(results);
                setHistory(prev => [...prev, ...results.map(m => m.loser)]);

                timeout = setTimeout(() => {
                    setWinners(results.map(r => r.winner));
                    setPhase("semis");
                }, 2000);
            }, 2000);
        }

        if (phase === "semis") {
            if (winners.length < 4) return;
            const matches = [];
            for (let i = 0; i < winners.length - 1; i += 2) {
                if (winners[i] && winners[i + 1]) {
                    matches.push({ id: `s-${i}`, p1: winners[i], p2: winners[i + 1], winner: null });
                }
            }
            setCurrentMatches(matches);

            timeout = setTimeout(() => {
                const results = matches.map(m => {
                    const winner = Math.random() > 0.5 ? m.p1 : m.p2;
                    const loser = winner === m.p1 ? m.p2 : m.p1;
                    return { ...m, winner, loser };
                });
                setCurrentMatches(results);
                setHistory(prev => [...prev, ...results.map(m => m.loser)]);

                timeout = setTimeout(() => {
                    setWinners(results.map(r => r.winner));
                    setPhase("final");
                }, 2000);
            }, 2000);
        }

        if (phase === "final") {
            if (winners.length < 2) return;
            const finalMatch = [{ id: 'f-1', p1: winners[0], p2: winners[1], winner: null }];
            setCurrentMatches(finalMatch);

            timeout = setTimeout(() => {
                const result = { ...finalMatch[0] };
                result.winner = Math.random() > 0.5 ? result.p1 : result.p2;
                result.loser = result.winner === result.p1 ? result.p2 : result.p1;

                setCurrentMatches([result]);
                setHistory(prev => [...prev, result.loser]);

                timeout = setTimeout(() => {
                    setWinners([result.winner]);
                    setPhase("winner");
                }, 2000);
            }, 3000);
        }

        if (phase === "winner") {
            if (winners.length > 0) {
                setHistory(prev => [...prev, winners[0]]);
            }
            timeout = setTimeout(() => setPhase("registration"), 6000);
        }

        return () => clearTimeout(timeout);
    }, [phase, participants.length, winners.length]); // Dependencies explicit

    const getPhaseTitle = () => {
        switch (phase) {
            case 'registration': return "Fase de Inscripciones";
            case 'quarters': return "Cuartos de Final";
            case 'semis': return "Semifinales";
            case 'final': return "GRAN FINAL";
            case 'winner': return "¡Campeón Definitivo!";
            default: return "";
        }
    };

    return (
        <div className="w-full py-16 bg-black border-t border-gray-800 relative overflow-hidden font-['Inter']">

            {/* Background */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-20 right-20 w-96 h-96 bg-gray-800/30 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-gray-900/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Trophy size={18} />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase">Torneo en Curso</span>
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                            Robo<span className="text-gray-500">Tech</span> Arena
                        </h2>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <div className="px-5 py-2 bg-gray-900 border border-gray-700 text-gray-200 font-mono text-sm rounded shadow-lg flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            {getPhaseTitle()}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT: Bracket */}
                    <div className="lg:w-2/3 bg-[#0a0a0a] rounded-xl border border-gray-800 p-6 min-h-[550px] relative shadow-2xl">

                        {/* REGISTRATION VIEW */}
                        {phase === 'registration' && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <AnimatePresence>
                                    {participants.map((p) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-[#111827] border border-gray-800 rounded-lg p-4 flex flex-col items-center relative"
                                        >
                                            <div className="w-16 h-16 rounded-lg bg-black border border-gray-700 flex items-center justify-center text-white font-black text-2xl mb-3">
                                                {p.robot ? p.robot[0] : '?'}
                                            </div>
                                            <h3 className="text-white font-bold text-sm truncate w-full text-center">{p.robot}</h3>
                                            <p className="text-gray-500 text-xs mb-2">{p.player}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {[...Array(Math.max(0, 8 - participants.length))].map((_, i) => (
                                    <div key={`empty-${i}`} className="bg-[#111827]/50 border border-dashed border-gray-800 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-700 text-xs font-mono animate-pulse">ESPERANDO...</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* MATCHES VIEW */}
                        {['quarters', 'semis', 'final'].includes(phase) && (
                            <div className="flex flex-col justify-center h-full gap-4">
                                <AnimatePresence mode='wait'>
                                    {currentMatches.map((match) => {
                                        if (!match || !match.p1 || !match.p2) return null;
                                        return (
                                            <motion.div
                                                key={match.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex items-center justify-between relative overflow-hidden"
                                            >
                                                {/* P1 */}
                                                <div className={`flex items-center gap-4 w-5/12 ${match.winner && match.winner !== match.p1 ? 'opacity-30' : ''}`}>
                                                    <div className="w-12 h-12 bg-black rounded border border-gray-700 flex items-center justify-center font-bold text-white text-xl">
                                                        {match.p1.robot?.[0] || '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-white font-bold text-sm truncate">{match.p1.robot}</div>
                                                        <div className="text-xs text-gray-500">{match.p1.club}</div>
                                                    </div>
                                                </div>

                                                {/* VS */}
                                                <div className="flex flex-col items-center w-2/12">
                                                    <span className="text-2xl font-black text-gray-800 italic">VS</span>
                                                </div>

                                                {/* P2 */}
                                                <div className={`flex items-center gap-4 w-5/12 flex-row-reverse text-right ${match.winner && match.winner !== match.p2 ? 'opacity-30' : ''}`}>
                                                    <div className="w-12 h-12 bg-black rounded border border-gray-700 flex items-center justify-center font-bold text-white text-xl">
                                                        {match.p2.robot?.[0] || '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-white font-bold text-sm truncate">{match.p2.robot}</div>
                                                        <div className="text-xs text-gray-500">{match.p2.club}</div>
                                                    </div>
                                                </div>

                                                {match.winner && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="bg-white/10 backdrop-blur-sm px-6 py-2 border border-white/20 rounded text-white font-black tracking-widest uppercase transform -rotate-12 shadow-2xl">
                                                            Ganador
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* WINNER VIEW */}
                        {phase === 'winner' && winners[0] && (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 relative">
                                    <Crown size={100} className="text-white relative z-10" strokeWidth={1} />
                                </motion.div>
                                <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter">{winners[0].robot}</h2>
                                <p className="text-gray-400 text-xl font-mono mb-8">{winners[0].club}</p>
                                <div className="text-white font-bold text-lg">PUNTOS TOTALES: {(winners[0].score || 0) + 500}</div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Stats */}
                    <div className="lg:w-1/3 bg-[#0a0a0a] rounded-xl border border-gray-800 p-6 flex flex-col h-[550px]">
                        <h3 className="text-gray-200 font-bold mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
                            <Medal size={14} /> Últimas Estadísticas
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {history.slice().reverse().map((p, index) => {
                                if (!p) return null;
                                const isChamp = phase === 'winner' && index === 0;
                                return (
                                    <motion.div
                                        key={p.id || index}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className={`p-3 rounded border flex items-center gap-3 ${isChamp ? 'bg-white text-black border-white' : 'bg-[#111827] text-gray-400 border-gray-800'}`}
                                    >
                                        <div className="font-bold font-mono text-sm w-6 text-center">{isChamp ? '1' : index + 2}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-bold text-sm truncate ${isChamp ? 'text-black' : 'text-gray-200'}`}>{p.robot}</div>
                                            <div className="text-[10px] uppercase opacity-70">{p.club}</div>
                                        </div>
                                        <div className="font-mono text-xs font-bold opacity-80">{p.score} pts</div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MatchmakingSection;
