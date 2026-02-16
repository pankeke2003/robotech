import { useState, useEffect } from "react";
import { dataService } from "../../services/dataService";
import { FaGavel, FaCalendarAlt, FaUsers, FaSearch } from "react-icons/fa";
import { GiPodiumWinner } from "react-icons/gi";

export default function JudgeTournamentsView({ userInfo, navigate }) {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMyTournaments = async () => {
            setLoading(true);
            try {
                // Fetch tournaments specifically assigned to this judge ID
                // judge_id in query params filters in backend now
                const response = await dataService.getTournaments({
                    take: 100,
                    judge_id: userInfo.id
                });

                setTournaments(response.data || []);
            } catch (error) {
                console.error("Error fetching judge tournaments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo?.id) {
            fetchMyTournaments();
        }
    }, [userInfo]);

    const filteredTournaments = tournaments.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-full flex flex-col bg-[#050B14] p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <FaGavel className="text-[#00C2FF]" />
                        Panel de Juez
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Gestiona y califica los torneos asignados.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar torneo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#101735] border border-[#1E90FF33] rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00C2FF] transition-all"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00C2FF]"></div>
                    </div>
                ) : filteredTournaments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
                        <FaGavel size={48} className="text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No tienes torneos asignados</h3>
                        <p className="text-gray-500 max-w-sm mt-2">
                            Aún no has sido asignado como juez a ningún torneo activo. Contacta a un administrador si crees que es un error.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTournaments.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="group relative bg-[#101735] border border-[#1E90FF22] rounded-2xl p-6 hover:border-[#00C2FF] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00C2FF11]"
                            >
                                <div className="absolute top-4 right-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${tournament.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                        tournament.status === 'finished' ? 'bg-gray-700 text-gray-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {tournament.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 pr-8">{tournament.name}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{tournament.description}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <FaCalendarAlt className="text-[#00C2FF]" />
                                        <span>{new Date(tournament.start_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <FaUsers className="text-[#00C2FF]" />
                                        <span>{tournament.max_participants} Participantes</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/menu?vista=juez-detalle', { state: { tournamentId: tournament.id } })}
                                    className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-[#00C2FF] to-[#0094FF] text-white shadow-md hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <FaGavel />
                                    Calificar / Gestionar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
