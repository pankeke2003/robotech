import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoimg from "../../assets/images/logo.png";
import { FiLogIn, FiUserPlus, FiArrowRight } from "react-icons/fi";
import TextType from "../ui/TextType";
import LightRays from '../ui/LightRays';
// import LogoLoop from '../components/ui/LogoLoop'; // No se está usando en el return
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

// 🔽 Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

// 🔽 Hook personalizado para detectar tamaño de pantalla
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile;
}

function SectionCara1() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleGetStarted = () => {
    navigate("/register");
    setMenuOpen(false);
  };

  // 🔽 Datos de los pasos
  const steps = [
    {
      number: 1,
      title: "Crea tu cuenta",
      description: "Regístrate para acceder a tu panel y comenzar tu camino competitivo.",
    },
    {
      number: 2,
      title: "Únete a un club",
      description: "Explora clubes y solicita unirte al que más te represente.",
    },
    {
      number: 3,
      title: "Registra tu Robot",
      description: "Añade tu robot, categoría y ajustes para torneos.",
    },
    {
      number: 4,
      title: "Aprende y Mejora",
      description: "Accede a tutoriales y workshops exclusivos para miembros.",
    },
    {
      number: 5,
      title: "Sube de Rango",
      description: "Gana puntos en cada victoria y llega a la cima del ranking.",
    },
    {
      number: 6,
      title: "¡A competir!",
      description: "Participa en torneos y escala en el ranking global.",
    },
  ];

  // 🔽 Componente reutilizable de tarjeta (StepCard - Modificado para el nuevo diseño)
  const StepCard = ({ step, content }) => {
    const cardContent = step ? (
      <>
        <div className="relative w-12 h-12 flex items-center justify-center relative w-16 h-16 mb-4 flex items-center justify-center 
          rounded-full bg-white/10 group-hover:bg-white/20 transition">
          <span className="text-3xl font-bold text-white">{step.number}</span>
        </div>

        <h3 className="text-xl font-semibold mb-2 mt-4 text-white">
          {step.title}
        </h3>
        <p className="text-sm text-white/60">
          {step.description}
        </p>
      </>
    ) : (
      // Si solo se pasa 'content' (e.g., para pruebas simples)
      <span className="text-xl font-bold">{content}</span>
    );

    return (
      <div className="group flex flex-col items-center p-6 sm:p-8 rounded-3xl h-full
        backdrop-blur-3xl bg-black/50 border
        transform transition-all duration-300 origin-top
        border-white/20 
        transition duration-300 hover:scale-[1.01]
        hover:border-white/40 hover:backdrop-blur-lg">
        {cardContent}
      </div>
    );
  };

  // 🔽 Componente para el Botón (BOTON) - Usando los estilos de tu StepCard
  const ButtonCard = () => (
    <div className="flex items-center justify-center h-full w-full 
      rounded-3xl bg-blue-600 border border-blue-400 text-white text-xl font-bold 
      transition duration-300 hover:bg-blue-700 hover:scale-[1.01] cursor-pointer shadow-lg">
      BOTON
    </div>
  );


  // ... (mismo código de arriba: imports, hooks y StepCard se mantienen igual)

  return (
    <>
      <section
        id="inicio"
        className="relative overflow-hidden flex flex-col justify-center items-center text-white font-[Martian_Mono]"
      >
        {/* FONDO Y EFECTOS */}
        <div className="absolute inset-0 -z-10">
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={7.5}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(ellipse 100% 80% at 50% -10%, rgba(30, 144, 255, 0.2) 0%, transparent 70%)`,
            }}
          ></div>
        </div>

        {/* HEADER FIJO */}
        <header className="fixed top-5 left-0 w-full z-[2000] py-3 sm:py-4">
          <div className="w-full max-w-[1300px] px-5 mx-auto">
            <div className="pill-flash-effect rounded-full relative overflow-hidden flex justify-between items-center px-6 py-3 backdrop-blur-3xl bg-black/50 border border-white/20 shadow-xl">
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-3 text-black cursor-pointer hover:opacity-90 transition-all px-3 py-2 relative z-10"
              >
                <img src={logoimg} alt="Logo Robotech" className="h-[45px] w-auto" />
                <h3 className="text-white text-[1.7rem] font-bold tracking-wide">
                  Robotech
                </h3>
              </div>

              <div
                className="flex flex-col justify-between w-7 h-5 cursor-pointer lg:hidden z-[2002] relative"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className={`bg-white h-[3px] rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`}></span>
                <span className={`bg-white h-[3px] rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
                <span className={`bg-white h-[3px] rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}></span>
              </div>

              <nav className="hidden lg:flex relative z-10 items-center flex-1 justify-center">
                <ul className="flex items-center gap-12 text-black">
                  {['inicio', 'ranking', 'clubs', 'noticias'].map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => navigate(`/menu?vista=${item}`)}
                        className="text-white hover:text-blue-500 transition-colors duration-200 font-medium px-3 py-2 rounded-full capitalize bg-transparent border-none cursor-pointer"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <button
                onClick={handleGetStarted}
                className="hidden lg:block px-6 py-3 text-base rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 min-w-[150px] text-center"
              >
                Inicia Ahora
              </button>
            </div>

            {menuOpen && (
              <nav className="lg:hidden absolute right-4 top-[calc(100%+8px)] w-[92%] z-[99999] rounded-2xl overflow-hidden backdrop-blur-3xl bg-black/50 border border-white/20 transform transition-all duration-300 origin-top opacity-100 scale-100 translate-y-0">
                <ul className="flex flex-col items-center gap-4 py-6 w-full">
                  {['inicio', 'ranking', 'clubs', 'noticias'].map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          navigate(`/menu?vista=${item}`);
                          setMenuOpen(false);
                        }}
                        className="text-white text-xl hover:text-blue-500 block w-full text-center py-2 capitalize bg-transparent border-none cursor-pointer"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                  <div className="w-full px-4 pt-4">
                    <button
                      onClick={handleGetStarted}
                      className="w-full px-4 py-3 text-base rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300"
                    >
                      <FiArrowRight className="inline mr-2" /> Get started
                    </button>
                  </div>
                </ul>
              </nav>
            )}
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <div className="pt-[150px] sm:pt-[180px] w-full max-w-[1670px] px-[clamp(16px,4vw,60px)] z-20">
          <div className="max-w-[800px] mx-auto text-center">
            {/* NEW FEATURE BANNER */}
            <div
              onClick={() => navigate("/menu?vista=noticias")}
              className="animate-fade-up animate-duration-[659ms] animate-delay-200 animate-ease-in inline-flex items-center rounded-full text-xs sm:text-sm px-4 py-1 mb-6 bg-white/5 border border-white/20 backdrop-blur-sm font-medium cursor-pointer transition-all hover:bg-white/10"
            >
              <span className="text-xs rounded-full bg-blue-600 px-2 py-0.5 mr-2 font-bold uppercase tracking-wider text-white">
                Nuevas Noticas
              </span>
              Ponte al dia con las ultimas noticias de los torneos
              <FiArrowRight className="ml-2 text-blue-400" />
            </div>

            {/* TÍTULO PRINCIPAL */}
            <div className="min-h-[120px] sm:min-h-[150px] md:min-h-[240px] flex items-center justify-center overflow-hidden animate-fade-up animate-duration-[659ms] animate-delay-300 animate-ease-in">
              <TextType
                text={[
                  "GESTIÓN DE TORNEOS DE ROBOTS",
                  "PARTICIPA, COMPITE Y GANA",
                  "¡SE EL PRIMERO EN LA TABLA DE RANKINGS!",
                ]}
                typingSpeed={115}
                pauseDuration={1500}
                showCursor={true}
                className="text-3xl sm:text-4xl md:text-7xl font-extrabold tracking-tight mt-2 whitespace-nowrap"
                cursorCharacter="|"
              />
            </div>

            {/* SUBTÍTULO */}
            <p className="text-sm sm:text-lg md:text-xl text-white/70 mt-4 max-w-[600px] mx-auto animate-fade-up animate-duration-[659ms] animate-delay-400 animate-ease-in">
              Torneos Web reúne a los mejores robots para competir, ofreciendo herramientas de gestión y analíticas para todos los participantes.
            </p>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-up animate-duration-[659ms] animate-delay-500 animate-ease-in">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-3 sm:px-6 sm:py-4 text-sm sm:text-base rounded-full bg-white text-black font-semibold shadow-sm hover:bg-gray-200 transition-colors"
              >
                <FiLogIn className="inline mr-2" /> Ingresar
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-3 sm:px-6 sm:py-4 text-sm sm:text-base rounded-full bg-transparent border border-white/40 text-white/70 font-semibold hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                <FiUserPlus className="inline mr-2" /> Registrarse
              </button>
            </div>

            <p className="text-white/40 text-sm mt-12 animate-fade-up animate-duration-[659ms] animate-delay-600 animate-ease-in">
              Competidores con ansias de ganar
            </p>
          </div>

          {/* SECCIÓN DE PASOS */}
          {/* 🔽 SECCIÓN DE PASOS: DISEÑO ALARGADO Y MONOCROMÁTICO 🔽 */}
          <div className="animate-fade-up w-full py-10 sm:py-16 flex flex-col items-center text-center relative text-white">
            {isMobile ? (
              // 📱 Carrusel en móvil (simplificado)
              <div className="w-full max-w-7xl px-4">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={16}
                  slidesPerView={1}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  loop={true}
                  className="pb-8"
                >
                  {steps.map((step, index) => (
                    <SwiperSlide key={index}>
                      <div className="px-2">
                        <StepCard step={step} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              // 💻 Diseño Desktop: Más ancho, bordes blancos y sin resplandor azul
              <div className="w-full max-w-[1300px] px-6 flex justify-center">
                <div className="
                    border border-white/20 p-5 
                    rounded-[2rem] 
                    w-full
                    bg-black/40 backdrop-blur-sm
                    shadow-none
                ">
                  <div className="grid grid-cols-3 gap-4 min-h-[340px] w-full">
                    {steps.map((step, index) => (
                      <div key={index} className="h-full">
                        <div className="border border-white/10 rounded-2xl h-full bg-white/5 hover:bg-white/10 transition-colors">
                          <StepCard step={step} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Botón de acción debajo del grid para mantener el flujo */}
                  <div className="mt-4 h-[70px] w-full max-w-xs mx-auto">
                    <div className="h-full w-full rounded-2xl bg-white text-black font-bold flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer uppercase tracking-wider text-sm">
                      Comenzar ahora
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> {/* CIERRE DE CONTENIDO PRINCIPAL */}
      </section>
    </>
  );
}

export default SectionCara1;