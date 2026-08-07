import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Users, PenTool, Code2, Send } from "lucide-react";
import AmbientParticles from "./AmbientParticles";
import SectionBackdrop from "./SectionBackdrop";
import { GlassReflection, GlassContactLight, GlassFloor } from "./GlassCard";
import useCardTilt, { useTiltDisabled } from "./particles/useCardTilt";
import useParticleHover from "./particles/useParticleHover";

const steps = [
  { num: "1", title: "Análisis y Reunión Inicial", desc: "Escuchamos tu idea, entendemos tu negocio y definimos objetivos juntos.", Icon: Users },
  { num: "2", title: "Diseño y Planificación", desc: "Creamos prototipos y definimos la arquitectura y el plan de trabajo.", Icon: PenTool },
  { num: "3", title: "Desarrollo y Pruebas", desc: "Construimos tu solución con entregas parciales y testeo continuo.", Icon: Code2 },
  { num: "4", title: "Lanzamiento y Acompañamiento", desc: "Publicamos tu producto y seguimos a tu lado con soporte y mejoras.", Icon: Send },
];

// --edge en reposo bajo a propósito: son 4 tarjetas "pares", ninguna debe
// dominar como la central de un carrusel (que usa --edge=1). Sube en hover
// vía .ds-static-glass:hover (ver designV2.css).
const REST_EDGE = 0.4;
const FACE_STYLE = { padding: 24, minHeight: 230, textAlign: "left" };

// Fracción del largo total de la línea que ocupa el haz de luz (15-20%).
const BEAM_FRACTION = 0.18;
const BEAM_DURATION = "3.5s";

const StepCard = ({ step, index, circleRef, onSettled }) => {
  const tiltDisabled = useTiltDisabled();
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(tiltDisabled);
  useParticleHover(ref, { variant: "card" });
  const wrapRef = useRef(null);
  // Con REVEAL_MODE='repeat' este data-reveal se re-anima en cada reentrada
  // al viewport, disparando "transitionend" cada vez — pero la línea del
  // timeline solo necesita medirse UNA VEZ (la primera vez que los 4
  // círculos se asientan tras la carga; después el ResizeObserver de más
  // abajo se encarga de re-medir ante cambios reales de layout). Este flag
  // es por-tarjeta y sobrevive entre reentradas porque el componente nunca
  // se desmonta (data-reveal solo muta estilos, no re-renderiza React).
  const hasMeasuredRef = useRef(false);

  // El data-reveal de particleReveal.js anima opacity/transform/filter por
  // JS (no framer-motion acá) — la línea del timeline necesita medirse
  // DESPUÉS de que ese transform termine de asentarse (mismo motivo que
  // antes con onAnimationComplete: medir a mitad de la animación desalinea
  // la línea con el centro real del círculo ya asentado).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !onSettled) return undefined;
    const onEnd = (e) => {
      if (e.target !== el || e.propertyName !== "transform") return;
      if (hasMeasuredRef.current) return;
      hasMeasuredRef.current = true;
      onSettled();
    };
    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [onSettled]);

  const cardContent = (
    <div className="flex flex-col h-full">
      <div className="mb-3" style={{ color: "#38BDF8" }}>
        <step.Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-white mb-2" style={{ minHeight: "2.6em" }}>{step.title}</h3>
      <p className="text-[13.5px] leading-relaxed" style={{ color: "#94A3B8" }}>{step.desc}</p>
    </div>
  );

  return (
    <div ref={wrapRef} className="proc-step text-center" data-reveal data-delay={index * 120}>
      <div
        ref={circleRef}
        className="proc-circle w-[52px] h-[52px] rounded-full mx-auto mb-[18px] flex items-center justify-center text-xl font-extrabold relative z-[1]"
        style={{
          background: "transparent",
          border: "2px solid #FFFFFF",
          color: "#FFFFFF",
          boxShadow: "0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.25)",
          transition: "box-shadow .25s ease, border-color .25s ease",
        }}
      >
        {step.num}
      </div>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ transformStyle: "preserve-3d", transition: "transform .2s ease-out" }}
      >
        <div className="ds-cf-inner ds-static-glass" style={{ "--edge": REST_EDGE }}>
          <div className="ds-glass-face flex flex-col box-border" style={FACE_STYLE}>
            <div data-glare className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-[2]" style={{ mixBlendMode: "overlay" }} aria-hidden="true" />
            {cardContent}
          </div>
          <GlassFloor variant="full" />
          <GlassReflection variant="grid" sizeStyle={FACE_STYLE}>
            <div className="flex flex-col h-full box-border">{cardContent}</div>
          </GlassReflection>
          <GlassContactLight variant="full" />
        </div>
      </div>
    </div>
  );
};

const ProcessSection = () => {
  const [isDesktop, setIsDesktop] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Línea medida en píxeles reales (no %), tomada del centro de los círculos
  // 1 y 4 vía getBoundingClientRect. Esto la ancla de forma exacta sin
  // depender de asumir el ancho de columnas del grid (ver nota de la v.
  // anterior: un SVG con % + viewBox ambiguo desalineaba la línea de los
  // círculos reales). Funciona igual en fila (desktop) o columna (mobile):
  // la dirección del vector se calcula solo, sin ramas por orientación.
  const [line, setLine] = useState(null);
  const containerRef = useRef(null);
  const circleRefs = useRef([]);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 860px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setIsDesktop(mqDesktop.matches);
      setReducedMotion(mqReduced.matches);
    };
    update();
    mqDesktop.addEventListener("change", update);
    mqReduced.addEventListener("change", update);
    return () => {
      mqDesktop.removeEventListener("change", update);
      mqReduced.removeEventListener("change", update);
    };
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const first = circleRefs.current[0];
    const last = circleRefs.current[steps.length - 1];
    if (!container || !first || !last) return;
    // Guarda contra medir mientras el círculo 1 o el 4 todavía están en su
    // estado oculto de data-reveal (translateY(24px) — ver particleReveal.js):
    // eso pasaba en una carrera real con el useLayoutEffect de isDesktop de
    // acá abajo, que puede re-disparar measure() ANTES de que
    // initParticleReveal termine de asentar la posición final. Sin esta
    // guarda, esa lectura intermedia quedaba pegada como "final" porque
    // nada la volvía a corregir (el flag de una sola medición por tarjeta
    // evita justamente que se re-mida en cada reingreso).
    const firstWrap = first.closest("[data-reveal]");
    const lastWrap = last.closest("[data-reveal]");
    if ((firstWrap && firstWrap.dataset.revealed === "false") || (lastWrap && lastWrap.dataset.revealed === "false")) {
      return;
    }
    const cRect = container.getBoundingClientRect();
    const r1 = first.getBoundingClientRect();
    const r2 = last.getBoundingClientRect();
    setLine({
      x1: r1.left + r1.width / 2 - cRect.left,
      y1: r1.top + r1.height / 2 - cRect.top,
      x2: r2.left + r2.width / 2 - cRect.left,
      y2: r2.top + r2.height / 2 - cRect.top,
      w: cRect.width,
      h: cRect.height,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, isDesktop]);

  // Vector unitario a lo largo de la línea (centro círculo 1 -> centro
  // círculo 4). Sirve tanto para la fila horizontal de desktop como para la
  // columna vertical de mobile sin bifurcar lógica por orientación.
  let beamGeom = null;
  if (line) {
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const beamLen = length * BEAM_FRACTION;
    const travel = length + 2 * beamLen;
    beamGeom = {
      length,
      x1g: line.x1 - ux * beamLen,
      y1g: line.y1 - uy * beamLen,
      x2g: line.x1,
      y2g: line.y1,
      toX: ux * travel,
      toY: uy * travel,
    };
  }

  return (
    <section id="procesos" className="relative overflow-hidden py-28 px-6" style={{ scrollMarginTop: 80 }}>
      <SectionBackdrop variant="grid" vignette={1} />
      <AmbientParticles count={14} seed={4000} />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16" data-reveal>
          <h2 className="text-4xl font-extrabold text-white mb-3" style={{ textShadow: "0 0 28px rgba(0,255,255,0.35)" }}>
            Nuestro Proceso
          </h2>
          <p className="text-gray-400 text-lg">De la idea al lanzamiento, con vos en cada paso.</p>
        </div>

        <div className="relative" ref={containerRef}>
          {/* Línea del timeline: un único trazo del centro del círculo 1 al
              centro del círculo 4, medido en píxeles reales (ver `measure`).
              viewBox = tamaño real del contenedor en px, así 1 unidad = 1px
              y no hay escalado que desalinee el trazo (la escala es 1:1). */}
          {line && line.w > 0 && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: "100%", height: "100%", overflow: "visible" }}
              viewBox={`0 0 ${line.w} ${line.h}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="proc-beam-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1={beamGeom.x1g}
                  y1={beamGeom.y1g}
                  x2={beamGeom.x2g}
                  y2={beamGeom.y2g}
                >
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
                  <stop offset="20%" stopColor="#2563EB" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#38BDF8" stopOpacity="1" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="55%" stopColor="#38BDF8" stopOpacity="1" />
                  <stop offset="80%" stopColor="#2563EB" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  {!reducedMotion && (
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      values={`0,0; ${beamGeom.toX},${beamGeom.toY}`}
                      dur={BEAM_DURATION}
                      repeatCount="indefinite"
                    />
                  )}
                </linearGradient>
              </defs>

              {/* Base: trazo continuo, sin segmentos sueltos antes del 1 ni
                  después del 4. */}
              <line
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="rgba(56,189,248,0.25)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Haz de luz: mismo trazo, pintado con el gradiente animado
                  encima. spreadMethod="pad" (default) deja el resto del
                  trazo transparente. */}
              {!reducedMotion && (
                <line
                  x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="url(#proc-beam-gradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          )}
          <div
            className="relative grid gap-6"
            style={{ gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "1fr" }}
          >
            {steps.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                index={i}
                circleRef={(el) => (circleRefs.current[i] = el)}
                onSettled={measure}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
