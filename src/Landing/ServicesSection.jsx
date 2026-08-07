import React, { useEffect, useState } from "react";
import { Smartphone, Globe, Server, Layers, Palette, Lightbulb, BrainCircuit, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import useCoverflow from "./useCoverflow";
import AmbientParticles from "./AmbientParticles";
import SectionBackdrop from "./SectionBackdrop";
import { GlassReflection, GlassContactLight, GlassFloor } from "./GlassCard";
import { CARD_ASPECT_RATIO, CARD_PADDING, cardWidthFor, cardGapMultFor, cardTrackHeightFor } from "./cardTokens";

const services = [
  {
    Icon: Smartphone,
    title: "Apps Móviles",
    desc: "Aplicaciones nativas e híbridas para iOS y Android, rápidas y pensadas para tus usuarios.",
    techLabel: "TECNOLOGÍAS",
    tech: ["React Native", "Flutter", "Swift", "Kotlin"],
    features: ["iOS y Android", "Notificaciones push", "Publicación en stores"],
  },
  {
    Icon: Globe,
    title: "Aplicaciones Web",
    desc: "Plataformas web modernas, seguras y escalables, accesibles desde cualquier dispositivo.",
    techLabel: "TECNOLOGÍAS",
    tech: ["React", "Next.js", "TypeScript", "Tailwind"],
    features: ["Paneles de gestión", "Diseño responsive", "Alta performance"],
  },
  {
    Icon: Server,
    title: "Sistemas Backend",
    desc: "APIs y arquitecturas robustas que sostienen tu operación y crecen con tu negocio.",
    techLabel: "TECNOLOGÍAS",
    tech: ["Node.js", "Python", "PostgreSQL", "Docker"],
    features: ["APIs REST", "Bases de datos", "Integraciones"],
  },
  {
    Icon: Layers,
    title: "Apps Multiplataforma",
    desc: "Un solo desarrollo que funciona en web, mobile y escritorio, optimizando tiempos y costos.",
    techLabel: "TECNOLOGÍAS",
    tech: ["React Native", "Expo", "Electron"],
    features: ["Código unificado", "Menor costo", "Actualización simultánea"],
  },
  {
    Icon: Palette,
    title: "Diseño UX/UI",
    desc: "Interfaces intuitivas y atractivas que convierten visitantes en clientes.",
    techLabel: "TECNOLOGÍAS",
    tech: ["Figma", "Prototipado", "Design System"],
    features: ["Prototipado", "Identidad visual", "Pruebas con usuarios"],
  },
  {
    Icon: Lightbulb,
    title: "Consultoría Tecnológica",
    desc: "Te acompañamos a definir la estrategia digital correcta para tu empresa.",
    techLabel: "INCLUYE",
    tech: ["Auditoría", "Estrategia", "Roadmap"],
    features: ["Auditoría técnica", "Roadmap digital", "Optimización de procesos"],
  },
  {
    Icon: BrainCircuit,
    title: "Agentes de IA",
    desc: "Asistentes inteligentes que automatizan tareas y responden por vos, integrados a tus sistemas.",
    techLabel: "TECNOLOGÍAS",
    tech: ["LLMs", "RAG", "Automatizaciones", "APIs"],
    features: ["Atención automatizada 24/7", "Integración con tus datos", "Flujos de trabajo autónomos"],
  },
];

const ServicesSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { containerRef, activeIndex, next, prev, goTo, isPlaying, togglePlay, reducedMotion } = useCoverflow(services.length, 2, { gapMult: cardGapMultFor(isMobile) });

  return (
    <section id="servicios" className="relative overflow-hidden py-28 px-6 lg:px-20" style={{ scrollMarginTop: 80 }}>
      <SectionBackdrop variant="carousel" vignette={1} />
      <AmbientParticles count={16} seed={2000} />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14" data-reveal>
          <h2 className="text-4xl font-extrabold text-white mb-3" style={{ textShadow: "0 0 28px rgba(0,255,255,0.35)" }}>
            Nuestros Servicios
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Soluciones de software a medida, pensadas para escalar con tu negocio.
          </p>
        </div>

        <div className="relative">
          <div className="ds-carousel-halo" aria-hidden="true" />

          <div
            ref={containerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Nuestros servicios"
            tabIndex={0}
            className="relative outline-none touch-pan-y select-none"
            style={{ height: cardTrackHeightFor(isMobile), perspective: 1000, transformStyle: "preserve-3d", cursor: "grab" }}
          >
            {services.map((s, i) => {
              const faceStyle = { aspectRatio: CARD_ASPECT_RATIO, padding: CARD_PADDING };
              // Contenido duplicado tal cual en el reflejo (ver GlassReflection):
              // mismo ícono/título/texto/features, para vender que la
              // tarjeta está apoyada sobre el piso de grilla.
              const cardContent = (
                <>
                  <div
                    className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.35)", color: "#38BDF8", boxShadow: "0 0 18px rgba(56,189,248,0.18)" }}
                  >
                    <s.Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2.5 tracking-wide">{s.title}</h3>
                  <p className="text-[13.5px] leading-relaxed mb-4" style={{ color: "#94A3B8" }}>{s.desc}</p>
                  <div className="mb-4">
                    <span
                      className="block text-[11px] font-semibold uppercase mb-2"
                      style={{ color: "#38BDF8", opacity: 0.7, letterSpacing: "0.15em" }}
                    >
                      {s.techLabel}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {s.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[12px] px-2.5 py-1 rounded-full"
                          style={{ color: "#38BDF8", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ul className="mt-auto flex flex-col gap-2.5 list-none p-0 m-0">
                    {s.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-[13px]" style={{ color: "#d1d5db" }}>
                        <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: "#38BDF8", boxShadow: "0 0 8px rgba(56,189,248,0.8)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              );
              return (
                <div
                  key={i}
                  data-cf-card
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${s.title}, ${i + 1} de ${services.length}`}
                  className="absolute left-1/2 top-1/2"
                  style={{ width: cardWidthFor(isMobile), willChange: "transform, opacity" }}
                >
                  <div className="ds-cf-inner">
                    <div
                      className="ds-glass-face flex flex-col box-border"
                      style={faceStyle}
                    >
                      {cardContent}
                      <div data-cf-shine className="ds-cf-shine" />
                      <div data-cf-glare className="absolute inset-0 opacity-0 transition-opacity duration-300" style={{ mixBlendMode: "overlay" }} />
                    </div>
                    <GlassFloor variant="full" />
                    <GlassReflection variant="full" sizeStyle={faceStyle}>
                      <div className="flex flex-col box-border w-full h-full">{cardContent}</div>
                    </GlassReflection>
                    <GlassContactLight variant="full" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center justify-center gap-[18px] mt-16">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-11 h-11 rounded-full border text-white flex items-center justify-center shrink-0 transition-all"
              style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)" }}
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
            </button>
            <div className="flex items-center gap-2.5">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir a tarjeta ${i + 1} de ${services.length}`}
                  className="h-2 rounded-full border-none cursor-pointer p-0 transition-all"
                  style={{
                    width: activeIndex === i ? 26 : 8,
                    background: activeIndex === i ? "#3B82F6" : "rgba(255,255,255,0.35)",
                    boxShadow: activeIndex === i ? "0 0 12px rgba(59,130,246,0.9)" : "none",
                  }}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="w-11 h-11 rounded-full border text-white flex items-center justify-center shrink-0 transition-all"
              style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)" }}
            >
              <ChevronRight className="w-[18px] h-[18px]" />
            </button>
            {!reducedMotion && (
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pausar rotación automática" : "Reanudar rotación automática"}
                className="w-9 h-9 rounded-full border text-white flex items-center justify-center shrink-0 transition-all ml-1"
                style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)" }}
              >
                {isPlaying ? <Pause className="w-[15px] h-[15px]" /> : <Play className="w-[15px] h-[15px]" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
