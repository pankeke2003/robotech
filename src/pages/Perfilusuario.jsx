import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiEdit3,
  FiMail,
  FiUser,
  FiAward,
  FiActivity,
  FiGithub,
  FiTwitter,
  FiInstagram,
  FiMoreHorizontal
} from "react-icons/fi";
import { FaTrophy, FaRobot, FaUsers, FaMedal } from "react-icons/fa";
import { GiPodiumWinner, GiMechanicalArm } from "react-icons/gi";

// Assets
import userlog from "../assets/images/userlogo.png";
import logo from "../assets/images/logo.png";
import { Skeleton } from "../components/ui/Skeleton";

import { authService } from "../services/authService";

const Perfil = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromLogin = location.state?.fromLogin;

  const [userIdParam, setUserIdParam] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setUserIdParam(params.get('userId'));
    console.log("Perfil component loaded. UserId:", params.get('userId'));
  }, [location.search]);

  const [displayUser, setDisplayUser] = useState(null);
  const [realClubName, setRealClubName] = useState("Cargando...");
  const [realClubData, setRealClubData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Determine which user to show (Logged in vs Public)
  // 1. Determine which user to show (Logged in vs Public)
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      // A: Chequear si se pasó data completa por navegación (ej: desde Ranking)
      if (location.state?.userData) {
        const passedUser = location.state.userData;
        console.log("Using passed user data:", passedUser);

        // Mapear la data del ranking al formato del perfil
        setDisplayUser({
          id: passedUser.id,
          name: passedUser.name,
          lastName: "", // No viene en ranking
          nickname: passedUser.name, // Usamos name como nick si no hay
          role: "Competidor", // Asumido
          email: passedUser.country, // Hack visual: poner pais en lugar de email si es publico
          profile_picture: null,
          // Extra stats que guardamos en el estado pero q el componente usa
          points: passedUser.score,
          winRate: "65%", // Placeholder o calculado
          club: "Sin Club", // Se intentará fetchear abajo
          robotName: passedUser.robotName,
          robotImg: passedUser.robotImg
        });
        setLoading(false);
        return;
      }

      // B: Si hay userIdParam pero no state (ej: link directo/compartido)
      if (userIdParam) {
        try {
          console.log("Fetching user by ID", userIdParam);
          // TODO: Replace with real API call: const res = await fetch(`/api/users/${userIdParam}`);
          // Mock simulado
          const mockRes = {
            name: "Competidor",
            lastName: `#${userIdParam}`,
            nickname: "Player_" + userIdParam,
            role: "competitor",
            profile_picture: null
          };
          setDisplayUser(mockRes);
        } catch (e) {
          console.error(e);
        }
      } else {
        // C: Perfil Privado (Usuario logueado)
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          console.warn("No active session found, redirecting to login.");
          navigate('/login');
          return;
        }
        setDisplayUser(currentUser);
      }
      setLoading(false);
    };
    fetchUser();
  }, [userIdParam, location.state]);

  // 2. Fetch Real Club Data for the displayed user
  useEffect(() => {
    const fetchClub = async () => {
      if (!displayUser || !displayUser.id) return;

      try {
        let url;
        // Si el usuario es competidor y tiene un club_id asociado
        if (displayUser.role === 'competitor' && displayUser.competitor?.club_id) {
          url = `http://localhost:3000/api/clubs/${displayUser.competitor.club_id}`;
        } else {
          // Por defecto buscar si es dueño de algún club
          url = `http://localhost:3000/api/clubs?owner_id=${displayUser.id}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Si usamos la ruta /api/clubs/${id}, nos devuelve el objeto directamente
          // Si usamos /api/clubs?owner_id=..., nos devuelve { data: [...] }
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            const club = data.data[0];
            setRealClubData(club);
            setRealClubName(club.nombre || club.name);
            return;
          } else if (data.id) {
            // Caso de objeto directo (/api/clubs/${id})
            setRealClubData(data);
            setRealClubName(data.nombre || data.name);
            return;
          }
        }
        setRealClubName("Sin Club");
        setRealClubData(null);
      } catch (error) {
        console.error("Error fetching club", error);
        setRealClubName("Error al cargar");
      }
    };

    if (displayUser) {
      fetchClub();
    }
  }, [displayUser]);

  const [robots, setRobots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddRobotModal, setShowAddRobotModal] = useState(false);
  const [newRobotData, setNewRobotData] = useState({ name: '', category_id: '', control_type: 'autonomous' });
  const [creatingRobot, setCreatingRobot] = useState(false);

  useEffect(() => {
    const fetchRobots = async () => {
      if (!displayUser?.id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:3000/api/robots?user_id=${displayUser.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.data) setRobots(data.data);
      } catch (error) {
        console.error("Error fetching robots:", error);
      }
    };
    fetchRobots();
  }, [displayUser]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('http://127.0.0.1:3000/api/categories', {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log({ data });
        if (data.data) setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateRobot = async (e) => {
    e.preventDefault();
    if (!newRobotData.name || !newRobotData.category_id) return;

    setCreatingRobot(true);
    try {
      const token = authService.getToken() || localStorage.getItem("token");
      const res = await fetch('http://127.0.0.1:3000/api/robots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newRobotData.name,
          category_id: Number(newRobotData.category_id),
          control_type: newRobotData.control_type,
          // We send competitor_id if it's an admin creating for someone else,
          // or just to be explicit if it's the user themselves.
          competitor_id: displayUser.id
        })
      });

      const data = await res.json();
      console.log({ data });

      if (res.ok) {
        // Find the category object to update the local state correctly
        const categoryObj = categories.find(c => c.id === Number(newRobotData.category_id));
        setRobots([...robots, { ...data.data, categories: categoryObj }]);
        setShowAddRobotModal(false);
        setNewRobotData({ name: '', category_id: '', control_type: 'autonomous' });
        alert("Robot creado exitosamente!");
      } else {
        alert(data.message || data.error || "Error al crear robot");
      }
    } catch (error) {
      console.error("Error creating robot:", error);
      alert("Error de conexión al intentar crear el robot");
    } finally {
      setCreatingRobot(false);
    }
  };

  const userData = {
    username: displayUser ? `${displayUser.name || ''} ${displayUser.lastName || ''}`.trim() : "Usuario Desconocido",
    nickname: displayUser?.nickname || "Invitado",
    email: displayUser?.email || "Oculto",
    club: realClubData ? (
      <div className="flex flex-col gap-1">
        <button
          onClick={() => navigate('/menu?vista=club-detalle', { state: { selectedClub: realClubData, fromLogin: isFromLogin } })}
          className="flex items-center gap-2 hover:text-[#00C2FF] transition-colors text-left"
        >
          <span className="truncate max-w-[150px]">{realClubName}</span>
          {displayUser.role === 'club_owner' ? (
            <span className="px-1.5 py-0.5 bg-yellow-500 text-black text-[8px] font-black rounded uppercase tracking-wider">
              Dueño
            </span>
          ) : displayUser.competitor?.is_approved ? (
            <span className="px-1.5 py-0.5 bg-green-500 text-white text-[8px] font-black rounded uppercase tracking-wider">
              Miembro
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[8px] font-black rounded uppercase tracking-wider animate-pulse">
              Pendiente
            </span>
          )}
        </button>
      </div>
    ) : realClubName,
    points: displayUser?.points || 0,
    winRate: displayUser?.winRate || "0%",
    status: displayUser?.role ? displayUser.role.toUpperCase() : "INVITADO",
    // Si viene de ranking, mostrar el robot del ranking
    robots: robots,
    profile_picture: displayUser?.profile_picture
      ? (displayUser.profile_picture.startsWith('http') ? displayUser.profile_picture : `http://127.0.0.1:3000${displayUser.profile_picture}`)
      : null
  };

  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="min-h-screen bg-[#0A0F24] text-white font-[Segoe_UI] overflow-x-hidden selection:bg-[#1E90FF] selection:text-white">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1E90FF]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="relative z-10">
        {/* HEADER / NAVIGATION */}
        <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0F24]/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/menu', { state: { fromLogin: isFromLogin } })}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
          >
            <FiChevronLeft className="text-[#00C2FF] group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Regresar</span>
          </button>

          <div className="flex items-center gap-2">
            <img src={logo} alt="Robotech" className="w-8 h-8" />
            <span className="text-lg font-black uppercase italic tracking-tighter">Robotech</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-[#00C2FF]/30 flex items-center justify-center bg-[#0A0F24]">
              <FiActivity className="text-[#00C2FF] text-xs" />
            </div>
          </div>
        </header>

        {/* MAIN PROFILE CARD */}
        <main className="max-w-7xl mx-auto pt-32 px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN: HERO & STATS */}
            <div className="lg:col-span-4 space-y-8">
              {loading ? (
                <>
                  {/* Hero Skeleton */}
                  <Skeleton className="h-[400px] w-full rounded-[2.5rem] bg-white/5 border border-white/10" />
                  {/* Stats Grid Skeleton */}
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-3xl bg-white/5 border border-white/10" />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* PROFILE HERO */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E90FF]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="relative flex flex-col items-center text-center space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF] to-purple-600 rounded-full blur-[20px] opacity-40 animate-pulse"></div>
                        <img
                          src={userData.profile_picture || "https://www.gravatar.com/avatar/0000?d=mp&f=y"}
                          alt="Avatar"
                          className="w-40 h-40 rounded-full border-4 border-white/10 p-1 bg-[#0A0F24] relative object-cover"
                        />
                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#00C2FF] rounded-full flex items-center justify-center border-4 border-[#0A0F24] shadow-xl">
                          <FiAward className="text-[#0A0F24] text-lg" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none break-all">{userData.username}</h1>
                        <p className="text-[#00C2FF] text-xs font-black uppercase tracking-[0.3em]">{userData.nickname}</p>
                        <div className="mt-3 px-3 py-1 bg-white/5 border border-white/5 rounded-full inline-block">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{userData.status}</span>
                        </div>
                      </div>

                      {/* Solo mostrar botón de modificar si NO es una visita a otro perfil (userIdParam es null) */}
                      {!userIdParam && (
                        <button
                          onClick={() => navigate('/editarperfil', { state: { fromLogin: isFromLogin } })}
                          className="w-full py-4 bg-gradient-to-r from-[#1E90FF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-[#0A0F24] rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 mt-4"
                        >
                          <FiEdit3 className="text-base" />
                          Modificar Perfil
                        </button>
                      )}
                    </div>
                  </motion.div>

                  {/* STATS TILES */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard icon={<FaTrophy className="text-yellow-500" />} label="Puntos" value={userData.points} />
                    <StatCard icon={<FiActivity className="text-green-500" />} label="Win Rate" value={userData.winRate} />
                    <StatCard icon={<FaUsers className="text-purple-500" />} label="Club" value={userData.club} />
                    <StatCard icon={<FaMedal className="text-[#00C2FF]" />} label="Rango" value="#12" />
                  </div>
                </>
              )}
            </div>

            {/* RIGHT COLUMN: GALLERY & DETAILS */}
            <div className="lg:col-span-8 space-y-10">
              {loading ? (
                <>
                  {/* About Section Skeleton */}
                  <Skeleton className="h-64 w-full rounded-[2.5rem] bg-white/5 border border-white/10" />

                  {/* Robots Gallery Header Skeleton */}
                  <div className="flex justify-between items-center px-4">
                    <Skeleton className="h-12 w-48 rounded-xl bg-white/5" />
                    <Skeleton className="h-6 w-20 rounded-full bg-white/5" />
                  </div>

                  {/* Robots Grid Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-72 w-full rounded-[2rem] bg-white/5 border border-white/10" />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* ABOUT SECTION */}
                  <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-[#00C2FF]/10 flex items-center justify-center border border-[#00C2FF]/20">
                        <FiUser className="text-[#00C2FF] text-xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Información General</h2>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Detalles de la cuenta</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InfoItem icon={<FiMail />} label="Correo Electrónico" value={userData.email} />
                      <InfoItem icon={<FiUser />} label="Apodo Competitivo" value={userData.nickname} />
                      <InfoItem icon={<FaUsers />} label="Afiliación de Club" value={userData.club} />
                    </div>
                  </section>

                  {/* ROBOT GALLERY */}
                  <section>
                    <div className="flex items-center justify-between mb-8 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                          <FaRobot className="text-purple-500 text-xl" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Mi Hangar (Robots)</h2>
                          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Arsenal de combate activo</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAddRobotModal(true)}
                          className="bg-[#1E90FF] hover:bg-[#00C2FF] text-[#0A0F24] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                          <FiEdit3 /> Agregar Robot
                        </button>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{userData.robots.length} ROBOTS</span>
                      </div>
                    </div>

                    {/* MODAL AGREGAR ROBOT */}
                    <AnimatePresence>
                      {showAddRobotModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#131B36] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                          >
                            <h3 className="text-xl font-black text-white uppercase italic mb-6">Nuevo Robot</h3>
                            <form onSubmit={handleCreateRobot} className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nombre del Robot</label>
                                <input
                                  type="text"
                                  value={newRobotData.name}
                                  onChange={e => setNewRobotData({ ...newRobotData, name: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#1E90FF]"
                                  placeholder="Ej: Destructor X"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Categoría</label>
                                <select
                                  value={newRobotData.category_id}
                                  onChange={e => setNewRobotData({ ...newRobotData, category_id: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#1E90FF] appearance-none"
                                  required
                                >
                                  <option value="" className="bg-[#0A0F24]">Seleccionar Categoría</option>
                                  {categories.length === 0 && <option value="" disabled className="text-gray-500">Cargando o sin categorías...</option>}
                                  {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-[#0A0F24]">{cat.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Tipo de Control</label>
                                <select
                                  value={newRobotData.control_type}
                                  onChange={e => setNewRobotData({ ...newRobotData, control_type: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#1E90FF] appearance-none"
                                  required
                                >
                                  <option value="autonomous" className="bg-[#0A0F24]">Autónomo</option>
                                  <option value="remote" className="bg-[#0A0F24]">Remoto</option>
                                  <option value="semi_autonomous" className="bg-[#0A0F24]">Semi-Autónomo</option>
                                </select>
                              </div>
                              <div className="flex gap-3 mt-6">
                                <button
                                  type="button"
                                  onClick={() => setShowAddRobotModal(false)}
                                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="submit"
                                  disabled={creatingRobot}
                                  className="flex-1 py-3 bg-[#1E90FF] hover:bg-[#00C2FF] text-[#0A0F24] rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg"
                                >
                                  {creatingRobot ? 'Creando...' : 'Guardar Robot'}
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {userData.robots.map((robot, index) => (
                        <motion.div
                          key={robot.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[2rem] p-6 hover:border-[#1E90FF]/40 transition-all group relative"
                        >
                          <div className="absolute top-4 right-4 text-white/5 group-hover:text-[#1E90FF]/10 transition-colors">
                            <GiMechanicalArm className="text-6xl" />
                          </div>

                          <div className="w-14 h-14 rounded-2xl bg-[#0A0F24] border border-white/10 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(30,144,255,0.2)] transition-all">
                            <span className="text-xl font-black italic text-[#00C2FF]">{robot.name.charAt(0)}</span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none mb-1">{robot.name}</h3>
                              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">
                                {robot.categories?.name || robot.type || "General"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative">
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Puntaje</span>
                                <span className="text-lg font-black text-[#1E90FF] italic">{robot.points}</span>
                              </div>
                              <button
                                onClick={() => setActiveMenu(activeMenu === robot.id ? null : robot.id)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer active:scale-95 transition-all"
                              >
                                <FiMoreHorizontal className="text-xs text-gray-400" />
                              </button>

                              <AnimatePresence>
                                {activeMenu === robot.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute right-0 bottom-10 z-50 bg-[#121836] border border-white/10 rounded-xl p-2 shadow-2xl w-32"
                                  >
                                    <div className="space-y-1">
                                      <div className="px-3 py-2 text-[8px] font-black text-[#00C2FF] uppercase tracking-widest border-b border-white/5 mb-1">Status</div>
                                      <div className="px-3 py-1 flex items-center gap-2 text-[9px] font-bold text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        OPERATIVO
                                      </div>
                                      <button
                                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-[#1E90FF]"
                                        onClick={() => {
                                          alert(`Visualizando telemetría de ${robot.name}...`);
                                          setActiveMenu(null);
                                        }}
                                      >
                                        <FiActivity className="text-xs" /> Telemetría
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </main>
      </div >
    </div >
  );
};

// UI COMPONENTS
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors">
    <div className="text-xl mb-3">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">{value}</span>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
      <span className="text-[#00C2FF]">{icon}</span>
      {label}
    </div>
    <div className="bg-[#0A0F24] border border-white/5 px-4 py-3 rounded-2xl text-sm font-bold text-gray-200">
      {value}
    </div>
  </div>
);

const SocialIcon = ({ icon }) => (
  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 hover:text-[#00C2FF] hover:border-[#00C2FF]/30 transition-all cursor-pointer">
    {icon}
  </div>
);

export default Perfil;