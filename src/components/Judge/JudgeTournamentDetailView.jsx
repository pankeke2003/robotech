import { useState, useEffect } from "react";
import { dataService } from "../../services/dataService";
import { FaGavel, FaCheck, FaTimes, FaUsers, FaPlay, FaArrowLeft } from "react-icons/fa";
import { GiPodiumWinner } from "react-icons/gi";

export default function JudgeTournamentDetailView({ tournamentId, requestNavigate }) {
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        if (!tournamentId) return;
        const loadData = async () => {
            setLoading(true);
            const res = await dataService.getTournamentDetails(tournamentId);
            if (res && res.data) {
                setTournament(res.data);
            }
            setLoading(false);
        };
        loadData();
    }, [tournamentId]);

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
        console.log("Confirming winner for match:", finalMatch.id, "Winner ID:", winnerId);

        setProcessingId('confirming-winner');
        try {
            const resConfirm = await dataService.confirmWinner(finalMatch.id, winnerId, 'knockout');
            console.log("Confirm response:", resConfirm);
            alert("¡Ganador oficial registrado correctamente!");
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
        <div className="min-h-full flex flex-col bg-[#050B14] p-6">
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

                                {tournament.status === 'active' && tournament.matches && tournament.matches.length > 0 && (
                                    <div className="bg-[#050B14] p-4 rounded-xl border border-yellow-500/30">
                                        <h5 className="text-yellow-500 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <GiPodiumWinner size={16} />
                                            Asignar Ganador del Torneo
                                        </h5>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(() => {
                                                const finalMatch = tournament.matches[tournament.matches.length - 1];
                                                const approvedRegs = tournament.registrations?.filter(r => r.is_approved) || [];

                                                // Robust finding: check competitor_id or nested competitor id or registration id
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
                                                        disabled={processingId === 'confirming-winner'}
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
                    </div>
                </div>
            </div>

        </div>
    );
}
