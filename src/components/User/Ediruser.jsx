import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiSave,
  FiUser,
  FiMail,
  FiLock,
  FiPlus,
  FiHash,
  FiShield,
  FiCamera,
  FiTrash2,
  FiRefreshCw,
  FiMoreHorizontal,
  FiActivity
} from "react-icons/fi";
import { FaRobot, FaUsers } from "react-icons/fa";
import { authService } from "../../services/authService";

// Assets
import userlog from "../../assets/images/userlogo.png";
import logo from "../../assets/images/logo.png";

const Ediruser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromLogin = location.state?.fromLogin;
  const currentUser = authService.getCurrentUser();

  // Redirect if not logged in
  useEffect(() => {
    if (!authService.getToken()) {
      navigate("/login");
    }
  }, []);

  // States
  const [avatar, setAvatar] = useState(userlog);
  const [formData, setFormData] = useState({
    user: currentUser?.username || "Usuario",
    nickname: currentUser?.nickname || "Nick",
    email: currentUser?.email || "correo@ejemplo.com",
    age: "21",
    club: "Club",
    profile_picture: currentUser?.profile_picture || ""
  });

  const [robots, setRobots] = useState([
    { id: 1, name: "LuisBot Alpha", type: "Combate", category: "Pesado", status: "Activo" },
    { id: 2, name: "Strike-Z", type: "Velocidad", category: "MiniSumo", status: "Activo" }
  ]);

  const [showModalRobot, setShowModalRobot] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [newRobot, setNewRobot] = useState({ name: "", type: "", category: "" });

  // Load initial data from currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData({
        user: currentUser.username || currentUser.nickname,
        nickname: currentUser.nickname,
        email: currentUser.email || "correo@ejemplo.com",
        age: "21",
        club: "Club",
        profile_picture: currentUser.profile_picture || ""
      });
      // If backend provides a full URL for profile_picture, use it, otherwise fallback
      if (currentUser.profile_picture) {
        setAvatar(currentUser.profile_picture.startsWith('http') ? currentUser.profile_picture : `http://127.0.0.1:3000${currentUser.profile_picture}`);
      } else {
        setAvatar("https://www.gravatar.com/avatar/0000?d=mp&f=y");
      }
    }
  }, []);

  const handleBack = () => navigate('/perfilusuario', { state: { fromLogin: isFromLogin } });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'profile_picture') {
      setAvatar(value || "https://www.gravatar.com/avatar/0000?d=mp&f=y");
    }
  };

  const handleAddRobot = (e) => {
    e.preventDefault();
    // ... existing logic ...
    setRobots([...robots, { ...newRobot, id: Date.now(), status: "Activo" }]);
    setShowModalRobot(false);
    setNewRobot({ name: "", type: "", category: "" });
  };

  const handleDeleteRobot = (id) => {
    setRobots(robots.filter(r => r.id !== id));
    setActiveMenu(null);
  };

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      // 1. Update Profile in Backend using the URL from formData
      const payload = {
        nickname: formData.nickname,
        profile_picture: formData.profile_picture
      };

      const res = await authService.updateUserProfile(currentUser.id, payload);

      // 2. Update Local Storage Session with real data from backend
      const updatedUser = { ...currentUser, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 3. Feedback
      alert("¡Perfil actualizado con éxito!");
      handleBack();

    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil: " + error.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0A0F24] text-white font-[Segoe_UI] overflow-x-hidden p-6 md:p-12 relative border-t-4 border-[#00C2FF]">
      <AnimatePresence>
        {showModalRobot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0A0F24]/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#121836] border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowModalRobot(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                <FiRefreshCw className="rotate-45" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#00C2FF]/10 flex items-center justify-center border border-[#00C2FF]/20">
                  <FaRobot className="text-[#00C2FF] text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Nuevo Robot</h3>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Registrar en el taller</p>
                </div>
              </div>

              <form onSubmit={handleAddRobot} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Nombre del Robot</label>
                  <input
                    required
                    type="text"
                    value={newRobot.name}
                    onChange={(e) => setNewRobot({ ...newRobot, name: e.target.value })}
                    className="w-full bg-[#0A0F24] border border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#00C2FF] focus:outline-none transition-all placeholder:text-gray-700"
                    placeholder="Ej: Iron Giant"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Tipo</label>
                    <select
                      required
                      value={newRobot.type}
                      onChange={(e) => setNewRobot({ ...newRobot, type: e.target.value })}
                      className="w-full bg-[#0A0F24] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold focus:border-[#00C2FF] focus:outline-none transition-all appearance-none"
                    >
                      <option value="">Tipo...</option>
                      <option value="Combate">Combate</option>
                      <option value="Velocidad">Velocidad</option>
                      <option value="Estrategia">Estrategia</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Categoría</label>
                    <select
                      required
                      value={newRobot.category}
                      onChange={(e) => setNewRobot({ ...newRobot, category: e.target.value })}
                      className="w-full bg-[#0A0F24] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold focus:border-[#00C2FF] focus:outline-none transition-all appearance-none"
                    >
                      <option value="">Categoría...</option>
                      <option value="Pesado">Pesado</option>
                      <option value="MiniSumo">MiniSumo</option>
                      <option value="RC">RC</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#00C2FF] text-[#0A0F24] rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-[#1E90FF] transition-all mt-4"
                >
                  Finalizar Registro
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <button
            onClick={handleBack}
            className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#00C2FF]/30 transition-all group"
          >
            <FiChevronLeft className="text-[#00C2FF] group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Descartar</span>
          </button>

          <div className="flex items-center gap-3">
            <img src={logo} alt="Robotech" className="w-8 h-8" />
            <h1 className="text-xl font-black uppercase italic tracking-tighter">Panel de Gestión</h1>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col items-center gap-6"
            >
              <div className="relative group">
                <img
                  src={avatar}
                  alt="Perfil"
                  className="w-48 h-48 rounded-full border-4 border-white/10 p-1 group-hover:border-[#00C2FF]/50 transition-all object-cover"
                />
                <div className="absolute bottom-2 right-2 w-12 h-12 bg-gray-500/20 text-white rounded-full flex items-center justify-center border-4 border-[#0A0F24] shadow-xl">
                  <FiUser className="text-xl" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-1">{formData.user}</h2>
                <p className="text-[10px] font-black text-[#00C2FF] uppercase tracking-widest italic">Competidor Verificado</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                Cerrar Sesión
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-[3rem] p-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#00C2FF]/10 flex items-center justify-center border border-[#00C2FF]/20">
                  <FiUser className="text-[#00C2FF]" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Datos de Cuenta</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField icon={<FiUser />} label="URL de Avatar" value={formData.profile_picture} onChange={(val) => handleInputChange('profile_picture', val)} />
                <InputField icon={<FiHash />} label="Nick" value={formData.nickname} onChange={(val) => handleInputChange('nickname', val)} />
                <InputField icon={<FiUser />} label="Usuario" value={formData.user} onChange={(val) => handleInputChange('user', val)} />
                <InputField icon={<FiMail />} label="Email" value={formData.email} type="email" onChange={(val) => handleInputChange('email', val)} />
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Taller de Robots</label>
                  <span className="text-[10px] font-black text-[#00C2FF] uppercase tracking-widest bg-[#00C2FF]/10 px-3 py-1 rounded-full">
                    {robots.length} Slot Ocupados
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {robots.map((robot) => (
                    <div key={robot.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 relative group/robot">
                      <div className="w-10 h-10 rounded-xl bg-[#0A0F24] flex items-center justify-center border border-white/5">
                        <FaRobot className="text-[#00C2FF]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-tighter leading-none mb-1">{robot.name}</span>
                        <span className="text-[8px] font-bold text-[#00C2FF] uppercase tracking-widest">{robot.category}</span>
                      </div>

                      <button
                        onClick={() => setActiveMenu(activeMenu === robot.id ? null : robot.id)}
                        className="ml-auto w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <FiMoreHorizontal className="text-gray-500" />
                      </button>

                      <AnimatePresence>
                        {activeMenu === robot.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute right-4 top-14 z-50 bg-[#121836] border border-white/10 rounded-xl p-1 shadow-2xl w-32"
                          >
                            <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                              <FiActivity className="text-[#00C2FF] text-[10px]" /> Detalles
                            </button>
                            <button
                              onClick={() => handleDeleteRobot(robot.id)}
                              className="w-full text-left px-3 py-2 hover:bg-red-500/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2"
                            >
                              <FiTrash2 className="text-[10px]" /> Eliminar
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowModalRobot(true)}
                    className="p-4 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 hover:border-[#00C2FF]/30 transition-all group"
                  >
                    <FiPlus className="text-gray-500 group-hover:text-[#00C2FF]" />
                    <span className="text-[9px] font-black text-gray-500 group-hover:text-gray-300 uppercase tracking-widest">Nuevo Slot</span>
                  </button>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex justify-end gap-3">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-white/5 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#00C2FF] text-[#0A0F24] rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#1E90FF] active:scale-95 transition-all flex items-center gap-2"
                >
                  <FiSave /> Guardar
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

const InputField = ({ icon, label, value, type = "text", onChange }) => (
  <div className="space-y-2">
    <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C2FF] transition-colors">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full bg-[#0A0F24] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-[#00C2FF] transition-all"
      />
    </div>
  </div>
);

export default Ediruser;
