import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { GlassReflection, GlassContactLight, GlassFloor } from "./GlassCard";
import SectionBackdrop from "./SectionBackdrop";
import useCardTilt, { useTiltDisabled } from "./particles/useCardTilt";
import useParticleHover from "./particles/useParticleHover";

// Schema serializable a JSON, listo para crecer (agregar proyectos reales /
// case studies no requiere tocar el componente). `href` hoy es un ancla
// placeholder (no hay páginas de detalle todavía) — cuando existan, se
// reemplaza acá nomás. `images`/`alts` son paralelos (mismo índice = mismo
// par) — cada tarjeta rota entre las capturas de UN mismo proyecto real
// (ver ProjectGallery más abajo), no entre proyectos distintos.
const projects = [
  // TODO: revisar copy — tag/title/description inferidos de las 4 capturas
  // (landing pública + panel admin + portal de cliente + login), todas de
  // la misma marca "Comunity Tech". Confirmar stack real.
  {
    id: "comunity-tech",
    images: ["/tiket1.jpg", "/Captur3.jpg", "/dashclient.jpg", "/login.jpg"],
    alts: [
      "Landing pública de Comunity Tech, especialistas en reparación de notebooks y PC, con diagnóstico gratuito y seguimiento de ticket",
      "Panel de administración con lista de tickets de reparación, prioridades, precios y gráfico de tickets por mes",
      "Portal de cliente con el seguimiento paso a paso de una reparación (pendiente, en reparación, listo) y preguntas frecuentes",
      "Pantalla de inicio de sesión y registro de la plataforma de gestión de reparaciones",
    ],
    tag: "SERVICE DESK",
    title: "Comunity Tech — Reparaciones",
    description: "Landing, portal de seguimiento y panel de administración para un service técnico de notebooks y PC.",
    stack: ["React", "Node.js"],
    href: "#contacto",
  },
  // TODO: revisar copy — tag/title/description inferidos de las 3 capturas
  // de Akiabara (home + catálogo). Confirmar stack real (¿Tiendanube/Shopify?).
  {
    id: "akiabara",
    images: ["/Captura.PNG", "/Captura1.PNG", "/Captura33.PNG"],
    alts: [
      "Página de inicio de Akiabara con banners de la colección Verano 25-26 y grilla de productos destacados",
      "Página de inicio de la tienda online de Akiabara con modelo luciendo un blazer rojo de la colección Verano 25-26",
      "Grilla de catálogo de productos de Akiabara con precios, variantes de color y talles",
    ],
    tag: "E-COMMERCE",
    title: "Akiabara — Tienda Online",
    description: "E-commerce de indumentaria con catálogo por colección, fichas de producto y checkout en cuotas.",
    stack: ["React", "Node.js"],
    href: "#contacto",
  },
  {
    id: "panel-profesionales",
    images: ["/psico.jpg"],
    alts: ["Dashboard de seguimiento de clientes para profesionales independientes, con progreso de sesiones, estadísticas y próximas citas"],
    tag: "SAAS",
    title: "Panel para Profesionales",
    description: "Dashboard para técnicos, psicólogos o entrenadores con seguimiento de clientes.",
    stack: ["Next.js", "PostgreSQL"],
    href: "#contacto",
  },
];

const REST_EDGE = 0.4;
const FACE_STYLE = { padding: 0, height: "100%", textAlign: "left" };

// Rotación de imágenes dentro de una tarjeta: crossfade de opacity (nunca
// layout), desfasada por tarjeta para que no cambien todas juntas, pausada
// en hover/pestaña oculta/fuera de viewport, y quieta del todo con
// prefers-reduced-motion (los dots siguen andando a mano en ese caso).
const GALLERY_ROTATE_MS = 4000;
const GALLERY_STAGGER_MS = 1300;
const GALLERY_MANUAL_PAUSE_MS = 3500;

function useReducedMotion() {
  const [rm, setRm] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRm(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return rm;
}

const ProjectGallery = ({ images, alts, cardIndex }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);
  // Estado de pausa en un ref (no en useState): lo lee el tick del
  // setInterval sin necesitar recrearlo por cada cambio de hover/visibilidad.
  const pauseRef = useRef({ hover: false, hidden: false, offscreen: false, manualUntil: 0 });
  const rm = useReducedMotion();
  const N = images.length;

  useEffect(() => {
    if (N <= 1 || rm) return undefined;
    const el = wrapRef.current;
    // Pausar con el mouse sobre TODA la tarjeta, no solo el área de imagen.
    const cardEl = el.closest(".ds-project-card") || el;
    const p = pauseRef.current;
    p.hidden = document.hidden;

    let intervalId = null;
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        if (p.hover || p.hidden || p.offscreen || Date.now() < p.manualUntil) return;
        setActiveIndex((i) => (i + 1) % N);
      }, GALLERY_ROTATE_MS);
    }, cardIndex * GALLERY_STAGGER_MS);

    const onEnter = () => { p.hover = true; };
    const onLeave = () => { p.hover = false; };
    const onVisibility = () => { p.hidden = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);
    cardEl.addEventListener("pointerenter", onEnter);
    cardEl.addEventListener("pointerleave", onLeave);

    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => { p.offscreen = !entries[0]?.isIntersecting; }, { threshold: 0.15 });
      io.observe(cardEl);
    }

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
      cardEl.removeEventListener("pointerenter", onEnter);
      cardEl.removeEventListener("pointerleave", onLeave);
      if (io) io.disconnect();
    };
  }, [N, rm, cardIndex]);

  return (
    <div ref={wrapRef} className="ds-project-gallery" aria-live="off">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alts[i] || ""}
          loading={i === 0 ? "eager" : "lazy"}
          className="ds-project-img"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        />
      ))}
      {N > 1 && (
        <div className="ds-project-gallery-dots">
          {images.map((_, i) => (
            // No es <button>: el ancestro es un <a> (el card completo es
            // clicable) y anidar contenido interactivo dentro de <a> rompe
            // el modelo de contenido HTML. Sigue siendo clicable con mouse
            // (con stopPropagation para no disparar la navegación del
            // card) — no navegable por teclado, gap conocido y aceptado.
            <span
              key={i}
              className={`ds-project-gallery-dot${i === activeIndex ? " is-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                pauseRef.current.manualUntil = Date.now() + GALLERY_MANUAL_PAUSE_MS;
                setActiveIndex(i);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, index, tiltDisabled }) => {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(tiltDisabled);
  useParticleHover(ref, { variant: "card" });
  return (
    <div data-reveal data-delay={index * 120}>
      <a
        ref={ref}
        href={project.href}
        className="ds-project-card"
        style={{ transformStyle: "preserve-3d", transition: "transform .2s ease-out" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="ds-cf-inner ds-static-glass" style={{ "--edge": REST_EDGE, height: "100%" }}>
          <div className="ds-glass-face flex flex-col h-full" style={FACE_STYLE}>
            <div data-glare className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-[2]" style={{ mixBlendMode: "overlay" }} aria-hidden="true" />
            <div className="ds-project-img-wrap">
              <ProjectGallery images={project.images} alts={project.alts} cardIndex={index} />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <span
                className="inline-block self-start text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
                style={{ color: "#38BDF8", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)" }}
              >
                {project.tag}
              </span>
              <h4 className="text-lg font-semibold text-white mb-2" style={{ lineHeight: 1.3, minHeight: "2.6em" }}>
                {project.title}
              </h4>
              <p
                className="text-sm mb-4"
                style={{
                  color: "#94A3B8",
                  lineHeight: 1.6,
                  minHeight: "4.8em",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5" style={{ minHeight: "2.5rem", alignContent: "flex-start" }}>
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="text-[12px] px-2.5 py-1 rounded-full"
                    style={{ color: "#38BDF8", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-white mt-auto">
                Ver proyecto <ArrowRight className="w-[15px] h-[15px]" style={{ color: "#38BDF8" }} />
              </span>
            </div>
          </div>
          <GlassFloor variant="full" />
          <GlassReflection variant="grid" sizeStyle={FACE_STYLE} />
          <GlassContactLight variant="full" />
        </div>
      </a>
    </div>
  );
};

const ClientsSection = () => {
  const tiltDisabled = useTiltDisabled();

  return (
    <section id="proyectos" className="relative overflow-hidden py-20 px-6" style={{ scrollMarginTop: 80 }}>
      <SectionBackdrop variant="grid" vignette={0.95} />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14" data-reveal>
          <h3 className="text-3xl font-bold text-white mb-4" style={{ textShadow: "0 0 28px rgba(0,255,255,0.35)" }}>
            Proyectos reales entregados a nuestros clientes
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interfaces modernas y funcionales creadas para diferentes rubros. Cada diseño se adapta a la identidad de tu negocio.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} tiltDisabled={tiltDisabled} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
