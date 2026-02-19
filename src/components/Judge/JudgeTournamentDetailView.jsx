import { useState, useEffect } from "react";
import { dataService } from "../../services/dataService";
import { FaGavel, FaCheck, FaTimes, FaUsers, FaPlay, FaArrowLeft, FaMedal } from "react-icons/fa";
import { GiPodiumWinner, GiBroadsword } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

export default function JudgeTournamentDetailView({ tournamentId, requestNavigate }) {
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [animationActive, setAnimationActive] = useState(false);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

    const [results, setResults] = useState({
        firstPlace: { competitorId: null, points: 50, name: '' },
        secondPlace: { competitorId: null, points: 30, name: '' },
        thirdPlace: { competitorId: null, points: 10, name: '' }
    });

    useEffect(() => {
        if (!tournamentId) return;
        const loadData = async () => {
            setLoading(true);
            const res = await dataService.getTournamentDetails(tournamentId);
            if (res && res.data) {
                setTournament(res.data);
                if (res.data.status === 'active') {
                    setAnimationActive(true);
                }
            }
            setLoading(false);
        };
        loadData();
    }, [tournamentId]);

    useEffect(() => {
        if (animationActive && tournament?.matches) {
            const timer = setInterval(() => {
                setCurrentMatchIndex(prev => {
                    if (prev >= tournament.matches.length - 1) {
                        clearInterval(timer);
                        setAnimationActive(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [animationActive, tournament?.matches]);

    const handleDecision = async (regId, status) => {
        setProcessingId(regId);
        try {
            await dataService.updateRegistrationStatus(regId, status);
            // Refresh data or update local state
            setTournament(prev => ({
                ...prev,
                registrations: prev.registrations.map(r =>
                    r.id === regId
                        ? { ...r, is_approved: status === 'approved' }
                        : r
                )
            }));
        } catch (error) {
            console.error("Failed to update status");
        } finally {
            setProcessingId(null);
        }
    };

    const handleStartTournament = async () => {
        if (!canStart) return;

        setProcessingId('starting');
        try {
            await dataService.startTournament(tournamentId);
            // Refresh local state
            const res = await dataService.getTournamentDetails(tournamentId);
            if (res && res.data) {
                setTournament(res.data);
            }
            alert("¡Torneo Iniciado!");
        } catch (error) {
            console.error("Error starting tournament:", error);
            alert("Error al iniciar el torneo");
        } finally {
            setProcessingId(null);
        }
    };

    const handleConfirmarGanador = async (winnerId) => {
        if (!tournament.matches || tournament.matches.length === 0) {
            alert("No se encontraron combates para confirmar.");
            return;
        }

        const finalMatch = tournament.matches[tournament.matches.length - 1];
        setProcessingId('confirming-winner');
        try {
            await dataService.confirmWinner(finalMatch.id, winnerId, 'knockout');

            // Setup results for modal
            const runnerUpId = finalMatch.competitor_a === winnerId ? finalMatch.competitor_b : finalMatch.competitor_a;

            const findN = (id) => {
                const reg = tournament.registrations.find(r => r.competitor_id === id || r.id === id || r.competitors?.id === id);
                return reg?.competitors?.user?.nickname || reg?.user?.nickname || "Participante";
            };

            setResults(prev => ({
                ...prev,
                firstPlace: { ...prev.firstPlace, competitorId: winnerId, name: findN(winnerId) },
                secondPlace: { ...prev.secondPlace, competitorId: runnerUpId, name: findN(runnerUpId) }
            }));

            setShowResultsModal(true);

            const res = await dataService.getTournamentDetails(tournamentId);
            if (res && res.data) {
                setTournament(res.data);
            }
        } catch (error) {
            console.error("Error confirming winner:", error);
            alert("Error al confirmar: " + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleFinalizeWithPoints = async () => {
        setProcessingId('finalizing');
        try {
            await dataService.finalizeTournament(tournamentId, {
                firstPlace: { competitorId: results.firstPlace.competitorId, points: results.firstPlace.points },
                secondPlace: { competitorId: results.secondPlace.competitorId, points: results.secondPlace.points },
                thirdPlace: { competitorId: results.thirdPlace.competitorId, points: results.thirdPlace.points }
            });
            alert("Torneo finalizado y puntos asignados correctamente.");
            setShowResultsModal(false);
            const res = await dataService.getTournamentDetails(tournamentId);
            if (res && res.data) setTournament(res.data);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setProcessingId(null);
        }
    };


    if (loading) return <div className="p-10 text-center text-white">Cargando detalles del torneo...</div>;
    if (!tournament) return <div className="p-10 text-center text-red-400">Torneo no encontrado</div>;

    // Filter lists
    // Note: Adjust property names based on actual API response structure. 
    // Assuming tournament.registrations is the array.
    const registrations = tournament.registrations || [];
    const pending = registrations.filter(r => !r.is_approved);
    const approved = registrations.filter(r => r.is_approved);

    const approvedCount = approved.length;
    const isEven = approvedCount % 2 === 0;
    const minReached = approvedCount >= 8;
    const canStart = minReached && isEven;

    return (
        <div className="min-h-full flex flex-col bg-[#050B14] p-6 relative">
            <AnimatePresence>
                {showResultsModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#101735] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl"
                        >
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <FaMedal className="text-yellow-500" />
                                Asignación de Puntos
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { place: 'firstPlace', label: '1° Puesto', color: 'text-yellow-500' },
                                    { place: 'secondPlace', label: '2° Puesto', color: 'text-gray-400' },
                                    { place: 'thirdPlace', label: '3° Puesto', color: 'text-orange-600' }
                                ].map((p) => (
                                    <div key={p.place} className="bg-black/20 p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`font-black uppercase italic ${p.color}`}>{p.label}</span>
                                            <span className="text-white text-sm font-bold">{results[p.place].name || '---'}</span>
                                        </div>
                                        {p.place === 'thirdPlace' ? (
                                            <select
                                                className="w-full bg-[#050B14] border border-white/10 rounded-lg p-2 text-white text-sm"
                                                onChange={(e) => setResults(prev => ({
                                                    ...prev,
                                                    thirdPlace: { ...prev.thirdPlace, competitorId: Number(e.target.value), name: approved.find(a => a.competitor_id === Number(e.target.value))?.competitors?.user?.nickname }
                                                }))}
                                            >
                                                <option value="">Seleccionar 3° puesto...</option>
                                                {approved.filter(a =>
                                                    a.competitor_id !== results.firstPlace.competitorId &&
                                                    a.competitor_id !== results.secondPlace.competitorId
                                                ).map(a => (
                                                    <option key={a.competitor_id} value={a.competitor_id}>
                                                        {a.competitors?.user?.nickname} (Robot: {a.robots?.name})
                                                    </option>
                                                ))}
                                            </select>
                                        ) : null}
                                        <div className="mt-2 flex items-center gap-3">
                                            <label className="text-[10px] text-gray-500 uppercase font-black">PUNTOS:</label>
                                            <input
                                                type="number"
                                                value={results[p.place].points}
                                                onChange={(e) => setResults(prev => ({
                                                    ...prev,
                                                    [p.place]: { ...prev[p.place], points: Number(e.target.value) }
                                                }))}
                                                className="bg-[#050B14] border border-white/10 rounded-lg p-1 text-center text-yellow-500 font-bold w-20"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowResultsModal(false)}
                                    className="flex-1 py-3 bg-white/5 text-gray-400 rounded-xl font-bold uppercase text-xs hover:bg-white/10 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleFinalizeWithPoints}
                                    disabled={processingId === 'finalizing'}
                                    className="flex-1 py-3 bg-yellow-500 text-black rounded-xl font-black uppercase text-xs hover:scale-[1.02] transition-all shadow-lg shadow-yellow-500/20"
                                >
                                    {processingId === 'finalizing' ? 'Guardando...' : 'Finalizar Torneo'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => requestNavigate('juez-torneos')}
                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        {tournament.name}
                        <span className="text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
                            {tournament.status}
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm">Panel de Control de Juez</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Solicitudes Pendientes */}
                <div className="flex flex-col bg-[#101735] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            Solicitudes Pendientes
                            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full text-xs">{pending.length}</span>
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {pending.length === 0 ? (
                            <p className="text-gray-500 text-center py-10 text-sm">No hay solicitudes pendientes.</p>
                        ) : (
                            pending.map(reg => (
                                <div key={reg.id} className="bg-[#050B14] p-3 rounded-xl border border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold capitalize">
                                            {reg.competitors?.user?.nickname?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{reg.competitors?.user?.nickname || 'Usuario'}</p>
                                            <p className="text-blue-400 text-xs">{reg.robots?.name || 'Robot Desconocido'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDecision(reg.id, 'rejected')}
                                            disabled={processingId === reg.id}
                                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                                            title="Rechazar"
                                        >
                                            <FaTimes />
                                        </button>
                                        <button
                                            onClick={() => handleDecision(reg.id, 'approved')}
                                            disabled={processingId === reg.id}
                                            className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20"
                                            title="Aceptar"
                                        >
                                            <FaCheck />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Participantes Aprobados & Start */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 bg-[#101735] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                Participantes Aceptados
                                <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-xs">{approved.length}</span>
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {approved.length === 0 ? (
                                <p className="text-gray-500 text-center py-10 text-sm">Aún no hay participantes aceptados.</p>
                            ) : (
                                approved.map(reg => (
                                    <div key={reg.id} className="bg-[#050B14] p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center text-xs font-bold border border-green-500/30">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{reg.competitors?.user?.nickname}</p>
                                            <p className="text-gray-500 text-xs">Robot: {reg.robots?.name}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Start Control */}
                    <div className="bg-[#101735] border border-white/5 rounded-2xl p-6">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <FaPlay className="text-yellow-500" size={14} />
                            Estado del Torneo
                        </h4>

                        {tournament.status === 'draft' ? (
                            <>
                                <div className="space-y-2 mb-6">
                                    <div className={`flex items-center gap-3 text-sm ${minReached ? 'text-green-400' : 'text-gray-500'}`}>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${minReached ? 'border-green-500' : 'border-gray-600'}`}>
                                            {minReached && <FaCheck />}
                                        </div>
                                        Mínimo 8 participantes ({approvedCount}/8)
                                    </div>
                                    <div className={`flex items-center gap-3 text-sm ${isEven ? 'text-green-400' : 'text-gray-500'}`}>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${isEven ? 'border-green-500' : 'border-gray-600'}`}>
                                            {isEven && <FaCheck />}
                                        </div>
                                        Número par de participantes ({approvedCount % 2 === 0 ? 'Par' : 'Impar'})
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartTournament}
                                    disabled={!canStart || processingId === 'starting'}
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${canStart
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:scale-[1.02]'
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    {processingId === 'starting' ? 'Iniciando...' : (canStart ? 'Iniciar Torneo y Generar Llaves' : 'Requisitos no cumplidos')}
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                                    <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">
                                        Torneo {tournament.status === 'active' ? 'en Progreso' : 'Finalizado'}
                                    </p>
                                </div>

                                {tournament.status === 'active' && (
                                    <div className="space-y-4">
                                        {animationActive && tournament.matches && (
                                            <div className="bg-[#050B14] p-6 rounded-2xl border border-blue-500/30 overflow-hidden relative">
                                                <div className="absolute top-0 right-0 p-2">
                                                    <GiBroadsword className="text-blue-500/20 animate-pulse" size={40} />
                                                </div>
                                                <div className="relative z-10">
                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">
                                                        Simulación en Curso: {tournament.matches[currentMatchIndex]?.round_number === 1 ? 'Cuartos' : (tournament.matches[currentMatchIndex]?.round_number === 2 ? 'Semis' : 'Gran Final')}
                                                    </p>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex-1 text-right">
                                                            <div className="text-white font-black text-xs italic uppercase">{tournament.matches[currentMatchIndex]?.r1 || 'Competidor A'}</div>
                                                        </div>
                                                        <div className="px-3 py-1 bg-red-500/20 text-red-500 font-black italic text-xs rounded-lg skew-x-[-15deg]">VS</div>
                                                        <div className="flex-1 text-left">
                                                            <div className="text-white font-black text-xs italic uppercase">{tournament.matches[currentMatchIndex]?.r2 || 'Competidor B'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-blue-500"
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: `${((currentMatchIndex + 1) / tournament.matches.length) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!animationActive && tournament.matches && tournament.matches.length > 0 && (
                                            <div className="bg-[#050B14] p-4 rounded-xl border border-yellow-500/30">
                                                <h5 className="text-yellow-500 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <GiPodiumWinner size={16} />
                                                    Asignar Ganador del Torneo
                                                </h5>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {(() => {
                                                        const finalMatch = tournament.matches[tournament.matches.length - 1];
                                                        const approvedRegs = tournament.registrations?.filter(r => r.is_approved) || [];

                                                        const findP = (id) => approvedRegs.find(r =>
                                                            r.competitor_id === id ||
                                                            r.id === id ||
                                                            r.competitors?.id === id
                                                        );

                                                        const pA = findP(finalMatch.competitor_a);
                                                        const pB = findP(finalMatch.competitor_b);

                                                        return [
                                                            { id: finalMatch.competitor_a, name: pA?.competitors?.user?.nickname || pA?.user?.nickname || "Finalista A" },
                                                            { id: finalMatch.competitor_b, name: pB?.competitors?.user?.nickname || pB?.user?.nickname || "Finalista B" }
                                                        ].map(p => (
                                                            <button
                                                                key={p.id}
                                                                onClick={() => handleConfirmarGanador(p.id)}
                                                                disabled={processingId === 'confirming-winner' || processingId === 'finalizing'}
                                                                className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 text-yellow-500 transition-all text-sm font-bold uppercase tracking-tighter italic"
                                                            >
                                                                {processingId === 'confirming-winner' ? '...' : p.name}
                                                            </button>
                                                        ));
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {tournament.status === 'finished' && tournament.results && (
                                    <div className="space-y-3">
                                        <h5 className="text-yellow-500 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <FaMedal size={16} />
                                            Podio de Ganadores
                                        </h5>
                                        <div className="grid grid-cols-1 gap-2">
                                            {tournament.results.map((res) => (
                                                <div key={res.id} className="bg-[#050B14] p-3 rounded-xl border border-white/5 flex justify-between items-center group hover:border-yellow-500/30 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${res.position === 1 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' :
                                                            res.position === 2 ? 'bg-gray-400 text-black' :
                                                                'bg-orange-600 text-black'
                                                            }`}>
                                                            {res.position}°
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold text-sm uppercase italic">{res.competitors?.user?.nickname || "Participante"}</p>
                                                            <p className="text-gray-500 text-[10px] uppercase font-black">{res.robots?.name || "Sin Robot"} • {res.competitors?.club?.name || "Sin Club"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-yellow-500 font-black italic text-xs">+{res.points_awarded} PTS</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
