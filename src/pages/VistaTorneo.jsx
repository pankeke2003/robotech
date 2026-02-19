import React, { useState, useEffect } from 'react';
import { FaTrophy, FaUsers, FaMedal, FaUserCheck, FaGavel } from 'react-icons/fa';
import { GiPodiumWinner } from "react-icons/gi";
import { FiEye, FiShare2, FiCalendar, FiMapPin, FiClock, FiChevronLeft, FiPlus } from "react-icons/fi";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoimg from "../assets/images/logo.png";
import userlogo from "../assets/images/userlogo.png";
import { Menu, X, User, Users as UsersIcon, LogOut } from "lucide-react";
import { authService } from "../services/authService";
import { dataService } from "../services/dataService";

const VistaTorneo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(() => authService.getCurrentUser());
  // Recalcular isFromLogin basado en la existencia del usuario real
  const isFromLogin = !!userInfo;

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);

  // Helper para roles
  const getRoleLabel = () => {
    if (!userInfo) return "Invitado";
    const roles = [];
    if (userInfo.isCompetitor) roles.push("Competidor");
    if (userInfo.isClubOwner) roles.push("Dueño");
    if (roles.length === 0 && userInfo.role) return userInfo.role.toUpperCase();
    return roles.join(" & ");
  };
  // ... rest of code until header user section
  const generarFechaInscripcion = () => {
    const hoy = new Date();
    const diasAtras = Math.floor(Math.random() * 15);
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - diasAtras);
    return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  };

  /**
   * 🌐 API INTEGRATION TIP:
   * Para cargar datos dinámicos del torneo (jueces, inscritos, etc.):
   * 
   * useEffect(() => {
   *   const fetchTournamentData = async () => {
   *     const res = await fetch('/api/tournaments/1');
   *     const data = await res.json();
   *     // setTorneo(data);
   *   };
   *   fetchTournamentData();
   * }, []);
   */

  /* REMOVED HARDCODED TORNEO CONST */
  const [torneo, setTorneo] = useState({
    imagen: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=2020&auto=format&fit=crop',
    nombre: 'Torneo (Cargando...)',
    descripcion: '...',
    categoria: '...',
    puntosCompetidor: 0,
    puntosClub: 0,
    fechaInicio: '-',
    fechaFin: '-',
    ubicacion: '...',
    limiteInscripciones: '-',
    estado: 'Cargando',
    jueces: [],
    jugadoresInscritos: []
  });

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [inscritos, setInscritos] = useState([]);
  const [faseSimulacion, setFaseSimulacion] = useState('idle'); // 'idle', 'alistando', 'combatiendo', 'finalizado'
  const [showCombates, setShowCombates] = useState(false);
  const [esInscrito, setEsInscrito] = useState(false);
  const [mostrarBloqueo, setMostrarBloqueo] = useState(false);
  const [contador, setContador] = useState(5);

  const [combateActualIndex, setCombateActualIndex] = useState(-1);
  const [mostrandoArena, setMostrandoArena] = useState(false);

  const combatesReferencia = [
    { r1: 'luis2005', r2: 'NeoMind X7', fase: 'Cuartos de Final', robot1: 'LuisBot Alpha', robot2: 'Striker X', winner: 'luis2005' },
    { r1: 'Steel Thinker', r2: 'Quantum Brain', fase: 'Cuartos de Final', robot1: 'Thinker V2', robot2: 'Q-Brain', winner: 'Quantum Brain' },
    { r1: 'luis2005', r2: 'Quantum Brain', fase: 'Semi-Final', robot1: 'LuisBot Alpha', robot2: 'Q-Brain', winner: 'luis2005' },
    { r1: 'AI Master 9000', r2: 'Deep Thought Jr.', fase: 'Semi-Final', robot1: 'MasterIA', robot2: 'Junior', winner: 'AI Master 9000' },
    { r1: 'luis2005', r2: 'AI Master 9000', fase: 'Gran Final', robot1: 'LuisBot Alpha', robot2: 'MasterIA', winner: 'luis2005' },
  ];

  const [userRobots, setUserRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [loadingRobots, setLoadingRobots] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- AUDIO ASSETS ---
  const AUDIO_URLS = {
    countdown: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    versus: "https://assets.mixkit.co/active_storage/sfx/2186/2186-preview.mp3",
    battleMusic: "https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3",
    victory: "https://assets.mixkit.co/active_storage/sfx/1433/1433-preview.mp3",
    impact: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
    registration: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
  };

  const [bgMusic] = useState(new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_51571d782c.mp3?filename=clutch-hit-11002.mp3"));

  const playSFX = (url, vol = 0.3) => {
    const audio = new Audio(url);
    audio.volume = vol;
    audio.play().catch(e => console.log("Audio play blocked: ", e));
  };

  const fetchTournamentDetails = async () => {
    if (!location.state?.tournamentId) return;
    setIsLoadingDetails(true);
    try {
      const data = await dataService.getTournamentDetails(location.state.tournamentId);
      if (data && data.data) {
        const t = data.data;

        // Auto-start simulation if status changes to 'active'
        if (t.status === 'active' && faseSimulacion === 'idle') {
          // Check if simulation already played for THIS tournament
          const simulationKey = `sim_played_${t.id}`;
          const simulationPlayed = localStorage.getItem(simulationKey);

          if (!simulationPlayed) {
            handleIniciarTorneo();
            localStorage.setItem(simulationKey, 'true');
          } else {
            // If already played, go straight to results view
            setFaseSimulacion('finalizado');
            setShowCombates(true);
          }
        } else if (t.status === 'finished') {
          setFaseSimulacion('finalizado');
          setShowCombates(true);
        }

        const mappedInscritos = t.registrations?.map(r => ({
          id: r.id,
          competitor_id: r.competitors?.id || r.competitor_id,
          nombre: r.competitors.user?.nickname || r.user?.name || "Participante",
          club: r.competitors.club?.name || "Sin Club",
          puntos: 0,
          esUsuario: r.competitors?.user_id === userInfo?.id,
          image: null,
          status: r.is_approved ? 'approved' : 'pending'
        })) || [];

        const userReg = mappedInscritos.find(r => r.esUsuario);

        if (registrationStatus === 'pending' && userReg?.status === 'approved') {
          setShowSuccessNotification(true);
          playSFX(AUDIO_URLS.victory, 0.5);
        }

        setTorneo(prev => ({
          ...prev,
          id: t.id,
          nombre: t.name,
          descripcion: t.description,
          categoria: t.category?.name || "General",
          estado: t.status === 'active' ? 'En Progreso' : (t.status === 'finished' ? 'Finalizado' : (t.status === 'draft' ? 'Abierto' : 'Cerrado')),
          status: t.status,
          jueces: t.judges?.map(j => ({
            id: j.id,
            nombre: j.judges?.user?.name || "Juez",
            user_id: j.judges?.user_id
          })) || [],
          jugadoresInscritos: mappedInscritos,
          matches: (t.matches || []).map(m => {
            const findN = (id) => mappedInscritos.find(i => i.competitor_id === id || i.id === id)?.nombre || "Competidor";
            const findW = (id) => mappedInscritos.find(i => i.competitor_id === id || i.id === id)?.nombre || null;
            return {
              ...m,
              r1: findN(m.competitor_a),
              r2: findN(m.competitor_b),
              winner: m.winner_id ? findW(m.winner_id) : null
            };
          }),
          results: t.results?.map(r => ({
            position: r.position,
            nombre: r.competitors?.user?.nickname || "Participante",
            club: r.competitors?.club?.name || "Sin Club",
            puntos: r.points_awarded,
            robot: r.robots?.name || "Robot"
          })) || []
        }));

        setInscritos(mappedInscritos);

        if (userReg) {
          setEsInscrito(true);
          setRegistrationStatus(userReg.status);
        } else {
          setEsInscrito(false);
          setRegistrationStatus(null);
        }
      }
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchTournamentDetails();
  }, [location.state?.tournamentId, userInfo?.id]);

  // Unified Polling Hook
  useEffect(() => {
    let interval;
    // Poll if registration is pending OR if the tournament is in draft/active (waiting to start or waiting for judge results)
    const shouldPoll = (esInscrito && registrationStatus === 'pending') ||
      (torneo.status === 'draft' && faseSimulacion === 'idle') ||
      (torneo.status === 'active' && faseSimulacion === 'finalizado');

    if (shouldPoll) {
      interval = setInterval(() => {
        fetchTournamentDetails();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [esInscrito, registrationStatus, torneo.status, faseSimulacion]);

  useEffect(() => {
    if (userInfo?.id) {
      const fetchRobots = async () => {
        setLoadingRobots(true);
        const robots = await dataService.getUserRobots(userInfo.id);
        setUserRobots(robots);
        setLoadingRobots(false);
      };
      fetchRobots();
    }
  }, [userInfo]);

  useEffect(() => {
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [bgMusic]);

  useEffect(() => {
    let timer;
    if (mostrarBloqueo && contador > 0) {
      playSFX(AUDIO_URLS.countdown, 0.2);
      timer = setInterval(() => {
        setContador(prev => {
          if (prev > 1) playSFX(AUDIO_URLS.countdown, 0.2);
          return prev - 1;
        });
      }, 1000);
    } else if (contador === 0) {
      setMostrarBloqueo(false);
      setFaseSimulacion('combatiendo');
      setShowCombates(true);
      setMostrandoArena(true);
      setCombateActualIndex(0);

      bgMusic.loop = true;
      bgMusic.volume = 0.15;
      bgMusic.play().catch(e => console.log("Music play blocked: ", e));
      playSFX(AUDIO_URLS.versus, 0.4);
    }
    return () => clearInterval(timer);
  }, [mostrarBloqueo, contador, bgMusic]);

  useEffect(() => {
    if (mostrandoArena && combateActualIndex !== -1 && combateActualIndex < torneo.matches.length) {
      setRobotIzquierda(torneo.matches[combateActualIndex]?.r1);
      setRobotDerecha(torneo.matches[combateActualIndex]?.r2);
      setGanadorActual(torneo.matches[combateActualIndex]?.winner);

      if (combateActualIndex > 0) playSFX(AUDIO_URLS.impact);

      const timer = setTimeout(() => {
        if (combateActualIndex === torneo.matches.length - 1) {
          setTimeout(() => {
            setMostrandoArena(false);
            setFaseSimulacion('finalizado');
            bgMusic.pause();
            bgMusic.currentTime = 0;
            playSFX(AUDIO_URLS.victory, 0.4);
          }, 4000);
        } else {
          setCombateActualIndex(prev => prev + 1);
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [mostrandoArena, combateActualIndex, bgMusic, torneo.matches]);

  const handleInscripcion = async () => {
    setModalRegistroAbierto(true);

    if (esInscrito) return;

    // Validate robot selection
    if (!selectedRobot) {
      alert("Debes seleccionar un robot para inscribirte.");
      return;
    }

    try {
      if (torneo.id) {
        // REAL REGISTRATION
        await dataService.registerForTournament(torneo.id, selectedRobot.id);
      } else {
        // MOCK FALLBACK (If viewing standalone without ID)
        console.warn("Registrando en modo mock (sin ID de torneo)");
      }

      const nuevoParticipante = {
        id: Date.now(),
        nombre: userInfo?.nickname || 'Usuario',
        club: 'Sin Club',
        puntos: 0,
        fechaInscripcion: 'Hoy',
        esUsuario: true,
        image: userlogo, // Usar la imagen de perfil
        robot: selectedRobot.name,
        status: 'pending' // Estado inicial
      };

      setRegistrationStatus('pending');
      setEsInscrito(true);
      setModalRegistroAbierto(false);

      // Refresh details immediately after registration
      await fetchTournamentDetails();

      playSFX(AUDIO_URLS.registration);
      alert(`Solicitud enviada. Tu inscripción con ${selectedRobot.name} está PENDIENTE de aprobación por el juez.`);

    } catch (error) {
      console.error(error);
      alert("Error al registrar: " + error.message);
    }
  };

  const handleIniciarTorneo = () => {
    setMostrarBloqueo(true);
    setContador(5);
    setFaseSimulacion('alistando');
  };

  const handleReiniciar = () => {
    setInscritos(torneo.jugadoresInscritos);
    setFaseSimulacion('idle');
    setShowCombates(false);
    setEsInscrito(false);
    setCombateActualIndex(-1);
    setMostrandoArena(false);
  };

  const handleConfirmarGanador = async (winnerId) => {
    if (!torneo.matches || torneo.matches.length === 0) {
      alert("No se encontraron combates para confirmar.");
      return;
    }

    // El match final es el último del arreglo
    const finalMatch = torneo.matches[torneo.matches.length - 1];

    if (!winnerId) {
      alert("Por favor selecciona un ganador.");
      return;
    }

    setLoading(true);
    try {
      await dataService.confirmWinner(finalMatch.id, winnerId, 'knockout');
      alert("¡Ganador oficial registrado correctamente!");
      fetchTournamentDetails(); // Refresh to show official results
    } catch (error) {
      console.error("Error confirming winner:", error);
      alert("Error al confirmar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isAssignedJudge = torneo.jueces?.some(j => j.user_id === userInfo?.id);

  return (
    <div className="min-h-screen bg-[#0A0F24] text-gray-200 font-[Segoe_UI] overflow-x-hidden relative">
      {/* BACKGROUND PATTERN */}
      < div className="fixed inset-0 z-0 pointer-events-none opacity-30" >
        <div className="absolute inset-0 bg-[radial-gradient(#1e90ff_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#0A0F24]/50 to-[#0A0F24]"></div>
      </div >

      <div className="relative z-10">
        {/* HEADER */}
        <header className="bg-[#0A0F24]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <FiChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                <img src={logoimg} alt="Robotech" className="w-8 h-8 pointer-events-none" />
                <span className="text-xl font-black italic tracking-tighter text-white uppercase">Robotech</span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-4">
              {isFromLogin ? (
                <div className="relative group">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-all">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-white leading-none">{userInfo?.nickname || userInfo?.name || "Usuario"}</p>
                      <p className="text-[10px] text-[#00C2FF] mt-1 uppercase tracking-widest font-black">{getRoleLabel()}</p>
                    </div>
                    <img
                      src={userlogo}
                      alt="User"
                      className="w-10 h-10 rounded-full border border-[#00C2FF] object-cover"
                    />
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-[#0A0F24] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1100] backdrop-blur-xl">
                    <div className="p-1">
                      <button
                        onClick={() => navigate("/perfilusuario")}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-all"
                      >
                        <User size={16} />
                        Ver Perfil
                      </button>
                      <button
                        onClick={() => navigate("/menu?vista=mi-club", { state: { fromLogin: true } })}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-all"
                      >
                        <UsersIcon size={16} />
                        Ver Mi Club
                      </button>
                      <div className="my-1 border-t border-white/10"></div>
                      <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 bg-[#1E90FF] hover:bg-[#00C2FF] text-[#0A0F24] rounded-full text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                  >
                    Registrar
                  </button>
                </>
              )}
            </nav>

            <button className="lg:hidden p-2 text-white" onClick={() => setMenuAbierto(true)}>
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative h-[400px] md:h-[500px] flex items-end">
          <img
            src={torneo.imagen}
            alt={torneo.nombre}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F24] via-[#0A0F24]/40 to-transparent"></div>

          <div className="max-w-7xl mx-auto w-full px-4 pb-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-[#1E90FF] text-[#0A0F24] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  {torneo.categoria}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${torneo.estado === 'Abierto' ? 'border-green-500/40 text-green-400 bg-green-500/5' : 'border-red-500/40 text-red-400 bg-red-500/5'
                  }`}>
                  {torneo.estado}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                {torneo.nombre}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-medium uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-[#1E90FF]" /> {torneo.ubicacion}
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-[#1E90FF]" /> {torneo.fechaInicio} - {torneo.fechaFin}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-8 space-y-12">
              <section>
                <h2 className="text-xs font-black text-[#1E90FF] uppercase tracking-[0.4em] mb-4 border-l-4 border-[#1E90FF] pl-4">Descripción del Evento</h2>
                <p className="text-xl text-gray-400 leading-relaxed font-medium">
                  {torneo.descripcion}
                </p>
              </section>

              {/* STATS TILES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatTile
                  icon={<FaMedal />}
                  label="Puntos Individuales"
                  value={`+${torneo.puntosCompetidor}`}
                  color="text-blue-400"
                />
                <StatTile
                  icon={<FaUserCheck />}
                  label="Puntos Club"
                  value={`+${torneo.puntosClub}`}
                  color="text-purple-400"
                />
                <StatTile
                  icon={<FiClock />}
                  label="Cierre Inscripción"
                  value={torneo.limiteInscripciones}
                  color="text-red-400"
                />
                <StatTile
                  icon={<FaUsers />}
                  label="Inscritos"
                  value={`${torneo.jugadoresInscritos.length}/16`}
                  color="text-emerald-400"
                />
              </div>

              {/* PARTICIPANTS TABLE */}
              <section className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Participantes Inscritos</h3>
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    LISTADO OFICIAL
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] border-b border-white/5">
                        <th className="px-6 py-4">#</th>
                        <th className="px-6 py-4">Robot / Competidor</th>
                        <th className="px-6 py-4">Clan / Club</th>
                        {/* <th className="px-6 py-4 text-right whitespace-nowrap">Puntos Rank</th> */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm uppercase font-bold tracking-tight">
                      {inscritos.map((player, idx) => (
                        <tr key={player.id} className={`hover:bg-white/5 transition-colors group ${player.status === 'pending' ? 'opacity-60' : ''}`}>
                          <td className="px-6 py-5 text-gray-600">{idx + 1}</td>
                          <td className="px-6 py-5 text-white">
                            <div className="flex items-center gap-3">
                              {player.image ? (
                                <img src={player.image} alt={player.nombre} className="w-8 h-8 rounded-full border border-[#00C2FF] object-cover" />
                              ) : (
                                <div className={`w-8 h-8 rounded bg-gradient-to-br flex items-center justify-center text-[10px] font-black ${player.status === 'pending' ? 'from-gray-600 to-gray-800' : 'from-[#1E90FF] to-blue-700'}`}>
                                  {player.nombre.charAt(0)}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className={player.esUsuario ? "text-[#00C2FF] font-black" : ""}>{player.nombre}</span>
                                {player.esUsuario && (
                                  <span className={`text-[8px] font-black tracking-widest leading-none uppercase ${player.status === 'approved' ? 'text-green-400' : 'text-[#00C2FF]'}`}>
                                    {player.status === 'approved' ? 'Participante Confirmado' : 'Inscripción en Proceso'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-gray-400">
                            <div className="flex items-center justify-between">
                              <span>{player.club}</span>
                              {player.status === 'approved' && <span className="text-green-400 text-[10px]">✓ Confirmado</span>}
                              {player.status === 'pending' && <span className="text-yellow-500/50 text-[10px] italic">Pendiente...</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SUCCESS NOTIFICATION OVERLAY */}
              <AnimatePresence>
                {showSuccessNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center gap-4 border border-white/20"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      ✓
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-black uppercase tracking-tighter italic">¡Inscripción Aprobada!</h4>
                      <p className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Ya eres participante oficial del torneo</p>
                    </div>
                    <button
                      onClick={() => setShowSuccessNotification(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SIMULATION SECTION */}
              <AnimatePresence>
                {faseSimulacion !== 'idle' && !mostrarBloqueo && (
                  <motion.section
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    {/* Status during combat */}
                    {mostrandoArena && (
                      <div className="bg-[#1E90FF]/5 border border-[#1E90FF]/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-12 h-12 border-2 border-[#1E90FF] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Sintonizando señal de la arena de combate...</p>
                      </div>
                    )}

                    {/* Final Results */}
                    {faseSimulacion === 'finalizado' && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-700/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center border border-yellow-500/20">
                          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,198,0,0.1),transparent_70%)]"></div>
                          <GiPodiumWinner className="text-6xl text-yellow-500 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />

                          {torneo.status === 'finished' && torneo.results && torneo.results.length > 0 ? (
                            <div className="relative z-10">
                              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">Podio Oficial</h2>
                              <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
                                {torneo.results.map((res, i) => (
                                  <div key={i} className="flex items-center justify-between bg-black/40 border border-white/10 p-4 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${res.position === 1 ? 'bg-yellow-500 text-black' :
                                          res.position === 2 ? 'bg-gray-400 text-black' :
                                            'bg-orange-600 text-black'
                                        }`}>
                                        {res.position}°
                                      </div>
                                      <div className="text-left">
                                        <div className="text-white font-black uppercase text-sm italic">{res.nombre}</div>
                                        <div className="text-[10px] text-gray-400 uppercase font-bold">{res.robot} • {res.club}</div>
                                      </div>
                                    </div>
                                    <div className="text-yellow-500 font-black italic">+{res.puntos} PTS</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <>
                              {(() => {
                                const finalMatch = torneo.matches?.[torneo.matches.length - 1];
                                const officialWinnerId = finalMatch?.winner_id;
                                const officialWinner = officialWinnerId ? inscritos.find(i => i.id === officialWinnerId) : null;

                                if (officialWinner) {
                                  return (
                                    <div className="mb-8 animate-bounce">
                                      <h2 className="text-4xl md:text-6xl font-black text-yellow-500 uppercase italic tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]">
                                        {officialWinner.nombre}
                                      </h2>
                                      <p className="text-white text-sm font-black uppercase tracking-[0.4em]">CAMPEÓN DEL TORNEO</p>
                                    </div>
                                  );
                                }

                                return (
                                  <>
                                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">PROCLAMAR GANADOR</h2>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Resultados de la Simulación</p>

                                    {/* Winner Selection for Judges */}
                                    {isAssignedJudge && torneo.status !== 'finished' && torneo.matches && torneo.matches.length > 0 && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                                        {(() => {
                                          const compA = inscritos.find(i => i.id === finalMatch.competitor_a);
                                          const compB = inscritos.find(i => i.id === finalMatch.competitor_b);

                                          return [
                                            { id: finalMatch.competitor_a, name: compA?.nombre || finalMatch.competitor_a_name || "Competidor A" },
                                            { id: finalMatch.competitor_b, name: compB?.nombre || finalMatch.competitor_b_name || "Competidor B" }
                                          ].map((comp) => (
                                            <button
                                              key={comp.id}
                                              onClick={() => handleConfirmarGanador(comp.id)}
                                              className="group bg-black/40 border border-white/10 p-6 rounded-2xl hover:border-yellow-500/50 transition-all flex flex-col items-center gap-4 active:scale-95"
                                            >
                                              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-2xl font-black text-white group-hover:from-yellow-500 group-hover:to-amber-600 transition-all">
                                                {comp.name.charAt(0)}
                                              </div>
                                              <div>
                                                <p className="text-white font-black uppercase italic tracking-tighter">{comp.name}</p>
                                                <p className="text-[9px] text-yellow-500 uppercase font-black tracking-widest mt-1">ELEGIR COMO GANADOR</p>
                                              </div>
                                            </button>
                                          ));
                                        })()}
                                      </div>
                                    )}

                                    {!isAssignedJudge && (
                                      <div className="mb-8">
                                        <p className="text-yellow-400 font-black uppercase tracking-widest italic text-xl">
                                          Esperando confirmación del Juez
                                        </p>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </>
                          )}

                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                            <button
                              onClick={handleReiniciar}
                              className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                              Volver a la Vista General
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.section>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4 space-y-8">
              {/* ACTION CARD */}
              <div className="bg-gradient-to-br from-[#1E90FF] to-blue-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
                      {faseSimulacion !== 'idle' ? "Torneo en Curso" : (esInscrito ? "¡Inscrito!" : (isFromLogin ? "¡Listo para competir!" : "Únete a la Batalla"))}
                    </h3>
                    <p className="text-[#0A0F24]/70 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                      {faseSimulacion !== 'idle'
                        ? "Los combates han comenzado. ¡Mucha suerte!"
                        : (esInscrito
                          ? `Felicidades ${userInfo?.nickname || 'Participante'}. Esperando al inicio del administrador.`
                          : (isFromLogin
                            ? (userInfo?.role === 'judge' ? "Estás asignado como Juez para este evento." : "Tu equipo está verificado. Pulsa para inscribir tu robot.")
                            : "Necesitas logearte para participar"))}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {faseSimulacion === 'idle' && !esInscrito && torneo.status === 'draft' && userInfo?.role !== 'judge' && (
                      <button
                        onClick={() => isFromLogin ? handleInscripcion() : setModalRegistroAbierto(true)}
                        className="w-full py-4 bg-white text-[#0A0F24] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl"
                      >
                        {isFromLogin ? "Inscribirse" : "Inscribirte"}
                      </button>
                    )}
                    {torneo.status !== 'draft' && torneo.status !== 'finished' && !esInscrito && (
                      <button
                        disabled
                        className="w-full py-4 bg-gray-400/20 text-gray-400 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed"
                      >
                        Inscripciones Cerradas
                      </button>
                    )}
                    {torneo.status === 'finished' && (
                      <div className="p-4 bg-white/10 border border-white/20 rounded-2xl text-center">
                        <p className="text-white font-black uppercase tracking-widest text-[10px]">Torneo Finalizado</p>
                      </div>
                    )}
                    {esInscrito && registrationStatus === 'pending' && (
                      <button
                        disabled
                        className="w-full py-4 bg-gray-400/20 text-gray-400 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed"
                      >
                        Solicitud pendiente
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[10px] font-black text-white/60 uppercase tracking-widest">
                    <span>Requerimientos: CPU Gen 8+</span>
                    <FiShare2 className="cursor-pointer hover:text-white" />
                  </div>
                </div>
              </div>

              {/* JUDGES */}
              <section className="bg-white/5 border border-white/5 rounded-3xl p-6">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                  <FaGavel className="text-[#1E90FF]" /> Mesa de Jueces
                </h4>
                <div className="space-y-4">
                  {torneo.jueces.map(juez => (
                    <div key={juez.id} className="flex items-center gap-4 bg-[#0A0F24]/50 p-4 rounded-2xl border border-white/5 group hover:border-[#1E90FF]/30 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[#1E90FF] group-hover:bg-[#1E90FF] group-hover:text-white transition-all shadow-md">
                        {juez.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight">{juez.nombre}</div>
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">{juez.titulo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ADVERTISING / NOTES */}
              <div className="bg-[#131B36] border-l-4 border-yellow-500 p-6 rounded-2xl">
                <h5 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Nota Importante</h5>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide leading-relaxed">
                  Se requiere pesaje oficial 2 horas antes de cada combate. Robot sin ficha técnica no podrá participar.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="footer-vistas border-t border-white/5 mt-20 pb-20 pt-10 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src={logoimg} alt="Robotech" className="w-12 h-12 grayscale opacity-50" />
              <div>
                <h6 className="text-xl font-black italic tracking-tighter text-white/20 uppercase">ROBOTECH ARENA</h6>
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">&copy; 2025 ALL RIGHTS RESERVED</p>
              </div>
            </div>

            <nav className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-white transition-colors">Torneos</a>
              <a href="#" className="hover:text-white transition-colors">Ranking</a>
              <a href="#" className="hover:text-white transition-colors">Clubes</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
            </nav>
          </div>
        </footer>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0A0F24]/95 backdrop-blur-xl p-8 flex flex-col items-center justify-center space-y-12"
          >
            <button className="absolute top-6 right-6 text-white" onClick={() => setMenuAbierto(false)}>
              <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-2">
              <img src={logoimg} alt="Robotech" className="w-16 h-16" />
              <span className="text-3xl font-black italic tracking-tighter text-white uppercase">Robotech</span>
            </div>

            <nav className="flex flex-col items-center gap-8 text-2xl font-black text-white uppercase italic tracking-tighter">
              {isFromLogin ? (
                <>
                  <button onClick={() => navigate('/perfilusuario')} className="hover:text-[#1E90FF]">Ver Perfil</button>
                  <button onClick={() => navigate('/')} className="hover:text-red-500">Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="hover:text-[#1E90FF]">Login</button>
                  <button onClick={() => navigate('/register')} className="hover:text-[#1E90FF]">Register</button>
                </>
              )}
              <button onClick={() => setMenuAbierto(false)} className="hover:text-[#1E90FF]">Volver</button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {modalRegistroAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-[#0A0F24]/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#131B36] border border-white/10 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-[#1E90FF] mb-6 shadow-inner">
                  <FiPlus size={40} className="rotate-45" />
                </div>

                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                  Requiere Cuenta
                </h3>

                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest leading-relaxed mb-8">
                  Necesitas tener una cuenta de <span className="text-white">competidor</span> para participar en este evento.
                </p>

                <div className="flex flex-col w-full gap-3">
                  {loadingRobots ? (
                    <p className="text-white text-sm">Cargando tus robots...</p>
                  ) : (
                    <>
                      <div className="mb-4 w-full">
                        <label className="block text-left text-[#1E90FF] text-[10px] uppercase font-bold mb-2">Selecciona tu Robot ({torneo.categoria})</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                          {userRobots.length > 0 ? (
                            userRobots.map(robot => (
                              <div
                                key={robot.id}
                                onClick={() => setSelectedRobot(robot)}
                                className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${selectedRobot?.id === robot.id
                                  ? 'bg-[#1E90FF]/20 border-[#1E90FF]'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                                  }`}
                              >
                                <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden">
                                  <img src={robot.image} alt={robot.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-white text-sm font-bold">{robot.name}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-red-400 text-xs p-2 border border-red-500/20 bg-red-500/10 rounded">
                              No tienes robots registrados.
                              <br />Crea uno en tu perfil.
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleInscripcion}
                        disabled={!selectedRobot}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${selectedRobot
                          ? 'bg-[#1E90FF] hover:bg-[#00C2FF] text-[#0A0F24] hover:shadow-blue-500/20'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        Enviar Inscripción
                      </button>
                      <button
                        onClick={() => setModalRegistroAbierto(false)}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BATTLE ARENA OVERLAY (MODAL CENTRADO) */}
      <AnimatePresence>
        {mostrandoArena && combateActualIndex !== -1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] bg-[#0A0F24]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden"
          >
            <div className="max-w-5xl w-full relative">
              {/* Header Info */}
              <div className="text-center mb-12 space-y-2">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  key={`phase-${combateActualIndex}`}
                  className="inline-flex items-center gap-3 px-6 py-2 bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded-full"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1E90FF] animate-pulse"></span>
                  <span className="text-[10px] md:text-xs font-black text-[#1E90FF] uppercase tracking-[0.4em]">
                    {combatesReferencia[combateActualIndex].fase} • {torneo.categoria}
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                  Simulación de Combate
                </h2>
              </div>

              {/* Arena Floor */}
              <div className="grid grid-cols-1 lg:grid-cols-11 items-center gap-8 lg:gap-4 relative">

                {/* Fighter 1 */}
                <motion.div
                  key={`r1-${combateActualIndex}`}
                  initial={{ x: -150, opacity: 0, rotateY: 45 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  className={`lg:col-span-5 border rounded-[3rem] p-8 md:p-12 flex flex-col items-center gap-6 relative group overflow-hidden shadow-2xl transition-all duration-700 ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r1
                    ? "bg-green-500/10 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                    : "bg-red-500/5 border-white/10 opacity-40 grayscale-[0.8]"
                    }`}
                >
                  <div className={`absolute top-0 left-0 w-2 h-full ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r1 ? "bg-green-500" : "bg-red-500"}`}></div>

                  {/* Winner/Loser Badge */}
                  <div className={`absolute top-6 right-6 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r1
                    ? "bg-green-500 text-white animate-bounce"
                    : "bg-red-500/20 text-red-500"
                    }`}>
                    {combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r1 ? "✓ GANADOR" : "✗ ELIMINADO"}
                  </div>

                  <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-8 p-2 flex items-center justify-center bg-[#0A0F24] relative transition-all duration-700 ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r1
                    ? "border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)] scale-110"
                    : "border-white/5"
                    }`}>
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl md:text-5xl font-black italic text-white ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r1 ? "bg-gradient-to-br from-green-400 to-green-700" : "bg-gray-800"
                      }`}>
                      {combatesReferencia[combateActualIndex].r1.charAt(0)}
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">{combatesReferencia[combateActualIndex].r1}</h3>
                    <p className="text-[#00C2FF] text-[11px] font-black uppercase tracking-widest bg-[#00C2FF]/10 px-4 py-1 rounded-full">Robot: {combatesReferencia[combateActualIndex].robot1}</p>
                  </div>
                </motion.div>

                {/* VS Center */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center z-10">
                  <div className="relative">
                    <div className="text-6xl md:text-8xl font-black text-white/5 italic select-none">VS</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_#fff]">
                        <FaGavel className="text-[#0A0F24] text-xl md:text-2xl" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fighter 2 */}
                <motion.div
                  key={`r2-${combateActualIndex}`}
                  initial={{ x: 150, opacity: 0, rotateY: -45 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  className={`lg:col-span-5 border rounded-[3rem] p-8 md:p-12 flex flex-col items-center gap-6 relative group overflow-hidden shadow-2xl transition-all duration-700 ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r2
                    ? "bg-green-500/10 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                    : "bg-red-500/5 border-white/10 opacity-40 grayscale-[0.8]"
                    }`}
                >
                  <div className={`absolute top-0 right-0 w-2 h-full ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r2 ? "bg-green-500" : "bg-red-500"}`}></div>

                  {/* Winner/Loser Badge */}
                  <div className={`absolute top-6 left-6 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r2
                    ? "bg-green-500 text-white animate-bounce"
                    : "bg-red-500/20 text-red-500"
                    }`}>
                    {combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r2 ? "✓ GANADOR" : "✗ ELIMINADO"}
                  </div>

                  <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-8 p-2 flex items-center justify-center bg-[#0A0F24] relative transition-all duration-700 ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r2
                    ? "border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)] scale-110"
                    : "border-white/5"
                    }`}>
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl md:text-5xl font-black italic text-white ${combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r2 ? "bg-gradient-to-br from-green-400 to-green-700" : "bg-gray-800"
                      }`}>
                      {combatesReferencia[combateActualIndex].r2.charAt(0)}
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">{combatesReferencia[combateActualIndex].r2}</h3>
                    <p className="text-[#00C2FF] text-[11px] font-black uppercase tracking-widest bg-[#00C2FF]/10 px-4 py-1 rounded-full">Robot: {combatesReferencia[combateActualIndex].robot2}</p>
                  </div>
                </motion.div>

                {/* Match Progress */}
                <div className="mt-16 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4 text-gray-500 text-[12px] font-black uppercase tracking-[0.6em] animate-pulse">
                    <span>Combate {combateActualIndex + 1} de {combatesReferencia.length}</span>
                  </div>
                  <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <motion.div
                      key={`bar-${combateActualIndex}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-[#1E90FF] via-purple-500 to-red-600 rounded-full shadow-[0_0_15px_rgba(30,144,255,0.5)]"
                    />
                  </div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    {combatesReferencia[combateActualIndex].winner === combatesReferencia[combateActualIndex].r1
                      ? `¡VICTORIA PARA ${combatesReferencia[combateActualIndex].r1.toUpperCase()}!`
                      : `¡VICTORIA PARA ${combatesReferencia[combateActualIndex].r2.toUpperCase()}!`}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BLOCKING OVERLAY FOR ADMIN START */}
      <AnimatePresence>
        {mostrarBloqueo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-[#0A0F24] flex flex-col items-center justify-center p-8 select-none pointer-events-auto"
          >
            {/* Background elements to prevent interaction */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/20 to-[#0A0F24]"></div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 flex flex-col items-center text-center max-w-lg"
            >
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-red-500/40 animate-pulse">
                <span className="text-5xl font-black text-white italic">{contador}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                El administrador está por empezar la lucha
              </h2>

              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                />
              </div>

              <p className="mt-8 text-gray-500 text-xs font-black uppercase tracking-[0.5em] animate-bounce">
                ESTADO: PREPARANDO ARENA...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

// HELPER COMPONENTS
const StatTile = ({ icon, label, value, color }) => (
  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-2 hover:bg-white/10 transition-colors">
    <div className={`text-lg ${color}`}>{icon}</div>
    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</div>
    <div className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{value}</div>
  </div>
);

export default VistaTorneo;