// src/pages/Menu.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import TorneosView from "../components/Tournament/TorneosView";
import RankingView from "../components/Tournament/RankingView";
import PuntajeView from "../components/Tournament/PuntajeView";
import CategoriasView from "../components/Tournament/CategoriasView";
import ClubsView from "../components/Club/ClubsView";
import ClubDetailView from "../components/Club/ClubDetailView";
import CrearClubView from "../components/Club/CrearClubView";
import JudgeTournamentsView from "../components/Judge/JudgeTournamentsView";
import JudgeTournamentDetailView from "../components/Judge/JudgeTournamentDetailView";
import GestionarMiClub from "./GestionarMiClub";

import AyudaView from "../components/AyudaView";
import logoimg from "../assets/images/logo.png";
import userlogo from "../assets/images/userlogo.png";
import robotvs from "../assets/images/robotvs.png";
import { GiBangingGavel, GiRobotGrab } from "react-icons/gi";
import { FaPeopleArrows, FaPersonRunning } from "react-icons/fa6";
import { FaUsers, FaUserPlus, FaUserMinus, FaStar } from "react-icons/fa6";
import { GiPodiumWinner } from "react-icons/gi";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Newspaper, Megaphone } from 'lucide-react';
import {
  Home,
  Search,
  Trophy,
  BarChart3,
  Star,
  Folder,
  CornerUpLeft,
  Users,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Calendar,
  Menu,
  X,
  Shield, // Admin Icon
  Briefcase // Club Owner Icon
} from "lucide-react";
import { FiAward, FiCpu, FiBarChart2, FiGlobe } from "react-icons/fi";
import CommandPalette from "../components/CommandPalette";
import { authService } from "../services/authService";
import { dataService } from "../services/dataService";
import { API_BASE_URL, getServerUrl } from "../config/api";

// 🔹 Componente reutilizable para ítems del sidebar
function SidebarItem({ icon, label, active, onClick }) {
  const navigate = useNavigate(); // Este navigate pertenece a SidebarItem
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active
        ? "bg-[#1E90FF33] text-[#00C2FF]"
        : "text-gray-300 hover:bg-[#1E90FF22] hover:text-white"
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function MenuPage() {
  const [vista, setVista] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isFromLogin = location.state?.fromLogin;
  const [busquedaModalAbierta, setBusquedaModalAbierta] = useState(false); // Nuevo estado para la modal
  const [terminoBusqueda, setTerminoBusqueda] = useState(""); // Opcional: estado para el término de búsqueda
  const [selectedClub, setSelectedClub] = useState(null); // Nuevo estado para el club seleccionado
  const [selectedJudgeTournamentId, setSelectedJudgeTournamentId] = useState(null); // Nuevo estado para juez
  const [paletteOpen, setPaletteOpen] = useState(false); // Estado para el Command Palette

  // Shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (view, data = null) => {
    setVista(view);
    if (view === 'club-detalle' && data) {
      setSelectedClub(data);
    }
  };

  // 🔹 ESTADO DE USUARIO (Dinámico)
  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Si venimos del login con state, actualizamos (opcional, por si localStorage tarda)
  useEffect(() => {
    if (location.state?.user) {
      setUserInfo(location.state.user);
    }
  }, [location.state]);

  const getRoleLabel = () => {
    if (!userInfo) return "Invitado";
    const roles = [];
    if (userInfo.isCompetitor) roles.push("Competidor");
    if (userInfo.isClubOwner) roles.push("Dueño de Club");
    // Fallback si no hay flags detallados pero hay rol principal
    if (roles.length === 0 && userInfo.role) return userInfo.role.toUpperCase();
    return roles.join(" & ") || "Usuario";
  };

  /**
   * 🌐 API INTEGRATION TIP:
   * Para cargar los datos del usuario real y su club, usa un useEffect:
   * 
   * useEffect(() => {
   *   const fetchUserData = async () => {
   *     const response = await fetch('/api/user/profile');
   *     const data = await response.json();
   *     // setMyClubData(data.club);
   *   };
   *   if (isFromLogin) fetchUserData();
   * }, [isFromLogin]);
   */

  // Datos de "Mi Club" (Cyber Titans)
  const myClubData = {
    id: 1,
    nombre: "Cyber Titans",
    puntos: 9820,
    jugadoresActuales: 14,
    minimo: 5,
    maximo: 20,
    estado: "Disponible",
    creado: "12/05/2024",
    categoria: "Heavyweight",
    rank: 1,
    lider: "Marcus Phoenix",
    descripcion: "Líderes en combate de peso pesado y estrategia de defensa. Buscamos ingenieros con experiencia en blindaje.",
    participantes: [
      { nombre: "Marcus Phoenix", rol: "LÍDER", desde: "12/05/2024", avatar: "P" },
      { nombre: "Sarah Kerrigan", rol: "INGENIERO", desde: "15/05/2024", avatar: "K" },
      { nombre: "Jim Raynor", rol: "PILOTO", desde: "20/05/2024", avatar: "R" },
      { nombre: "Artanis", rol: "ESTRATEGA", desde: "01/06/2024", avatar: "A" },
      { nombre: userInfo?.nickname || userInfo?.name || "Usuario", rol: "COMPETIDOR", desde: "Hoy", avatar: (userInfo?.nickname || userInfo?.name || "U").charAt(0).toUpperCase() } // El usuario actual
    ],
    partidas: [
      { oponente: "Digital Warriors", rondas: "3-1", fecha: "20/01/2025", resultado: "Victoria" },
      { oponente: "Nexus Elite", rondas: "2-2", fecha: "15/01/2025", resultado: "Empate" },
      { oponente: "Quantum Force", rondas: "3-0", fecha: "10/01/2025", resultado: "Victoria" }
    ],
    image: "https://picsum.photos/800/400?random=11"
  };

  // 👇 useEffect para leer la URL cuando el componente se monta
  useEffect(() => {
    const vistaParam = searchParams.get('vista');

    // Check for incoming club data from navigation state
    if (location.state?.selectedClub) {
      setSelectedClub(location.state.selectedClub);
      // Ensure we switch to club-detalle view
      if (vistaParam !== 'club-detalle') {
        // This might trigger a re-render or be handled by the next lines if we set vista immediately
        // But we can just rely on the setVista below if we also update logic
      }
    }

    if (location.state?.tournamentId) {
      setSelectedJudgeTournamentId(location.state.tournamentId);
    }

    if (vistaParam && ['inicio', 'torneos', 'ranking', 'puntaje', 'categorias', 'clubs', 'noticias', 'ayuda', 'login', 'registro', 'mi-club', 'club-detalle', 'juez-torneos', 'juez-detalle', 'gestionar-club'].includes(vistaParam)) {
      if (vistaParam === 'mi-club') {
        // Si tenemos datos reales, los usamos
        if (selectedClub) {
          setVista('club-detalle');
        } else if (location.state?.selectedClub) {
          // handled above but ensuring view is set
          setVista('club-detalle');
        } else {
          // Si no, intentamos fetch o mostramos mensaje (dependerá de la lógica de carga)
          // Por ahora, redirigimos a inicio si no hay club cargado
          setVista('inicio');
        }
      } else {
        setVista(vistaParam);
      }
    }
  }, [searchParams, navigate, location.state]); // Added location.state dependency

  // 🔹 FETCH REAL CLUB DATA
  const [myRealClub, setMyRealClub] = useState(null);

  useEffect(() => {
    const fetchMyClub = async () => {
      if (!userInfo || !userInfo.id) return;

      // Solo intentamos buscar club si es Admin o Dueño
      if (userInfo.role === 'admin' || userInfo.role === 'club_owner' || userInfo.isClubOwner) {
        try {
          // Asumiendo que el backend corre en el puerto 3000 por defecto
          // Si estás usando el 3001 (webpack), asegúrate de que esto coincida
          const response = await fetch(`${API_BASE_URL}/clubs?owner_id=${userInfo.id}`);
          if (response.ok) {
            const data = await response.json();
            // La API devuelve { total, data: [] }
            if (data.data && data.data.length > 0) {
              setMyRealClub(data.data[0]);
            }
          }
        } catch (error) {
          console.error("Error fetching my club:", error);
        }
      }
    };

    fetchMyClub();
  }, [userInfo]);


  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // 🔹 NEWS STATES
  const [newsList, setNewsList] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    if (vista === 'noticias') {
      const fetchNews = async () => {
        setLoadingNews(true);
        try {
          const res = await dataService.getNews();
          setNewsList(res.data || []);
        } catch (error) {
          console.error("Error fetching news in Menu:", error);
        } finally {
          setLoadingNews(false);
        }
      };
      fetchNews();
    }
  }, [vista]);

  // 🔹 REAL STATS
  const [categoriesList, setCategoriesList] = useState([]);
  const [rankingsList, setRankingsList] = useState([]);
  const [stats, setStats] = useState({
    activeTournaments: 0,
    competitors: 0,
    categories: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tournamentsRes, usersRes, categoriesRes] = await Promise.all([
          dataService.getTournaments({ take: 100 }), // Get many to count
          dataService.getUsers({ take: 100 }),       // Get many to count
          dataService.getCategories({ take: 100 }),
          dataService.getRankings({ take: 100 })
        ]);

        // Calculate active tournaments
        const activeT = tournamentsRes.data ? tournamentsRes.data.filter(t => t.status !== 'FINISHED' && t.status !== 'CANCELED').length : 0;

        // Competitors count
        const userCount = usersRes.data ? usersRes.data.length : 0;

        const catCount = categoriesRes ? categoriesRes.length : 0;
        setCategoriesList(categoriesRes || []);
        setRankingsList(rankingsRes?.data || []);

        setStats({
          activeTournaments: activeT,
          competitors: userCount,
          categories: catCount
        });
      } catch (err) {
        console.error("Error loading home stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="h-screen supports-[height:100dvh]:h-[100dvh] overflow-hidden bg-[#050B14] text-gray-200 flex flex-col font-sans selection:bg-cyan-500/30">
      <div className="flex flex-1 gap-4 lg:gap-8 p-4 lg:p-6 relative overflow-hidden">
        {/* ========================================================= */}
        {/* 🧭 SIDEBAR IZQUIERDO PREMIUM */}
        {/* ========================================================= */}
        <aside
          className={` rounded-r-2xl fixed lg:static top-0 left-0 h-screen lg:h-auto w-64 bg-[#101735] rounded-none lg:rounded-2xl shadow-lg transform transition-transform duration-500 z-[1000] ${menuAbierto ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          {/* Header del Sidebar */}
          <div className="px-6 py-5 border-b border-[#1E90FF33] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoimg} alt="logo" className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold text-[#00C2FF]">Robotech</h1>
                <p className="text-xs text-gray-400">Competencia & Torneos</p>
              </div>
            </div>
            {/* Botón cerrar en móvil */}
            <button
              className="lg:hidden text-gray-400 hover:text-[#00C2FF]"
              onClick={() => setMenuAbierto(false)}
            >
              <X size={22} />
            </button>
          </div>
          {/* Opciones del Sidebar */}
          <nav className="px-4 py-6 flex-1 space-y-2 overflow-y-auto">
            <SidebarItem
              icon={<Home size={16} />}
              label="Inicio"
              active={vista === "inicio"}
              onClick={() => {
                setVista("inicio");
                setMenuAbierto(false);
              }}
            />
            <SidebarItem
              icon={<Trophy size={16} />}
              label="Torneos"
              active={vista === "torneos"}
              onClick={() => {
                setVista("torneos");
                setMenuAbierto(false);
              }}
            />
            <SidebarItem
              icon={<BarChart3 size={16} />}
              label="Ranking"
              active={vista === "ranking"}
              onClick={() => {
                setVista("ranking");
                setMenuAbierto(false);
              }}
            />
            <SidebarItem
              icon={<Star size={16} />}
              label="Puntaje"
              active={vista === "puntaje"}
              onClick={() => {
                setVista("puntaje");
                setMenuAbierto(false);
              }}
            />
            <SidebarItem
              icon={<Folder size={16} />}
              label="Categorías"
              active={vista === "categorias"}
              onClick={() => {
                setVista("categorias");
                setMenuAbierto(false);
              }}
            />
            <SidebarItem
              icon={<Users size={16} />}
              label="Clubs"
              active={vista === "clubs"}
              onClick={() => {
                setVista("clubs");
                setMenuAbierto(false);
              }}
            />
            <SidebarItem
              icon={<Newspaper size={16} />}
              label="Noticias"
              active={vista === "noticias"}
              onClick={() => {
                setVista("noticias");
                setMenuAbierto(false);
              }}
            />
            <SidebarItem
              icon={<HelpCircle size={16} />}
              label="Ayuda"
              active={vista === "ayuda"}
              onClick={() => {
                setVista("ayuda");
                setMenuAbierto(false);
              }}
            />

            {/* 🛡️ SECCIÓN ADMIN / DUEÑO / CREAR CLUB / JUEZ */}
            {(userInfo?.role === 'admin' || userInfo?.isClubOwner || userInfo?.role === 'club_owner' || userInfo?.role === 'judge' || (userInfo && userInfo.role !== 'club_owner' && !userInfo.isClubOwner)) && (
              <>
                <div className="px-4 mt-6 mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Administración</p>
                </div>

                {userInfo?.role === 'admin' && (
                  <SidebarItem
                    icon={<Shield size={16} />}
                    label="Panel Admin"
                    active={vista === "admin-panel"}
                    onClick={() => {
                      window.open(getServerUrl("/admin"), "_blank");
                    }}
                  />
                )}



                {/* ⚖️ PANEL DE JUEZ */}
                {userInfo?.role === 'judge' && (
                  <SidebarItem
                    icon={<GiBangingGavel size={16} />}
                    label="Mis Torneos (Juez)"
                    active={vista === "juez-torneos"}
                    onClick={() => {
                      setVista("juez-torneos");
                      setMenuAbierto(false);
                    }}
                  />
                )}

                {(userInfo?.isClubOwner || userInfo?.role === 'club_owner') && (
                  <SidebarItem
                    icon={<Briefcase size={16} />}
                    label="Gestionar Club"
                    active={vista === "gestion-club"}
                    onClick={() => {
                      setVista("gestion-club");
                      setMenuAbierto(false);
                    }}
                  />
                )}

                {/* 🚀 OPCIÓN PARA POSTULAR A DUEÑO (Si NO es dueño ni admin NI JUEZ) */}
                {userInfo && userInfo.role !== 'club_owner' && userInfo.role !== 'admin' && userInfo.role !== 'judge' && !userInfo.isClubOwner && (
                  <SidebarItem
                    icon={<Trophy size={16} />}
                    label="Crear mi Club"
                    active={vista === "crear-club"}
                    onClick={() => {
                      setVista("crear-club");
                      setMenuAbierto(false);
                    }}
                  />
                )}
              </>
            )}

            {!userInfo && (
              <div className="mt-6 border-t border-[#1E90FF33] pt-4">
                <Link
                  to="/"
                  className="
                      w-full flex items-center gap-3 
                      px-4 py-2 
                      rounded-lg text-sm font-medium 
                      text-gray-300
                      transition-all duration-300 ease-out
                      hover:bg-[#1E90FF22] hover:text-white
                    "
                >
                  <CornerUpLeft size={16} />
                  Regresar
                </Link>
              </div>
            )}
          </nav>
        </aside>
        {/* ========================================================= */}
        {/* 🧩 CONTENIDO PRINCIPAL */}
        {/* ========================================================= */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* ========================================================= */}
          {/* 🔝 TOP BAR */}
          {/* ========================================================= */}
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center gap-4">
              {/* Botón hamburguesa */}
              <button
                className="lg:hidden p-2 rounded-md bg-[#101735] border border-[#1E90FF33]"
                onClick={() => setMenuAbierto(true)}
              >
                <Menu className="w-5 h-5 text-[#00C2FF]" />
              </button>
              {/* Barra de búsqueda (Desktop) - Se oculta en móvil */}
              <div
                className="hidden lg:flex items-center gap-3 bg-[#101735] border border-[#1E90FF33] rounded-full px-4 py-2 cursor-pointer hover:bg-[#1E90FF11] transition-all group w-80"
                onClick={() => setPaletteOpen(true)}
              >
                <Search className="w-4 h-4 text-[#00C2FF] group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-500 group-hover:text-gray-300 flex-1">Buscar en Robotech...</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-500 font-mono">Ctrl</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-500 font-mono">K</span>
                </div>
              </div>

              {/* Icono de búsqueda (Móvil) - Se oculta en desktop */}
              <div className="lg:hidden">
                <button
                  className="p-2 rounded-md bg-[#101735] border border-[#1E90FF33]"
                  onClick={() => setPaletteOpen(true)}
                >
                  <svg className="w-5 h-5 text-[#00C2FF]" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-4.35-4.35"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="11"
                      cy="11"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* Renderizado condicional: Perfil vs Login/Register */}
            {userInfo ? (
              <div className="relative group">
                <div className="flex items-center gap-3 bg-[#101735] border border-[#1E90FF33] px-4 py-2 rounded-full cursor-pointer hover:bg-[#1E90FF22] transition-all">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">{userInfo?.nickname || userInfo?.name || "Usuario"}</p>
                    <p className="text-[10px] text-[#00C2FF]">{getRoleLabel()}</p>
                  </div>
                  <img
                    src={userInfo?.profile_picture ? (userInfo.profile_picture.startsWith('http') ? userInfo.profile_picture : getServerUrl(userInfo.profile_picture)) : "https://www.gravatar.com/avatar/0000?d=mp&f=y"}
                    alt="User"
                    className="w-10 h-10 rounded-full border border-[#00C2FF] object-cover"
                  />
                </div>

                <div className="absolute right-0 mt-2 w-48 bg-[#101735] border border-[#1E90FF33] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1100]">
                  <div className="p-2 border-b border-[#1E90FF33] lg:hidden">
                    <p className="text-sm font-bold text-white px-3">{userInfo?.nickname || "Usuario"}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => navigate("/perfilusuario", { state: { fromLogin: true } })}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#1E90FF22] hover:text-[#00C2FF] rounded-lg transition-all"
                    >
                      <User size={16} />
                      Ver Perfil
                    </button>

                    {/* Renderizado Condicional de Mi Club */}
                    {myRealClub && (
                      <button
                        onClick={() => {
                          setSelectedClub(myRealClub);
                          setVista("club-detalle");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#1E90FF22] hover:text-[#00C2FF] rounded-lg transition-all"
                      >
                        <Users size={16} />
                        Ver Mi Club
                      </button>
                    )}

                    {/* Botón Gestionar mi club (Solo dueños) */}
                    {(userInfo?.isClubOwner || userInfo?.role === 'club_owner') && myRealClub && (
                      <button
                        onClick={() => setVista("gestionar-club")}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#00C2FF] hover:bg-[#1E90FF22] rounded-lg transition-all font-bold"
                      >
                        <Briefcase size={16} />
                        Gestionar mi club
                      </button>
                    )}

                    <div className="my-1 border-t border-[#1E90FF33]"></div>
                    <button
                      onClick={() => {
                        authService.logout();
                        setUserInfo(null);
                        navigate("/");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-[#101735] border border-[#1E90FF33] hover:bg-[#1E90FF22] transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#00C2FF] to-[#1E90FF] text-white shadow-md transform hover:scale-105 transition-all"
                >
                  Registrar
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 📜 SCROLLABLE CONTENT AREA */}
          {/* ========================================================= */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {/* ========================================================= */}
            {/* 🏠 CARAS / CONTENIDOS */}
            {/* ========================================================= */}
            {vista === "inicio" && (
              <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
                <section className="relative bg-gradient-to-br from-[#0A0F24] via-[#0B1124] to-[#0D1530] overflow-hidden rounded-3xl border border-[#1E90FF44] shadow-2xl min-h-[85vh]">

                  {/* === ANIMATED BACKGROUND EFFECTS === */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Gradient Orbs */}
                    <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                    {/* Animated Grid */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: `linear-gradient(#00C2FF 1px, transparent 1px), linear-gradient(90deg, #00C2FF 1px, transparent 1px)`,
                      backgroundSize: '50px 50px'
                    }}></div>

                    {/* Floating Particles */}
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 5}s`
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* === MAIN CONTENT GRID === */}
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8 md:p-12 lg:p-16 items-center min-h-[85vh]">

                    {/* LEFT COLUMN - Text Content */}
                    <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">En Vivo</span>
                      </div>

                      {/* Main Title */}
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                        Bienvenido a la
                        <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                          Arena Robotech
                        </span>
                      </h1>

                      {/* Description */}
                      <p className="text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Sumérgete en el mundo de la <span className="text-cyan-400 font-semibold">robótica competitiva</span>.
                        Explora torneos, rankings en tiempo real y las batallas más intensas del país.
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          onClick={() => setVista("torneos")}
                          className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm uppercase tracking-wide overflow-hidden shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <Trophy size={18} />
                            Explorar Torneos
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        <button
                          onClick={() => setVista("ranking")}
                          className="px-8 py-4 rounded-full bg-transparent border-2 border-cyan-500/50 text-cyan-400 font-bold text-sm uppercase tracking-wide hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <BarChart3 size={18} />
                          Ver Rankings
                        </button>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-3 gap-3 pt-8 max-w-lg mx-auto lg:mx-0">
                        {[
                          { label: 'Torneos Activos', value: stats.activeTournaments > 0 ? stats.activeTournaments + "+" : "0", icon: <Trophy size={16} /> },
                          { label: 'Competidores', value: stats.competitors > 0 ? stats.competitors + "+" : "0", icon: <Users size={16} /> },
                          { label: 'Categorías', value: stats.categories > 0 ? stats.categories : "0", icon: <Folder size={16} /> }
                        ].map((stat, i) => (
                          <div key={i} className="group relative p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/5 rounded-2xl transition-all duration-300"></div>
                            <div className="relative">
                              <div className="text-cyan-400 mb-2 opacity-70">{stat.icon}</div>
                              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT COLUMN - Robot 3D */}
                    <div className="relative order-1 lg:order-2 flex items-center justify-center">
                      {/* Decorative Elements around Robot */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Rotating Ring */}
                        <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-500/20 animate-spin-slow"></div>
                        <div className="absolute w-[450px] h-[450px] rounded-full border border-blue-500/10 animate-spin-slower"></div>

                        {/* Glow Effect */}
                        <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                      </div>

                      {/* Robot Container */}
                      <div className="relative z-10 w-full max-w-md lg:max-w-lg xl:max-w-xl h-[400px] sm:h-[450px] lg:h-[500px] xl:h-[550px]">
                        <iframe
                          src="https://my.spline.design/genkubgreetingrobot-fANAgYzDr5WmZvFKHnioFzYZ/"
                          frameBorder="0"
                          className="w-full h-full rounded-3xl"
                          title="Interactive 3D Robot"
                        ></iframe>
                      </div>

                      {/* Floating Info Cards */}
                      <div className="absolute top-10 -left-4 lg:left-0 p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 backdrop-blur-md animate-float">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold text-green-300">Sistema Online</span>
                        </div>
                      </div>

                      <div className="absolute bottom-10 -right-4 lg:right-0 p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 backdrop-blur-md animate-float" style={{ animationDelay: '1s' }}>
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-yellow-400" />
                          <span className="text-xs font-bold text-purple-300">Próximo Torneo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === BOTTOM FEATURES BAR === */}
                  <div className="relative z-10 border-t border-[#1E90FF33] bg-gradient-to-r from-[#0B1124]/80 via-[#101735]/80 to-[#0B1124]/80 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
                      {[
                        {
                          icon: <FiAward className="text-cyan-400" size={24} />,
                          title: "Torneos Nacionales",
                          desc: "Competencias oficiales con premios y reconocimiento",
                        },
                        {
                          icon: <FiCpu className="text-blue-400" size={24} />,
                          title: "Múltiples Categorías",
                          desc: "Sumo, siguelíneas, combate y más disciplinas",
                        },
                        {
                          icon: <FiBarChart2 className="text-indigo-400" size={24} />,
                          title: "Rankings en Vivo",
                          desc: "Estadísticas actualizadas en tiempo real",
                        },
                      ].map((item, i) => (
                        <div key={i} className="group flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
                          <div className="p-3 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-cyan-500/50 transition-all duration-300 group-hover:scale-110">
                            {item.icon}
                          </div>
                          <h3 className="text-white font-bold text-base">{item.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CSS Animations */}
                  <style jsx>{`
                  @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                  }
                  @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                  }
                  .animate-float {
                    animation: float 3s ease-in-out infinite;
                  }
                  .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                  }
                  .animate-spin-slow {
                    animation: spin 20s linear infinite;
                  }
                  .animate-spin-slower {
                    animation: spin 30s linear infinite reverse;
                  }
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
                </section>
              </div>
            )}

            {/* ========================================================= */}
            {/* 🏆 VISTA TORNEOS MEJORADA */}
            {/* ========================================================= */}
            {vista === "torneos" && <TorneosView navigate={navigate} isFromLogin={isFromLogin} searchTerm={terminoBusqueda} />}
            {vista === "ranking" && (
              <RankingView
                onSelectClub={(club) => {
                  setSelectedClub(club);
                  setVista("club-detalle");
                }}
              />
            )}

            {/* VISTA DE JUEZ */}
            {vista === "juez-torneos" && (
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <JudgeTournamentsView userInfo={userInfo} navigate={navigate} />
              </div>
            )}
            {vista === "juez-detalle" && (
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <JudgeTournamentDetailView tournamentId={selectedJudgeTournamentId} requestNavigate={setVista} />
              </div>
            )}

            {vista === "crear-club" && <CrearClubView onClubCreated={() => setVista("clubs")} />}
            {vista === "puntaje" && <PuntajeView navigate={navigate} rankings={rankingsList} />}
            {vista === "categorias" && <CategoriasView categories={categoriesList} />}
            {vista === "clubs" && (
              <ClubsView
                onSelectClub={(club) => {
                  setSelectedClub(club);
                  setVista("club-detalle");
                }}
                isFromLogin={isFromLogin}
                searchTerm={terminoBusqueda}
              />
            )}
            {vista === "club-detalle" && (
              <ClubDetailView
                club={selectedClub}
                onBack={() => setVista("clubs")}
                isFromLogin={isFromLogin}
              />
            )}

            <CommandPalette
              isOpen={paletteOpen}
              onClose={() => setPaletteOpen(false)}
              onNavigate={handleNavigate}
            />
            {vista === "gestionar-club" && (
              <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar p-4 lg:p-8">
                <GestionarMiClub clubId={myRealClub?.id} />
              </div>
            )}

            {vista === "noticias" && (
              <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="w-full max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                  {/* === Encabezado Dinámico === */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6 border-b border-slate-800 pb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Actualizaciones EN VIVO</span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
                        Nuevas <span className="text-blue-500 shadow-blue-500/20">NOTICIAS</span>
                      </h2>
                      <p className="text-slate-400 mt-3 max-w-md text-sm uppercase tracking-[0.15em] leading-relaxed">
                        Ingeniería extrema y <span className="text-white">combate autónomo</span>.
                      </p>
                    </div>


                  </div>

                  {/* === Layout Principal === */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Columna Izquierda: Grid de Noticias (8/12) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">

                      {loadingNews ? (
                        // Skeleton simple loading
                        <div className="md:col-span-2 h-[450px] bg-white/5 animate-pulse rounded-2xl"></div>
                      ) : (
                        <>
                          {/* Noticia Principal (Feature) */}
                          {newsList.length > 0 && (
                            <div className="md:col-span-2 relative group bg-slate-950 border border-slate-800 overflow-hidden aspect-video md:aspect-auto md:h-[450px]">
                              <img
                                src={newsList[0].image || "https://cdn.pixabay.com/photo/2017/10/12/21/53/robot-2847476_960_720.jpg"}
                                className="w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700"
                                alt="Main Story"
                                onError={(e) => { e.target.src = "https://cdn.pixabay.com/photo/2017/10/12/21/53/robot-2847476_960_720.jpg"; }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 md:p-10 flex flex-col justify-end">
                                <div className="flex gap-2 mb-4">
                                  <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-tighter">Última Hora</span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase leading-none max-w-2xl line-clamp-2">
                                  {newsList[0].title}
                                </h3>
                                <p className="text-slate-300 text-sm md:text-base max-w-lg mb-6 line-clamp-2 md:line-clamp-none">
                                  {newsList[0].content}
                                </p>
                                <button className="w-fit px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">
                                  Leer Completo
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Secondary News Cards */}
                          {newsList.length > 1 && newsList.slice(1, 3).map((item, index) => (
                            <div key={item.id || index} className="bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between hover:bg-slate-800/50 transition-all group">
                              <div className="flex justify-between items-start">
                                {/* Dynamic Icon placeholder or randomly picked */}
                                <GiRobotGrab className="text-blue-500 text-4xl group-hover:scale-110 transition-transform" />
                                <span className="text-slate-800 font-black text-5xl">0{index + 2}</span>
                              </div>
                              <div className="mt-8">
                                <h3 className="text-xl font-bold text-white uppercase mb-2 line-clamp-1">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{item.content}</p>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Columna Derecha: Sidebar (4/12) */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-slate-900/50 border border-slate-800 p-6">
                        <h4 className="text-white font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500"></span> Lo Mas Agregado
                        </h4>

                        <div className="space-y-6">
                          {[
                            { id: '01', title: 'Nuevos Motores Brushless', tag: 'Tech' },
                            { id: '02', title: 'Finales Regionales México', tag: 'Eventos' },
                            { id: '03', title: 'IA: ¿El fin del control remoto?', tag: 'Debate' },
                          ].map((item) => (
                            <div key={item.id} className="flex gap-4 group cursor-pointer">
                              <span className="text-slate-700 font-black text-2xl group-hover:text-blue-500 transition-colors">{item.id}</span>
                              <div>
                                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">{item.tag}</span>
                                <h5 className="text-white text-sm font-bold uppercase group-hover:underline transition-all">{item.title}</h5>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Newsletter / CTA */}
                      <div className="bg-blue-600 p-8 flex flex-col items-center text-center">
                        <h4 className="text-white font-black text-xl uppercase leading-tight mb-4">¿Quieres construir tu propio robot?</h4>
                        <p className="text-blue-100 text-xs mb-6 uppercase tracking-wider">Únete a nuestra comunidad de ingenieros.</p>
                        <button className="w-full py-3 bg-black text-white text-[10px] font-black uppercase hover:bg-white hover:text-black transition-colors">
                          Suscribirse al Boletín
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer de Sección */}
                  <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-8 items-center opacity-40 grayscale hover:grayscale-0 transition-all">
                      <span className="text-white font-black tracking-widest text-xs italic">SPONSOR_01</span>
                      <span className="text-white font-black tracking-widest text-xs italic">TECH_CORP</span>
                      <span className="text-white font-black tracking-widest text-xs italic">ROBOTICS_LAB</span>
                    </div>
                    <button className="group flex items-center gap-4 px-10 py-4 bg-white text-black font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">
                      Ver Archivo Histórico <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {vista === "ayuda" && (
              <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
                <AyudaView />
              </div>
            )}

            {/* VISTAS DE ADMINISTRACIÓN */}
            {vista === "gestion-club" && (
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Gestión de Club</h2>
                <p className="text-gray-400">Aquí podrás administrar a los miembros de tu club, tus robots y torneos.</p>
                {/* Aquí iría el componente real de gestión */}
                <button className="mt-6 px-6 py-3 bg-[#00C2FF] text-black font-bold rounded-xl hover:bg-white transition-all">
                  Registrar Nuevo Robot
                </button>
              </div>
            )}
            {/* ========================================================= */}
            {/* ⚙️ FOOTER */}
            {/* ========================================================= */}
            {/* ========================================================= */}
            {/* ⚙️ FOOTER */}
            {/* ========================================================= */}
            <footer className="mt-auto pt-5">
              <div className="bg-[#101735] rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-4 border border-[#1E90FF33]">
                <div className="flex items-center gap-4">
                  <img src={logoimg} alt="logo" className="w-8 h-8" />
                  <div>
                    <p className="text-[#00C2FF] font-semibold">CHALLONGE</p>
                    <p className="text-xs text-gray-500">
                      © 2025 Challonge, LLC
                    </p>
                  </div>
                </div>
                <nav className="flex items-center gap-6 text-sm text-gray-400">
                  <a className="hover:text-[#00C2FF] cursor-pointer">ACERCA DE</a>
                  <a className="hover:text-[#00C2FF] cursor-pointer">REDES</a>
                  <a className="hover:text-[#00C2FF] cursor-pointer">CONTACTAR</a>
                </nav>
              </div>
            </footer>
          </div>
        </main>

        {/* ========================================================= */}
        {/* 🔍 MODAL DE BÚSQUEDA (Móvil) */}
        {/* ========================================================= */}
        {
          busquedaModalAbierta && (
            <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg">
              <div className="bg-[#101735] border border-[#1E90FF33] rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                {/* Barra de búsqueda dentro de la modal */}
                <div className="p-4 flex items-center gap-3 border-b border-[#1E90FF33]">
                  <svg className="w-5 h-5 text-[#00C2FF] flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-4.35-4.35"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="11"
                      cy="11"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)} // Actualizar estado al escribir
                    className="bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500 flex-grow"
                    placeholder="Buscar torneo o categoría..."
                    autoFocus // Enfocar automáticamente el input
                  />
                  <button
                    className="p-1 rounded-full bg-[#1E90FF33] text-[#00C2FF]"
                    onClick={() => {
                      setBusquedaModalAbierta(false);
                      setTerminoBusqueda(""); // Opcional: limpiar al cerrar
                    }} // Cerrar la modal
                  >
                    <X size={18} />
                  </button>
                </div>
                {/* Contenido de resultados (aquí irá tu lógica de búsqueda) */}
                <div className="p-4 flex-grow overflow-y-auto max-h-64"> {/* Ajusta max-h según necesites */}
                  {terminoBusqueda ? (
                    <div>
                      <h3 className="text-[#00C2FF] font-semibold mb-2">Resultados para: "{terminoBusqueda}"</h3>
                      {/* Aquí debes mapear tus datos de torneos/categorías filtrados */}
                      {/* Ejemplo de resultado: */}
                      <div className="p-2 hover:bg-[#1E90FF33] rounded cursor-pointer">
                        <p className="text-white">Torneo Ejemplo 1</p>
                        <p className="text-xs text-gray-400">Categoría: Sumo</p>
                      </div>
                      <div className="p-2 hover:bg-[#1E90FF33] rounded cursor-pointer">
                        <p className="text-white">Categoría: Combate</p>
                      </div>
                      {/* Fin del ejemplo */}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">Escribe para buscar...</p>
                  )}
                </div>
              </div>
            </div>
          )
        }
      </div >

    </div >
  );
}