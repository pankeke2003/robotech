import logoimg from "../../assets/images/logo.png";

function Footer() {
  return (
    <footer className="bg-[#121225] text-white py-12 border-t border-white/5 w-full mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <img src={logoimg} alt="Logo Robotech" className="w-12 h-12" />
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
  );
}

export default Footer;