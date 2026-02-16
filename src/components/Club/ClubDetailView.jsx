import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Users, Shield, Trophy, Target, Star, Calendar, ArrowLeft, Gamepad2, Award, Search, Menu, User, LogOut } from 'lucide-react';
import logo from "../../assets/images/logo.png";
import userLogo from "../../assets/images/userlogo.png";

const ClubDetailView = ({ club, onBack, isFromLogin }) => {
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [fullClubData, setFullClubData] = useState(null);

    useEffect(() => {
        const fetchClubDetails = async () => {
            if (club?.id) {
                try {
                    const res = await fetch(`/api/clubs/${club.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setFullClubData(data);
                    }
                } catch (error) {
                    console.error("Error fetching club details:", error);
                }
            }
        };
        fetchClubDetails();
    }, [club]);

    // Merge passed club prop with fetched data
    const displayClub = fullClubData || club;

    // Normalizar datos para evitar crash si faltan campos
    const safeClub = {
        id: displayClub?.id || 0,
        owner_id: displayClub?.owner_id || null,
        owner_name: fullClubData?.users_clubs_owner_idTousers?.nickname || "Desconocido",
        nombre: displayClub?.nombre || displayClub?.name || "Club Sin Nombre",
        image: displayClub?.image || displayClub?.logo || "https://picsum.photos/800/400?random=1",
        descripcion: displayClub?.descripcion || "Sin descripción disponible.",
        estado: displayClub?.estado || "Disponible",
        creado: displayClub?.creado || displayClub?.created_at ? new Date(displayClub.created_at || displayClub.creado).toLocaleDateString() : "N/A",
        categoria: displayClub?.categoria || "General",
        puntos: displayClub?.puntos || 0,
        rank: displayClub?.rank || "-",
        jugadoresActuales: fullClubData?._count?.competitors || displayClub?.jugadoresActuales || displayClub?.current_members || 0,
        maximo: displayClub?.maximo || displayClub?.max_members || 20,
        participantes: fullClubData?.competitors ? fullClubData.competitors.map(c => {
            const user = c.users_competitors_user_idTousers;
            const isOwner = fullClubData.owner_id === user.id;
            return {
                id: user.id,
                nombre: user.nickname,
                avatar: user.nickname.charAt(0).toUpperCase(),
                rol: isOwner ? "LÍDER" : "MIEMBRO",
                desde: c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A"
            };
        }) : (Array.isArray(displayClub?.participantes) ? displayClub.participantes : []),
        partidas: Array.isArray(displayClub?.partidas) ? displayClub.partidas : []
    };

    return (
        <div className="bg-[#0d0d1a] text-white font-[Segoe_UI] min-h-screen flex flex-col">
            {/* HEADER */}
            <header className="flex justify-between items-center bg-[#121225] p-4 border-b border-white/5 relative z-50">
                <div className="flex items-center gap-2 text-xl font-bold cursor-pointer" onClick={onBack}>
                    <img src={logo} alt="robotech" className="w-8 h-8" />
                    <h1 className="text-[#00C2FF]">Robotech</h1>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <button onClick={onBack} className="text-gray-300 text-sm hover:text-[#00C2FF] transition-colors uppercase font-bold tracking-widest">
                        Volver
                    </button>

                    {/* Renderizado condicional: Perfil vs Login/Register */}
                    {currentUser ? (
                        <div className="relative group">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-all">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-white leading-none">{currentUser?.nickname || currentUser?.name || "Usuario"}</p>
                                    <p className="text-[9px] text-[#00C2FF] mt-1 uppercase tracking-widest font-black">{currentUser?.role || "Competidor"}</p>
                                </div>
                                <img
                                    src={currentUser?.profile_picture ? (currentUser.profile_picture.startsWith('http') ? currentUser.profile_picture : `http://127.0.0.1:3000${currentUser.profile_picture}`) : "https://www.gravatar.com/avatar/0000?d=mp&f=y"}
                                    alt="User"
                                    className="w-9 h-9 rounded-full border border-[#00C2FF] object-cover"
                                />
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-[#121225] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1100] backdrop-blur-xl">
                                <div className="p-1">
                                    <button
                                        onClick={() => navigate("/perfilusuario")}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-all"
                                    >
                                        <User size={14} />
                                        Ver Perfil
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (currentUser && safeClub.owner_id === currentUser.id) {
                                                // Already in my club, maybe just scroll to top or alert
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            } else {
                                                // This view usually shows selected club, 
                                                // if we want to "Ver Mi Club" from a different club view:
                                                navigate("/menu?vista=mi-club", { state: { fromLogin: true } });
                                            }
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-all"
                                    >
                                        <Users size={14} />
                                        Ver Mi Club
                                    </button>
                                    <div className="my-1 border-t border-white/10"></div>
                                    <button
                                        onClick={() => {
                                            // Assuming authService is imported or localStorage manipulation directly if not available in this scope
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("user");
                                            navigate("/");
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    >
                                        <LogOut size={14} />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="px-5 py-2 bg-[#00C2FF] hover:bg-[#1E90FF] text-[#0A0F24] rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                            >
                                Registrar
                            </button>
                        </div>
                    )}
                </nav>

                <button className="md:hidden text-white p-2" onClick={() => navigate('/login')}>
                    <Menu size={24} />
                </button>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto p-4 md:p-8 space-y-8"
                >
                    {/* Club Identity Section */}
                    <div className="relative bg-[#101020] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                        {/* Banner */}
                        <div className="relative h-48 md:h-80">
                            <img src={safeClub.image} alt={safeClub.nombre} className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#101020] via-[#101020]/40 to-transparent"></div>

                            {/* Profile Info Overlay */}
                            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-[#1E90FF] to-blue-700 border-4 border-[#101020] flex items-center justify-center text-5xl font-black text-white shadow-2xl transform hover:rotate-3 transition-transform">
                                    {safeClub.nombre.charAt(0)}
                                </div>
                                <div className="mb-2 space-y-2">
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">{safeClub.nombre}</h2>
                                        {currentUser && safeClub.owner_id === currentUser.id && (
                                            <span className="px-3 py-1 bg-[#00C2FF]/10 border border-[#00C2FF]/30 text-[#00C2FF] rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                                Mi Club
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${safeClub.estado === 'Disponible' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}>
                                            {safeClub.estado}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold">
                                            <Calendar size={14} className="text-[#00C2FF]" />
                                            Creado: {safeClub.creado}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold">
                                            <Trophy size={14} className="text-yellow-500" />
                                            Categoría: {safeClub.categoria}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Summary Bar */}
                        <div className="bg-[#15152a] px-8 py-6 border-t border-white/5 flex flex-wrap justify-center md:justify-around gap-6">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Puntos Totales</span>
                                <div className="text-3xl font-black text-[#00C2FF] drop-shadow-[0_0_10px_rgba(0,194,255,0.3)]">{safeClub.puntos}</div>
                            </div>
                            <div className="w-px h-12 bg-white/5 hidden md:block"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Rank Mundial</span>
                                <div className="text-3xl font-black text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">#{safeClub.rank}</div>
                            </div>
                            <div className="w-px h-12 bg-white/5 hidden md:block"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Miembros</span>
                                <div className="text-3xl font-black text-purple-400 font-mono tracking-tighter">{safeClub.jugadoresActuales}/{safeClub.maximo}</div>
                            </div>
                            <div className="w-px h-12 bg-white/5 hidden md:block"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Código Entrada</span>
                                <div className="text-3xl font-black text-white font-mono tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">1349</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT: About & Members */}
                        <div className="lg:col-span-8 space-y-8">
                            <section className="bg-[#101020] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter border-l-4 border-[#00C2FF] pl-4 italic">El Clan</h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium capitalize-first">
                                    {safeClub.descripcion}
                                </p>
                            </section>

                            <section className="bg-[#101020] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter border-l-4 border-purple-500 pl-4 italic">
                                        Participantes <span className="text-gray-500 font-medium font-mono text-sm ml-2">[{safeClub.jugadoresActuales}/{safeClub.maximo}]</span>
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {safeClub.participantes.map((p, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-[#15152a] p-4 rounded-2xl border border-white/5 hover:border-[#1E90FF]/30 hover:bg-[#1a1a35] transition-all group">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg group-hover:scale-110 transition-transform">
                                                {p.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm md:text-base font-black text-white flex items-center gap-2">
                                                    {p.nombre}
                                                    {(p.rol === 'LÍDER' || p.rol === 'DUEÑO') && <span className="text-[8px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-sm font-black">{p.rol}</span>}
                                                    {currentUser && (p.id === currentUser.id || p.nombre === currentUser.nickname) && <span className="text-[8px] bg-[#00C2FF] text-[#0A0F24] px-1.5 py-0.5 rounded-sm font-black italic">TÚ</span>}
                                                </div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Desde: {p.desde}</div>
                                            </div>
                                            <button
                                                onClick={() => navigate('/perfilusuario?userId=' + (p.id || 999))} // Fallback ID if not present
                                                className="p-2 text-gray-600 hover:text-[#00C2FF] transition-colors"
                                            >
                                                <ArrowLeft className="rotate-180" size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT: History & Advertising */}
                        <div className="lg:col-span-4 space-y-8 font-medium">
                            <section className="bg-[#101020] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
                                <div className="bg-[#15152a] p-5 border-b border-white/5">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Gamepad2 size={16} className="text-[#00C2FF]" /> Partidas Recientes
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="text-gray-500 text-[10px] uppercase font-black tracking-widest text-left">
                                                <th className="p-4">Oponente</th>
                                                <th className="p-4 text-center">R</th>
                                                <th className="p-4 text-right">EST</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {safeClub.partidas.length > 0 ? safeClub.partidas.map((match, i) => (
                                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 text-white font-bold">{match.oponente}</td>
                                                    <td className="p-4 text-center text-gray-400 font-mono font-bold">{match.rondas}</td>
                                                    <td className="p-4 text-right">
                                                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${match.resultado === 'Victoria' ? 'bg-green-500/10 text-green-500' :
                                                            match.resultado === 'Derrota' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                                                            }`}>
                                                            {match.resultado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="p-10 text-center text-gray-500 italic uppercase tracking-widest text-[10px]">Sin registros</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Banner Tournament Promotion */}
                            <section className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-white/20 transition-all"></div>
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                            <Star size={20} className="text-white fill-white" />
                                        </div>
                                        <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Evento Próximo</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-white leading-tight uppercase italic">Nuevo Torneo de <span className="text-yellow-400">Boxing Elite</span></h4>
                                    <p className="text-white/80 text-xs font-bold leading-relaxed uppercase">Inscripciones abiertas del 10 al 20 DE ENERO</p>
                                    <button
                                        onClick={() => isFromLogin ? alert("¡Equipo registrado con éxito!") : navigate("/register")}
                                        className="w-full py-3 bg-white text-indigo-700 rounded-2xl text-xs font-black uppercase hover:scale-105 transition-all shadow-xl active:scale-95"
                                    >
                                        {isFromLogin ? "Registrar Mi Equipo" : "Registrar Equipo Aquí"}
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* FOOTER (Inspired by Equipo.jsx) */}
            <footer className="bg-[#121225] text-white py-12 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Logo Robotech" className="w-12 h-12" />
                            <h1 className="text-3xl font-black italic tracking-tighter">ROBOTECH</h1>
                        </div>
                        <p className="text-gray-500 text-sm max-w-md uppercase tracking-widest font-bold">La plataforma líder de combate robótico nacional.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <a href="#" className="text-gray-400 hover:text-[#00C2FF] text-xs font-black uppercase tracking-widest transition-colors">Peleas</a>
                        <a href="#" className="text-gray-400 hover:text-[#00C2FF] text-xs font-black uppercase tracking-widest transition-colors">Desafíos</a>
                        <a href="#" className="text-gray-400 hover:text-[#00C2FF] text-xs font-black uppercase tracking-widest transition-colors">Ranking</a>
                        <a href="#" className="text-gray-400 hover:text-[#00C2FF] text-xs font-black uppercase tracking-widest transition-colors">Soporte</a>
                    </div>

                    <hr className="w-full border-white/5" />

                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.5em]">&copy; 2025 ALL RIGHTS RESERVED • ROBOTECH ARENA</p>
                </div>
            </footer>
        </div>
    );
};

export default ClubDetailView;
