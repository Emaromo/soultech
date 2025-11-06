import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: (
      <span
        style={{
          color: "#ffffff",
          textShadow: `
            2px 2px 6px rgba(0, 0, 0, 0.8),
            0 0 12px rgba(255, 255, 255, 1),
            0 0 20px rgba(0, 180, 255, 0.6)
          `,
        }}
      >
        Cloud Computing
      </span>
    ),
    subtitle: "Infraestructura escalable y segura",
    description:
      "Soluciones en la nube cristalinas como el hielo, brindando potencia, escalabilidad y fiabilidad para tu negocio.",
    color: "from-cyan-500 to-blue-600",
    image: "/cloud2.jpg",
  },
  {
    title: (
      <span
        style={{
          color: "#ffffff",
          textShadow: `
            2px 2px 6px rgba(0, 0, 0, 0.8),
            0 0 12px rgba(255, 255, 255, 1),
            0 0 20px rgba(0, 180, 255, 0.6)
          `,
        }}
      >
        Ciberseguridad Avanzada
      </span>
    ),
    subtitle: "Protección impenetrable",
    description:
      "Fortalezas digitales para tus datos. Auditorías, cifrado y monitoreo continuo con tecnología de vanguardia.",
    color: "from-purple-500 to-blue-600",
    image: "/ciberseguridad.jpg",
  },
  {
    title: (
      <span
        style={{
          color: "#ffffff",
          textShadow: `
            2px 2px 6px rgba(0, 0, 0, 0.8),
            0 0 12px rgba(255, 255, 255, 1),
            0 0 20px rgba(0, 180, 255, 0.6)
          `,
        }}
      >
        Inteligencia Artificial
      </span>
    ),
    subtitle: "Automatización Inteligente",
    description:
      "Integramos IA para optimizar tus procesos, mejorar la toma de decisiones y potenciar tus resultados.",
    color: "from-cyan-400 to-purple-500",
    image: "/inteligencia.jpg",
  },
  {
    title: (
      <span
        style={{
          color: "#ffffff",
          textShadow: `
            2px 2px 6px rgba(0, 0, 0, 0.8),
            0 0 12px rgba(255, 255, 255, 1),
            0 0 20px rgba(0, 180, 255, 0.6)
          `,
        }}
      >
        Diseño UI/UX
      </span>
    ),
    subtitle: "Experiencias visuales y funcionales",
    description:
      "Transformamos ideas innovadoras en experiencias de marca impactantes que inspiran, generan confianza y conectan con tus clientes.",
    color: "from-cyan-500 to-purple-600",
    image: "/diseño.jpg",
  },
  {
    title: (
      <span
        style={{
          color: "#ffffff",
          textShadow: `
            2px 2px 6px rgba(0, 0, 0, 0.8),
            0 0 12px rgba(255, 255, 255, 1),
            0 0 20px rgba(232, 239, 241, 1)
          `,
        }}
      >
        Apps Multiplataforma
      </span>
    ),
    subtitle: "Experiencias nativas y responsivas",
    description:
      "Desarrollamos aplicaciones modernas que funcionan perfectamente en cualquier dispositivo.",
    color: "from-blue-500 to-cyan-400",
    image: "/multiplataforma.jpg",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef();

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => autoPlayRef.current();
    const interval = setInterval(play, 7000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];
  const showImage = !!slide.image;

  return (
    <section
      className="text-white relative flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #070707ff 0%, #122047ff 25%, #000000ff 60%, #022451ff 80%, #094185f0 100%)",
        minHeight: "100vh",
        padding: "6rem 1rem 4rem", // 🔹 más espacio arriba en mobile
      }}
    >
      <div className="container mx-auto px-6 text-center relative z-10 flex flex-col justify-center items-center space-y-12">
        {/* === TITULAR PRINCIPAL === */}
        <motion.div
          className="slide-in-up"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 glow-text leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            Aplicaciones a Medida
            <br />
            <span >para tu Negocio</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Desarrollamos soluciones tecnológicas personalizadas que impulsan el
            crecimiento de tu empresa y optimizan tus procesos.
          </motion.p>
        </motion.div>

        {/* === CARRUSEL === */}
        <div className="relative w-full max-w-6xl mx-auto">
          {showImage && (
            <motion.div
              key={slide.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 0,
              }}
            ></motion.div>
          )}

          <div className="relative z-[2] bg-[rgba(0,0,0,0.35)] rounded-2xl overflow-hidden p-12 border border-cyan-500/20 shadow-[0_0_50px_rgba(0,255,255,0.15)] transition-all duration-700">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold mb-2 text-cyan-300">
                  {slide.title}
                </h3>
                <h4 className="text-lg md:text-xl text-gray-400 mb-4">{slide.subtitle}</h4>
                <p className="text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto text-lg">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* 🔸 Indicadores */}
            <div className="flex justify-center gap-3 mt-8">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                    i === currentSlide
                      ? "bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                      : "bg-white/20"
                  }`}
                  onClick={() => setCurrentSlide(i)}
                ></span>
              ))}
            </div>

            {/* 🔸 Botones navegación */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-3xl w-14 h-14 rounded-full hover:bg-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-3xl w-14 h-14 rounded-full hover:bg-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all"
            >
              ›
            </button>
          </div>
        </div>

        {/* === BOTÓN ABAJO (GRANDE) === */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
         <button
  className="relative w-full md:w-auto px-12 py-5 rounded-xl font-semibold text-2xl text-white 
  bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 
  transition-all duration-300 shadow-[0_0_25px_rgba(0,255,255,0.4)] hover:shadow-[0_0_40px_rgba(0,255,255,0.6)]
  overflow-hidden group"
>
  <span className="relative z-10">Comenzar Proyecto</span>

  {/* 🔹 Borde animado de energía */}
  <span className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-70 blur-[3px] animate-borderFlow"></span>

  {/* 🔹 Capa interior para que el fondo se vea limpio */}
  <span className="absolute inset-[2px] rounded-xl bg-gradient-to-r from-cyan-900/20 to-blue-700/20 backdrop-blur-[1px]"></span>

  <style>
    {`
      @keyframes borderFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .animate-borderFlow {
        background-size: 200% 200%;
        animation: borderFlow 4s linear infinite;
      }
    `}
  </style>
</button>

        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
