import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HelpCircle,
    MessageCircle,
    Mail,
    Book,
    ChevronDown,
    Search,
    Users,
    Award,
    Shield,
    ExternalLink,
    Send,
    LifeBuoy
} from 'lucide-react';

const AyudaView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        {
            pregunta: "¿Cómo puedo unirme a un club?",
            respuesta: "Para unirte a un club, navega a la sección 'Clubes', elige el que más te guste y haz clic en 'Unirse'. Algunos clubes pueden requerir un código de invitación o que cumplas con un nivel mínimo.",
            categoria: "Clubes"
        },
        {
            pregunta: "¿Qué necesito para participar en un torneo?",
            respuesta: "Debes estar registrado en la plataforma y tener un robot que cumpla con las especificaciones técnicas de la categoría del torneo. Revisa el reglamento específico en la vista de detalles de cada torneo.",
            categoria: "Torneos"
        },
        {
            pregunta: "¿Cómo se calculan los puntos de ranking?",
            respuesta: "Los puntos se otorgan por victorias en partidas oficiales, participación en torneos y logros especiales. El sistema pondera la dificultad de los oponentes y la importancia del evento.",
            categoria: "Competencia"
        },
        {
            pregunta: "¿Hay algún costo por usar la plataforma?",
            respuesta: "El acceso a la plataforma básica y la visualización de rankings es gratuito. Algunos torneos premium pueden tener una cuota de inscripción para premios y logística.",
            categoria: "General"
        }
    ];

    const contactChannels = [
        {
            icon: <MessageCircle size={24} />,
            title: "Discord Community",
            desc: "Únete a nuestro servidor para soporte en tiempo real y comunidad.",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            link: "#"
        },
        {
            icon: <Send size={24} />,
            title: "WhatsApp Bot",
            desc: "Consultas rápidas y notificaciones de torneos vía móvil.",
            color: "text-green-400",
            bg: "bg-green-500/10",
            link: "#"
        },
        {
            icon: <Mail size={24} />,
            title: "Soporte Vía Email",
            desc: "Para incidencias técnicas o consultas institucionales.",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            link: "mailto:support@robotech.com"
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.respuesta.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative text-center overflow-hidden flex-1 flex flex-col h-full">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[#0B1124] overflow-hidden -z-10 rounded-2xl border border-[#1E90FF33] shadow-2xl">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 md:p-10 flex flex-col h-full overflow-y-auto no-scrollbar"
            >
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <LifeBuoy size={12} /> Centro de Ayuda
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic leading-none">
                        ¿Cómo podemos <span className="text-[#00C2FF]">Ayudarte?</span>
                    </h2>
                    <p className="text-gray-400 text-sm max-w-2xl mx-auto uppercase tracking-widest font-bold opacity-70">
                        Encuentra respuestas rápidas o contáctanos directamente para asistencia personalizada.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto w-full mb-16 px-4">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Busca un tema, pregunta o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#131B36]/80 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-[#00C2FF]/40 transition-all shadow-xl"
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C2FF] transition-colors" size={24} />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* FAQ Area (LEFT) */}
                    <div className="lg:col-span-12 space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic border-l-4 border-blue-500 pl-4">Preguntas Frecuentes</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredFaqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    className={`bg-[#131B36]/50 border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all hover:bg-[#131B36]/80 ${activeFaq === index ? 'border-[#00C2FF]/30 ring-1 ring-[#00C2FF]/20' : ''}`}
                                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                >
                                    <div className="p-5 flex justify-between items-center gap-4">
                                        <div className="flex flex-col text-left">
                                            <span className="text-[9px] font-black text-[#00C2FF] uppercase tracking-widest mb-1 opacity-80">{faq.categoria}</span>
                                            <h4 className="text-sm md:text-base font-bold text-white leading-tight">{faq.pregunta}</h4>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: activeFaq === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-gray-500 group-hover:text-white"
                                        >
                                            <ChevronDown size={20} />
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {activeFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5"
                                            >
                                                <div className="p-5 text-left text-sm text-gray-400 leading-relaxed font-medium">
                                                    {faq.respuesta}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Channels (BOTTOM) */}
                    <div className="lg:col-span-12 mt-10">
                        <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic border-l-4 border-[#00C2FF] pl-4">Canales de Contacto</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactChannels.map((channel, index) => (
                                <motion.a
                                    key={index}
                                    href={channel.link}
                                    whileHover={{ y: -8 }}
                                    className="bg-[#131B36]/50 border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center group transition-all hover:bg-[#1a2542] hover:border-[#00C2FF]/30 shadow-lg"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${channel.bg} ${channel.color} flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
                                        {channel.icon}
                                    </div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-2 group-hover:text-[#00C2FF] transition-colors">{channel.title}</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide leading-relaxed">
                                        {channel.desc}
                                    </p>
                                    <div className="mt-6 text-[10px] font-black uppercase text-[#00C2FF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Contactar Ahora <ExternalLink size={12} />
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Resources */}
                    <div className="lg:col-span-12 mt-12 mb-10">
                        <div className="bg-gradient-to-r from-[#1E90FF]/20 to-blue-600/10 border border-[#1E90FF]/20 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-[#00C2FF] shadow-2xl shrink-0 group-hover:rotate-12 transition-transform">
                                <Book size={40} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none italic">Guía de Reglamento Nacional</h4>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Descarga el manual completo de construcción y arbitraje 2025.</p>
                            </div>
                            <button className="px-8 py-4 bg-[#1E90FF] hover:bg-[#00C2FF] text-[#0A0F24] font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0">
                                Descargar PDF
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AyudaView;
