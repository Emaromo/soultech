import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useCoverflow from "./useCoverflow";
import AmbientParticles from "./AmbientParticles";
import SectionBackdrop from "./SectionBackdrop";
import { GlassReflection, GlassContactLight, GlassFloor } from "./GlassCard";
import IndustryGrid from "./IndustryGrid";
import { WHATSAPP_NUMBER } from "./whatsappConfig";

const WA = WHATSAPP_NUMBER;

const industries = [
  {
    id: "profesionales",
    icon: "Stethoscope",
    title: "Profesionales",
    eyebrow: "SALUD · CONTADORES · ABOGADOS",
    description: "Sitios que transmiten confianza y convierten consultas en clientes.",
    pill: "Más presencia, más confianza",
    whatsappMessage: "Hola! Soy profesional y quiero una web para mi consultorio/estudio. ¿Me pasás info?",
  },
  {
    id: "tiendas-online",
    icon: "ShoppingBag",
    title: "Tiendas Online",
    eyebrow: "E-COMMERCE · CATÁLOGOS",
    description: "Vendé tus productos de forma segura, simple y profesional.",
    pill: "Más ventas, más crecimiento",
    whatsappMessage: "Hola! Quiero armar mi tienda online. ¿Me pasás info?",
  },
  {
    id: "gimnasios",
    icon: "Dumbbell",
    title: "Gimnasios y Entrenadores",
    eyebrow: "FITNESS · BIENESTAR",
    description: "Más alumnos y reservas con un sitio que refleja tu profesionalismo.",
    pill: "Más reservas, más resultados",
    whatsappMessage: "Hola! Tengo un gimnasio y quiero una web para conseguir más alumnos. ¿Me pasás info?",
  },
  {
    id: "empresas",
    icon: "Building2",
    title: "Empresas y Servicios",
    eyebrow: "B2B · CORPORATIVO",
    description: "Mostrá tu empresa y generá credibilidad desde el primer clic.",
    pill: "Más credibilidad, más oportunidades",
    whatsappMessage: "Hola! Busco una web para mi empresa. ¿Me pasás info?",
  },
  {
    id: "estetica",
    icon: "Scissors",
    title: "Estética y Belleza",
    eyebrow: "SALONES · SPA · BARBERÍAS",
    description: "Agendá turnos, mostrá tus tratamientos y destacá tu marca.",
    pill: "Más turnos, más clientes felices",
    whatsappMessage: "Hola! Tengo un salón/centro de estética y quiero una web con turnos. ¿Me pasás info?",
  },
  {
    id: "restaurantes",
    icon: "UtensilsCrossed",
    title: "Restaurantes y Cafeterías",
    eyebrow: "GASTRONOMÍA · DELIVERY",
    description: "Mostrá tu menú, recibí reservas y hacé que más clientes te elijan.",
    pill: "Más reservas, más comensales",
    whatsappMessage: "Hola! Tengo un restaurante y quiero una web con menú y reservas. ¿Me pasás info?",
  },
];

const plans = [
  {
    badge: "EXCLUSIVO",
    badgeBg: "linear-gradient(135deg,#06b6d4,#22d3ee)",
    badgeColor: "#031418",
    accent: "#22d3ee",
    glow: "34,211,238",
    btnBg: "linear-gradient(135deg,#06b6d4,#2563eb)",
    title: "Aplicación a Medida",
    tagline: "Software 100% propio, diseñado desde cero para tu operación.",
    price: "Costo inicial",
    priceNote: "+ mensualidad de soporte y evolución",
    href: `https://wa.me/${WA}?text=${encodeURIComponent("¡Hola! Me interesa el plan Aplicación a Medida")}`,
    features: ["Desarrollo exclusivo para tu negocio", "Dashboard para tus clientes", "Dashboard de administración", "Landing page incluida", "Dominio gratis por 1 año", "Actualizaciones mensuales"],
  },
  {
    badge: "POPULAR",
    badgeBg: "linear-gradient(135deg,#a855f7,#c084fc)",
    badgeColor: "#1c0530",
    accent: "#c084fc",
    glow: "168,85,247",
    btnBg: "linear-gradient(135deg,#a855f7,#7c3aed)",
    title: "Aplicación Compartida",
    tagline: "Accedé a un sistema probado y en constante evolución.",
    price: "Sin costo inicial",
    priceNote: "suscripción mensual",
    href: `https://wa.me/${WA}?text=${encodeURIComponent("¡Hola! Me interesa el plan Aplicación Compartida")}`,
    features: ["Acceso a un sistema ya desarrollado", "Dashboard para tus clientes", "Dashboard de administración", "Actualizaciones y mejoras continuas"],
  },
  {
    badge: "BÁSICO",
    badgeBg: "linear-gradient(135deg,#22c55e,#4ade80)",
    badgeColor: "#03180a",
    accent: "#4ade80",
    glow: "74,222,128",
    btnBg: "linear-gradient(135deg,#22c55e,#16a34a)",
    title: "Landing Page",
    tagline: "Tu presencia digital profesional, lista para convertir.",
    price: "Costo inicial",
    priceNote: "+ mantenimiento semestral",
    href: `https://wa.me/${WA}?text=${encodeURIComponent("¡Hola! Me interesa el plan Landing Page")}`,
    features: ["Página profesional a medida", "Formulario de contacto", "Integración con WhatsApp", "Dominio incluido por 6 meses"],
  },
];

// Sólo móvil: la tarjeta central de "Nuestros planes" usa estos valores en
// vez de los hardcodeados de desktop (560 / min(330px,76vw) / minHeight
// 470), que quedan intocados. El contenido de esta tarjeta YA entra en
// 470px (medido con Playwright, aspectRatio:auto no lo desborda) — el
// espacio vacío de acá abajo era el track (560) sobrando contra la tarjeta
// (470), no un problema de contenido cortado.
const PLANES_CARD_WIDTH_MOBILE = "min(280px,84vw)";
const PLANES_CARD_MIN_HEIGHT_MOBILE = 470;
const PLANES_TRACK_HEIGHT_MOBILE = 510;

const PricingSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { containerRef, activeIndex, next, prev, goTo } = useCoverflow(plans.length, 1, { loop: false, autoplay: false, isMobile });

  return (
    <section id="precios" className="relative overflow-hidden py-28 px-6" style={{ scrollMarginTop: 80 }}>
      <SectionBackdrop variant="carousel" vignette={0.95} />
      <AmbientParticles count={isMobile ? 7 : 16} seed={3000} />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14" data-reveal>
          <h2 className="text-4xl font-extrabold text-white mb-3" style={{ textShadow: "0 0 28px rgba(0,255,255,0.35)" }}>
            Planes y Servicios
          </h2>
          <p className="text-gray-400 text-lg">Elegí el modelo que mejor se adapte a tu etapa y presupuesto.</p>
        </div>

        <IndustryGrid title="¿Cuál es tu rubro?" items={industries} loop={false} autoplay={false} />

        <h3 className="text-center text-2xl font-bold text-white mt-14 mb-10">Nuestros planes</h3>

        <div id="planes-carousel" className="relative" style={{ scrollMarginTop: 100 }}>
          <div className="ds-carousel-halo" aria-hidden="true" />

          <div
            ref={containerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Planes y servicios"
            tabIndex={0}
            className="relative outline-none touch-pan-y select-none"
            style={{
              height: isMobile ? PLANES_TRACK_HEIGHT_MOBILE : 560,
              perspective: isMobile ? 1400 : 1000,
              transformStyle: "preserve-3d",
              cursor: "grab",
            }}
          >
            {plans.map((p, i) => {
              const faceStyle = { padding: "30px 28px", minHeight: isMobile ? PLANES_CARD_MIN_HEIGHT_MOBILE : 470 };
              // Mismo contenido en la cara real y en el reflejo (ver
              // GlassReflection): badge, título, precio, features y CTA.
              const cardContent = (
                <>
                  <span
                    className="self-start text-[11px] font-extrabold rounded-full px-3 py-1.5 mb-4"
                    style={{ background: p.badgeBg, color: p.badgeColor, letterSpacing: "0.08em" }}
                  >
                    {p.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1.5">{p.title}</h3>
                  <p className="text-[13.5px] leading-relaxed mb-[18px]" style={{ color: "#94A3B8" }}>{p.tagline}</p>
                  <div className="mb-5">
                    <span className="text-2xl font-extrabold" style={{ color: p.accent }}>{p.price}</span>
                    <span className="block text-[13.5px] mt-0.5" style={{ color: "#94A3B8" }}>{p.priceNote}</span>
                  </div>
                  <ul className="flex-1 flex flex-col gap-2.5 list-none p-0 m-0 mb-6">
                    {p.features.map((f, idx) => (
                      <li key={idx} className="flex gap-2.5 text-[13.5px]" style={{ color: "#d1d5db" }}>
                        <span style={{ color: p.accent }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-white font-semibold text-[14.5px] px-5 py-3 rounded-xl no-underline transition-all hover:brightness-110"
                    style={{ background: p.btnBg }}
                  >
                    Consultar por WhatsApp
                  </a>
                </>
              );
              return (
                <div
                  key={i}
                  data-cf-card
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${p.title}, ${i + 1} de ${plans.length}`}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: isMobile ? PLANES_CARD_WIDTH_MOBILE : "min(330px,76vw)",
                    // En desktop, will-change queda fijo como siempre. En
                    // móvil lo activa/desactiva el motor (useCoverflow.js)
                    // sólo mientras hay movimiento — ver render(moving).
                    ...(isMobile ? {} : { willChange: "transform, opacity" }),
                  }}
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
                    <GlassReflection variant="full" sizeStyle={faceStyle} noContent={isMobile}>
                      {!isMobile && <div className="flex flex-col box-border w-full h-full">{cardContent}</div>}
                    </GlassReflection>
                    <GlassContactLight variant="full" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center justify-center gap-[18px] mt-[70px]">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-11 h-11 rounded-full border text-white flex items-center justify-center shrink-0 transition-all"
              style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)" }}
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
            </button>
            <div className="flex items-center gap-2.5">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir a tarjeta ${i + 1} de ${plans.length}`}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
