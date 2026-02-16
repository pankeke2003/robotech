import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoimg from "../../assets/images/logo.png";
import { FiLogIn, FiArrowUpRight, FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";
import TextType from "../ui/TextType";
import CurvedLoop from "../ui/CurvedLoop";
import LightRays from '../ui/LightRays';
import robotIcon from "../../assets/images/robot1.png";
import robotIcon2 from "../../assets/images/robot2.png";
import robotIcon3 from "../../assets/images/robot3.png";
import robotIcon4 from "../../assets/images/robot4.png";
import { motion } from "framer-motion";
import bif from "../../assets/images/big.png";
import fondosibert from "../../assets/images/fondogif.gif";
import braket1 from "../../assets/images/braket1.png";
import braket2 from "../../assets/images/braket2.png";
import { Search } from 'lucide-react';
import { Sword, CircleDashed, Rocket, CheckCircle2, Cpu, Users } from 'lucide-react';
import ola from "../../assets/images/diseñoola.svg";
import MatchmakingSection from "./MatchmakingSection";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import "swiper/css/pagination";

// Hook para detectar pantalla móvil
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

// Datos simulados para el carrusel de torneos
const mockTournaments = [
  { id: 1, name: "Torneo Nacional #1", prize: "5000" },
  { id: 2, name: "Copa Innovación Robótica", prize: " 2500" },
  { id: 3, name: "Desafío de Velocidad 3000", prize: " 10000" },
  { id: 4, name: "Liga de Minisumo Regional", prize: " 1500" },
  { id: 5, name: "Campeonato de Drones IA", prize: " 8000" },
  { id: 6, name: "Batalla de Sumos Pesados", prize: " 4000" },
  { id: 7, name: "Reto de Algoritmos Avanzados", prize: " 6000" },
  { id: 8, name: "Hackathon Robótica Global", prize: " 12000" },
  { id: 9, name: "Copa América de Combate", prize: " 7500" },
  { id: 10, name: "Desafío Ártico Robótico", prize: " 3200" },
  { id: 11, name: "Liga Jr. Programadores", prize: " 1200" },
  { id: 12, name: "Torneo Relay Bots", prize: " 4500" },
];

const scrollData = [...mockTournaments, ...mockTournaments];

/**
 * 🌐 API INTEGRATION TIP:
 * Para obtener clubes reales de la DB:
 * 
 * useEffect(() => {
 *   fetch('/api/clubs/popular')
 *     .then(res => res.json())
 *     .then(data => setClubData(data));
 * }, []);
 */

// Datos de clubes robóticos
const clubData = [
  { nombre: "Cyber Titans", puntos: 9820, jugadoresActuales: 14, minimo: 5, maximo: 15, estado: "Disponible" },
  { nombre: "Digital Warriors", puntos: 8750, jugadoresActuales: 12, minimo: 5, maximo: 15, estado: "Disponible" },
  { nombre: "Nexus Elite", puntos: 11200, jugadoresActuales: 8, minimo: 5, maximo: 15, estado: "Disponible" },
  { nombre: "Quantum Force", puntos: 7430, jugadoresActuales: 15, minimo: 5, maximo: 15, estado: "Completo" },
  { nombre: "Neon Knights", puntos: 9150, jugadoresActuales: 6, minimo: 5, maximo: 15, estado: "Disponible" },
  { nombre: "Iron Legion", puntos: 10500, jugadoresActuales: 15, minimo: 5, maximo: 15, estado: "Completo" },
  { nombre: "Storm Breakers", puntos: 8200, jugadoresActuales: 9, minimo: 5, maximo: 15, estado: "Disponible" },
  { nombre: "Frost Bytes", puntos: 9650, jugadoresActuales: 11, minimo: 5, maximo: 15, estado: "Disponible" },
  { nombre: "Alpha Squad", puntos: 8900, jugadoresActuales: 7, minimo: 5, maximo: 15, estado: "Disponible" },
  { nombre: "Omega Bots", puntos: 12500, jugadoresActuales: 13, minimo: 5, maximo: 15, estado: "Disponible" },
  { nombre: "Shadow Runners", puntos: 6700, jugadoresActuales: 5, minimo: 5, maximo: 15, estado: "Disponible" },
];

// Datos de Categorías
const categories = [
  {
    name: "Robótica",
    img: robotIcon,
    description: "Diseña, construye y programa robots capaces de competir en entornos reales y desafiantes.",
    tag: "#robótica",
    smallText: "Ideal para principiantes y avanzados"
  },
  {
    name: "IA Asistida",
    img: robotIcon2,
    description: "Integra algoritmos inteligentes para que tus robots tomen decisiones autónomas en tiempo real.",
    tag: "#ia-asistida",
    smallText: "Requiere conocimientos básicos de Python"
  },
  {
    name: "A.Matisación",
    img: robotIcon3,
    description: "Crea sistemas que optimizan tareas repetitivas usando sensores, actuadores y lógica programable.",
    tag: "#automatización",
    smallText: "Enfocado en eficiencia industrial"
  },
  {
    name: "Mecánica Avanzada",
    img: robotIcon4,
    description: "Domina la ingeniería estructural y cinemática para construir robots resistentes y de alto rendimiento.",
    tag: "#mecánica-avanzada",
    smallText: "Diseño 3D y materiales especializados"
  }
];

function Cuerpo() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Estados de visibilidad por scroll
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [isPromoVisible, setIsPromoVisible] = useState(false);
  const [isMatchmakingVisible, setIsMatchmakingVisible] = useState(false);
  const [isRobotPromoVisible, setIsRobotPromoVisible] = useState(false);
  const [isClubsVisible, setIsClubsVisible] = useState(false);

  // --- LÓGICA DE SCROLL PARA EL CARRUSEL DE CLUBES (Manual) ---
  const clubCarouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARD_WIDTH = 350;
  const GAP_SIZE = 16;

  const scroll = (direction) => {
    if (clubCarouselRef.current) {
      const totalClubs = clubData.length;
      let newIndex = currentIndex + direction;

      if (newIndex >= totalClubs) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = totalClubs - 1;
      }

      setCurrentIndex(newIndex);
      const scrollDistance = newIndex * (CARD_WIDTH + GAP_SIZE);

      clubCarouselRef.current.scrollTo({
        left: scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => scroll(-1);
  const scrollRight = () => scroll(1);

  // --- LÓGICA DE APARICIÓN POR SCROLL ---
  useEffect(() => {
    const sections = document.querySelectorAll("section, main");
    const navLinks = document.querySelectorAll("nav ul li a");

    const thresholdCategories = 700;
    const thresholdPromo = 1900;
    const thresholdMatchmaking = 2500;
    const thresholdRobotPromo = 3100;
    const thresholdClubs = 2500;

    const onScroll = () => {
      const scrollPosition = window.scrollY;

      // Resaltado de navegación
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (scrollPosition >= sectionTop) current = section.getAttribute("id");
      });

      navLinks.forEach((link) => {
        link.classList.remove("text-sky-600");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("text-sky-600");
        }
      });

      // Categorías
      if (scrollPosition >= thresholdCategories && !isCategoriesVisible) {
        setIsCategoriesVisible(true);
      } else if (scrollPosition < thresholdCategories && isCategoriesVisible) {
        setIsCategoriesVisible(false);
      }

      // Bloque Promocional/Video
      if (scrollPosition >= thresholdPromo && !isPromoVisible) {
        setIsPromoVisible(true);
      } else if (scrollPosition < thresholdPromo && isPromoVisible) {
        setIsPromoVisible(false);
      }

      // Bloque Matchmaking (Nuevo)
      if (scrollPosition >= thresholdMatchmaking && !isMatchmakingVisible) {
        setIsMatchmakingVisible(true);
      } else if (scrollPosition < thresholdMatchmaking && isMatchmakingVisible) {
        setIsMatchmakingVisible(false);
      }

      // Bloque Robot/Torneo
      if (scrollPosition >= thresholdRobotPromo && !isRobotPromoVisible) {
        setIsRobotPromoVisible(true);
      } else if (scrollPosition < thresholdRobotPromo && isRobotPromoVisible) {
        setIsRobotPromoVisible(false);
      }

      // Bloque Clubes
      if (scrollPosition >= thresholdClubs && !isClubsVisible) {
        setIsClubsVisible(true);
      } else if (scrollPosition < thresholdClubs && isClubsVisible) {
        setIsClubsVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isCategoriesVisible, isPromoVisible, isMatchmakingVisible, isRobotPromoVisible, isClubsVisible]);

  // Auto play/pause del video con Intersection Observer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isPromoVisible) {
            video.play().catch(e => console.warn("Video play prevented:", e));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isPromoVisible]);

  // --- CARRUSEL MÓVIL MEJORADO (para categorías) ---
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileCarouselRef = useRef(null); // Sin tipo TS
  const autoScrollInterval = useRef(null);
  const isUserInteracting = useRef(false);
  const totalItems = categories.length;

  const goToSlide = (index) => {
    if (mobileCarouselRef.current) {
      const items = mobileCarouselRef.current.children;
      const item = items[index];
      if (item) {
        item.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
        setMobileIndex(index);
      }
    }
  };

  const startAutoScroll = () => {
    if (autoScrollInterval.current) return;

    autoScrollInterval.current = setInterval(() => {
      if (!isUserInteracting.current) {
        setMobileIndex((prev) => {
          const next = (prev + 1) % totalItems;
          goToSlide(next);
          return next;
        });
      }
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  const handleScroll = () => {
    if (!mobileCarouselRef.current) return;

    isUserInteracting.current = true;
    stopAutoScroll();

    setTimeout(() => {
      isUserInteracting.current = false;
      startAutoScroll();
    }, 3000);

    const container = mobileCarouselRef.current;
    const items = Array.from(container.children);
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    items.forEach((item, idx) => {
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const distance = Math.abs(itemCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setMobileIndex(closestIndex);
  };

  useEffect(() => {
    const ref = mobileCarouselRef.current;
    if (!ref) return;

    ref.addEventListener('scroll', handleScroll);
    ref.addEventListener('mouseenter', stopAutoScroll);
    ref.addEventListener('mouseleave', startAutoScroll);
    ref.addEventListener('touchstart', stopAutoScroll);
    ref.addEventListener('touchend', () => {
      setTimeout(startAutoScroll, 3000);
    });

    startAutoScroll();

    return () => {
      stopAutoScroll();
      ref.removeEventListener('scroll', handleScroll);
      ref.removeEventListener('mouseenter', stopAutoScroll);
      ref.removeEventListener('mouseleave', startAutoScroll);
      ref.removeEventListener('touchstart', stopAutoScroll);
      ref.removeEventListener('touchend', () => { });
    };
  }, []);

  // --- RENDER ---
  return (
    <section
      id="inicio"
      className=" relative overflow-hidden flex flex-col justify-center items-center text-white font-[Martian_Mono]"
    >


      {/* ----------------------------------------------------------- */}
      {/* 🟢 BLOQUE 1: GRID / SLIDER DE CATEGORÍAS (Izquierda) */}
      {/* ----------------------------------------------------------- */}
      <div
        className={`
        max-w-7xl mx-auto
        px-4 sm:px-6 md:px-12 lg:px-20 xl:px-5
        transition-all duration-700 ease-in-out
        ${isCategoriesVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
      `}
      >
        <p className="text-sm text-purple-400 tracking-wide uppercase">
          No pierdas el tiempo
        </p>
        <h2 className=" text-4xl font-bold text-white mt-2 mb-12">
          Encuentra las mejores Categorias
        </h2>
        {/* 📱 MODO MÓVIL: CARRUSEL AUTOMÁTICO DE UNA CARTA CENTRADA */}
        <div className="md:hidden">
          <style>{`
    .mobile-carousel {
      -ms-overflow-style: none;
      scrollbar-width: none;
      overflow-x: hidden !important;
    }
    .mobile-carousel::-webkit-scrollbar {
      display: none;
    }
  `}</style>

          {/* Carrusel */}
          <div
            ref={mobileCarouselRef}
            className="flex overflow-x-auto mobile-carousel scroll-smooth py-6"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {categories.map((cat, i) => (
              <div
                key={`mobile-${i}`}
                className="snap-center flex-shrink-0 w-[90vw] max-w-[340px] px-2"
              >
                <div className="group bg-white border border-gray-300 rounded-xl shadow-sm p-5">
                  <div className="flex w-full gap-4 items-start">
                    <div className="w-32 h-32 min-w-32 rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 text-left">
                      <h3 className="text-xs font-semibold text-gray-800 leading-tight line-clamp-1">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-left">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 line-clamp-1 max-w-[100px] truncate">
                      {cat.tag}
                    </span>
                  </div>
                  <div className="w-full border-t border-gray-300 my-3"></div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                      {cat.smallText}
                    </p>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-base">
                      <FiArrowUpRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores */}
          <div className="flex justify-center mt-4 space-x-2">
            {categories.map((_, i) => (
              <div
                key={`dot-${i}`}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${i === mobileIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                onClick={() => {
                  stopAutoScroll();
                  goToSlide(i);
                  setTimeout(startAutoScroll, 4000); // Reinicia tras click
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* 💻 MODO DESKTOP/TABLET: GRID ESTÁTICO */}
        <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-300 rounded-xl shadow-sm p-5 transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex w-full gap-5 items-start">
                <div className="w-36 h-36 min-w-36 rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 text-left">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 leading-tight line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-2 line-clamp-3">
                    {cat.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-left">
                <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 line-clamp-1 max-w-[100px] truncate">
                  {cat.tag}
                </span>
              </div>
              <div className="w-full border-t border-gray-300 my-4"></div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 line-clamp-1 max-w-[150px]">
                  {cat.smallText}
                </p>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-lg shadow-none hover:shadow-sm transition-all border border-transparent hover:border-blue-300">
                  <FiArrowUpRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>






      {/* ----------------------------------------------------------- */}
      {/* 🛑 BLOQUE 3: SLIDER VERTICAL DE TORNEOS (Derecha) */}
      {/* ----------------------------------------------------------- */}
      <div
        className={`
          mt-29 mb-29
          w-full flex flex-col items-center
          transition-all duration-700 ease-in-out
          ${isPromoVisible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-full'
          }
        `}
      >

        {/* ESTRUCTURA DE DOS COLUMNAS */}
        <div className="
          w-full max-w-7xl px-10 sm:px-4 py-16
          flex flex-col lg:flex-row gap-16 lg:gap-20
          justify-between items-center lg:items-start
        ">

          {/* 1. SECCIÓN IZQUIERDA */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-12">
            <p className="text-sm text-white/60 tracking-widest uppercase mb-3 font-medium">
              TORNEOS DESTACADOS
            </p>

            <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tighter">
              <span className="block">PRÓXIMOS DESAFÍOS</span>
            </h2>

            {/* 💡 Texto Descriptivo */}
            <p className="text-base text-white/70 max-w-xl lg:max-w-none leading-relaxed mb-10">
              Visualiza los torneos más recientes que se han unido a la liga. Mantente al día con las
              categorías de alto nivel y asegúrate de inscribir tu robot a tiempo.
            </p>

            {/* Botón grande */}
            <button
              onClick={() => navigate("/menu?vista=torneos")}
              className="
                px-10 py-4 
                text-lg 
                rounded-full 
                bg-transparent
                text-white 
                font-semibold 
                border border-white
                hover:bg-white/10
                transition-colors
                flex items-center
              "
            >
              <FiSearch className="inline mr-3 text-xl" /> Explorar Todos los Torneos
            </button>
          </div>

          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

              @keyframes vertical-scroll {
                0% { transform: translateY(0); }
                100% { transform: translateY(-50%); }
              }

              .animate-vertical-scroll {
                animation: vertical-scroll 30s linear infinite;
                height: auto;
              }
            `}
          </style>

          {/* 2. SLIDER DERECHA */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="
              w-full max-w-xl 
              h-[450px]
              overflow-hidden 
              relative
              rounded-2xl border border-white
              bg-black/20
              p-2
            ">

              {/* Gradientes */}
              <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none rounded-t-2xl"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none rounded-b-2xl"></div>

              <div
                className="
                  flex flex-col space-y-4 
                  w-full 
                  animate-vertical-scroll 
                  pt-6 pb-6
                "
              >
                {scrollData.map((torneo, index) => (
                  <div
                    key={`item-${index}-${torneo.id}`}
                    className="
                      flex items-center p-4 mx-3 rounded-xl 
                      bg-white/5 border border-white/20 
                      hover:bg-white/10 transition-colors 
                      cursor-pointer
                    "
                  >
                    <img
                      src={`https://placehold.co/45x45/000000/FFFFFF?text=T${torneo.id}`}
                      alt={torneo.name}
                      className="w-11 h-11 object-cover rounded-lg mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/45x45/000000/FFFFFF?text=R";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white truncate">{torneo.name}</p>
                      <p className="text-sm text-white/60 font-light">Puntos: {torneo.prize}</p>
                    </div>

                    <div className="ml-5 flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/60"></div>
                      <span className="text-sm text-white/60">Activo</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 🟣 BLOQUE NUEVO: SISTEMA DE MATCHMAKING */}
      {/* ----------------------------------------------------------- */}
      <div
        className={`
          w-full z-20 relative
          transition-all duration-700 ease-in-out
          ${isMatchmakingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
        `}
      >
        <MatchmakingSection />
      </div>



      {/* ----------------------------------------------------------- */}
      {/* 🟠 BLOQUE 4: CLUBES ROBÓTICOS + CARRUSEL MANUAL (Izquierda) */}
      {/* ----------------------------------------------------------- */}

      <div
        className={`
          mt-24 mb-24
          w-full text-gray-900 flex justify-center 
          transition-all duration-700 ease-in-out
          ${isRobotPromoVisible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-full'
          }
        `}
      >
        <div className="w-full max-w-[1350px] px-8 py-20 flex flex-col items-center">

          {/* ▬▬▬ CONTENEDOR PRINCIPAL RESPONSIVO ▬▬▬ */}
          <div className="
            w-full flex flex-col lg:flex-row 
            justify-center items-center 
            text-center lg:text-left
          ">

            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start mb-10 lg:mb-0 pr-4">

              {/* Título secundario */}
              <p className="text-xs text-white/60 tracking-widest uppercase mb-1 font-medium">
                NETWORKING DE ÉLITE
              </p>

              {/* Título principal */}
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight mb-4 lg:text-left">
                <span className="block">ÚNETE A LOS MEJORES</span>
                <span className="block font-light text-white/80">CLUBES ROBÓTICOS</span>
              </h2>

              {/* Descripción */}
              <p className="
                text-white/80 
                text-sm 
                leading-snug
                max-w-[450px] 
                mb-6 lg:text-left
              ">
                Tu desarrollo depende de tu equipo. Accede a la red de clubes de élite y encuentra mentores en tu categoría: <strong>Lucha, Sumo o Velocidad</strong>.
              </p>

              {/* Tags — todos en blanco, sin colores */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8 max-w-[500px]">
                <span className="px-3 py-1 bg-white/5 text-white/80 rounded-lg text-xs font-medium border border-white/20">#Lucha</span>
                <span className="px-3 py-1 bg-white/5 text-white/80 rounded-lg text-xs font-medium border border-white/20">#Sumo</span>
                <span className="px-3 py-1 bg-white/5 text-white/80 rounded-lg text-xs font-medium border border-white/20">#Velocidad</span>
                <span className="px-3 py-1 bg-white/5 text-white/80 rounded-lg text-xs font-medium border border-white/20">#Innovación</span>
              </div>

              {/* Botón — blanco, borde blanco, fondo transparente */}
              <button
                onClick={() => navigate("/menu?vista=clubs")}
                className="
                  px-7 py-2 
                  text-sm 
                  rounded-full 
                  bg-transparent
                  text-white 
                  font-semibold 
                  border border-white
                  flex items-center
                  hover:bg-white/10 
                  transition-colors
                "
              >
                <FiLogIn className="inline mr-2" /> Explorar Equipos
              </button>

            </div>

            {/* ▬▬▬ CARRUSEL DE CLUBES — DERECHA ▬▬▬ */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-8 lg:mt-0">

              <div
                ref={clubCarouselRef}
                id="club-carousel"
                className="
                  flex space-x-4
                  w-full sm:w-[600px] md:w-[716px] lg:w-[716px] 
                  overflow-x-hidden 
                  pb-4
                "
                style={{ scrollBehavior: 'smooth' }}
              >
                {clubData.map((club, index) => (
                  <div
                    key={index}
                    className={`
                      min-w-[350px]
                      flex flex-col overflow-hidden
                      rounded-3xl border border-black/10
                      bg-white
                      transition-all duration-500
                      ${club.estado === "Completo" ? "opacity-80" : "hover:bg-gray-50"}
                    `}
                  >
                    <div className="relative aspect-[16/9] w-full">
                      <img
                        src={`https://picsum.photos/400/200?random=${index + 10}`}
                        alt={`Club ${club.nombre}`}
                        className="h-full w-full object-cover opacity-90 hover:opacity-100 transition duration-500"
                      />
                      <span className={`
                        absolute top-2 right-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full
                        bg-black/60
                      `}>
                        {club.estado}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 truncate">{club.nombre}</h3>
                        <p className="mt-1 text-xs text-gray-700 truncate">Puntos: <span className="text-gray-900 font-semibold">{club.puntos}</span></p>
                      </div>
                      <div className="mt-2 text-xs text-gray-700 space-y-1">
                        <div className="flex justify-between">
                          <span>Jugadores actuales:</span>
                          <span className="text-gray-900 font-semibold">{club.jugadoresActuales}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Máximo permitido:</span>
                          <span className="text-gray-900 font-semibold">{club.maximo}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <button
                          onClick={() => navigate("/vistatorneo")}
                          className="flex-1 rounded-lg border border-black px-3 py-2 text-sm font-medium text-gray-900 bg-transparent hover:bg-black/5 transition"
                        >
                          Ver detalles
                        </button>
                        <button className="rounded-lg border border-black px-3 py-2 text-sm font-medium text-gray-900 bg-transparent hover:bg-black/5 transition">
                          Unirse
                        </button>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 text-[10px] text-gray-600 border-t border-black/10 text-center">
                      Club Network • Edición 2025
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones de navegación — en negro/gris */}
              <button
                onClick={scrollLeft}
                className="absolute top-1/2 -left-3 transform -translate-y-1/2 p-3 bg-white border border-black/10 hover:bg-black/5 rounded-full text-gray-900 z-20 transition"
              >
                <FiArrowLeft size={20} />
              </button>
              <button
                onClick={scrollRight}
                className="absolute top-1/2 -right-3 transform -translate-y-1/2 p-3 bg-white border border-black/10 hover:bg-black/5 rounded-full text-gray-900 z-20 transition"
              >
                <FiArrowRight size={20} />
              </button>

            </div>

          </div>

          {/* ▬▬▬ SECCIÓN INFERIOR DE DISCIPLINAS ▬▬▬ */}
          <div
            className="
              w-full 
              mt-12 p-8
              bg-white
              border border-black/10 rounded-3xl
              text-gray-900
            "
          >
            <h3 className="text-base font-semibold mb-6 text-center uppercase tracking-wider text-gray-800">
              ELIGE TU DISCIPLINA DE INGENIERÍA
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-xl bg-black/5 hover:bg-black/10 transition-all cursor-pointer border border-black/10">
                <Sword className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                <p className="text-sm font-semibold mb-0.5">Lucha / Combate</p>
                <p className="text-xs text-gray-600">Diseño destructivo</p>
              </div>
              <div className="p-4 rounded-xl bg-black/5 hover:bg-black/10 transition-all cursor-pointer border border-black/10">
                <CircleDashed className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                <p className="text-sm font-semibold mb-0.5">Minisumo</p>
                <p className="text-xs text-gray-600">Fuerza y sensores</p>
              </div>
              <div className="p-4 rounded-xl bg-black/5 hover:bg-black/10 transition-all cursor-pointer border border-black/10">
                <Rocket className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                <p className="text-sm font-semibold mb-0.5">Carrera Rápida</p>
                <p className="text-xs text-gray-600">Optimización de algoritmos</p>
              </div>
              <div className="p-4 rounded-xl bg-black/5 hover:bg-black/10 transition-all cursor-pointer border border-black/10">
                <Cpu className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                <p className="text-sm font-semibold mb-0.5">IA & Proyectos</p>
                <p className="text-xs text-gray-600">Robótica avanzada</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* ⚫ FOOTER MINIMALISTA */}
      {/* ----------------------------------------------------------- */}
      <footer className="w-full bg-[#050505] border-t border-white/10 text-gray-400 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* 1. Logo y Eslogan */}
          <div className="flex flex-col items-center md:items-start col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoimg} alt="Robotech Logo" className="h-8 w-auto opacity-90 grayscale hover:grayscale-0 transition-all duration-500" />
              <span className="text-white font-bold text-lg tracking-tight">ROBOTECH</span>
            </div>
            <p className="text-xs text-center md:text-left leading-relaxed opacity-60 max-w-[200px]">
              Innovación, ingeniería y competición. La plataforma líder para torneos de robótica.
            </p>
          </div>

          {/* 2. Enlaces */}
          <div className="col-span-1 md:col-span-2 flex justify-center md:justify-end gap-8 md:gap-16 text-sm font-medium">
            <div className="flex flex-col gap-3">
              <h4 className="text-white text-xs uppercase tracking-widest mb-1 opacity-50">Explorar</h4>
              <button onClick={() => navigate("/menu?vista=torneos")} className="hover:text-white transition-colors text-left">Torneos</button>
              <button onClick={() => navigate("/menu?vista=clubs")} className="hover:text-white transition-colors text-left">Clubes</button>
              <a href="#" className="hover:text-white transition-colors">Ranking</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white text-xs uppercase tracking-widest mb-1 opacity-50">Legal</h4>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
            </div>
          </div>

          {/* 3. Redes y Copyright */}
          <div className="flex flex-col items-center md:items-end justify-between col-span-1 md:col-span-1">
            <div className="flex gap-4 mb-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/20 hover:text-white transition-all"><FiArrowUpRight size={16} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/20 hover:text-white transition-all"><Users size={16} /></a>
            </div>
            <p className="text-[10px] opacity-40">© 2025 Robotech Inc.</p>
          </div>

        </div>
      </footer>

    </section>

  );
}

export default Cuerpo;