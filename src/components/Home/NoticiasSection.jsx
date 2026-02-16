// src/components/NoticiasSection.jsx
import { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { dataService } from "../../services/dataService";
import { Skeleton } from "../ui/Skeleton";
import doro1 from "../../assets/images/doro1.png";
import doro2 from "../../assets/images/doro2.png";
import doro3 from "../../assets/images/doro3.png";

const NoticiasSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de los tres carruseles
  const [activeMain, setActiveMain] = useState(0);
  const [activeSub1, setActiveSub1] = useState(0);
  const [activeSub2, setActiveSub2] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await dataService.getNews();
        // Ensure we have at least 3 items for the carousel logic, or handle fewer
        const newsData = response.data || [];
        setNews(newsData);
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Efecto automático para los tres carruseles (only if we have news)
  useEffect(() => {
    if (news.length === 0) return;

    const timers = [
      setInterval(() => setActiveMain((p) => (p + 1) % news.length), 3000),
      setInterval(() => setActiveSub1((p) => (p + 1) % news.length), 4000),
      setInterval(() => setActiveSub2((p) => (p + 1) % news.length), 5000),
    ];
    return () => timers.forEach(clearInterval);
  }, [news.length]);

  if (loading) {
    return (
      <section className="w-full py-16">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 bg-white rounded-2xl shadow-lg flex flex-col lg:flex-row gap-12 py-10">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-40 mt-8 rounded-md" />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <Skeleton className="w-full h-56 md:h-64 rounded-lg" />
            <div className="flex gap-6">
              <Skeleton className="flex-1 h-56 md:h-64 rounded-lg" />
              <Skeleton className="flex-1 h-56 md:h-64 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback images if API doesn't provide them or news is empty
  const getImg = (idx) => news[idx]?.image || doro1;

  return (
    <section className="w-full py-16">
      {/* === CONTENEDRO CENTRADO CON SEPARACIÓN === */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 bg-white rounded-2xl shadow-lg flex flex-col lg:flex-row gap-12 py-10">
        {/* ==== COLUMNA IZQUIERDA ==== */}
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-pink-600 font-semibold tracking-wide text-lg">
            {news.length > 0 ? news[activeMain]?.title : 'Noticias'}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mt-2 line-clamp-2">
            {news.length > 0 ? (news[activeMain]?.content?.substring(0, 50) + "...") : 'Nuevas Noticias más relevantes'}
          </h2>
          <p className="text-gray-600 mt-4 max-w-md line-clamp-3">
            {news.length > 0 ? news[activeMain]?.content : 'Entérate de información actual sobre los torneos publicados'}
          </p>

          <button className="mt-8 w-40 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-3 rounded-md shadow-md transition-all duration-300">
            Ver Más <FiArrowRight />
          </button>
        </div>

        {/* ==== COLUMNA DERECHA ==== */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Carrusel superior */}
          <div className="bg-gray-300 w-full h-56 md:h-64 flex items-center justify-center relative rounded-lg overflow-hidden">
            {news.length > 0 && (
              <img
                src={getImg(activeMain)}
                alt="Noticia principal"
                className="w-full h-full object-cover absolute inset-0 transition-all duration-700"
                onError={(e) => { e.target.src = doro1; }}
              />
            )}

            {/* Indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {news.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMain(i)}
                  className={`w-3 h-3 rounded-full transition-all ${activeMain === i ? "bg-black" : "bg-gray-300"
                    }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Carruseles inferiores */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sub carrusel 1 */}
            <div className="bg-gray-300 flex-1 h-56 md:h-64 flex items-center justify-center relative rounded-lg overflow-hidden">
              {news.length > 0 && (
                <img
                  src={getImg(activeSub1)}
                  alt="Sub Noticia 1"
                  className="w-full h-full object-cover absolute inset-0 transition-all duration-700"
                />
              )}
            </div>

            {/* Sub carrusel 2 */}
            <div className="bg-gray-300 flex-1 h-56 md:h-64 flex items-center justify-center relative rounded-lg overflow-hidden">
              {news.length > 0 && (
                <img
                  src={getImg(activeSub2)}
                  alt="Sub Noticia 2"
                  className="w-full h-full object-cover absolute inset-0 transition-all duration-700"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticiasSection;
