import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Play,
  Pause,
  Stethoscope,
  ShoppingBag,
  Dumbbell,
  Building2,
  Scissors,
  UtensilsCrossed,
} from "lucide-react";
import { GlassReflection, GlassContactLight, GlassFloor } from "./GlassCard";
import { CARD_PADDING, cardWidthFor, cardAspectRatioFor, cardGapMultFor, cardTrackHeightFor } from "./cardTokens";
import { buildWhatsAppHref } from "./whatsappConfig";
import { emitBurst } from "./particles/particleEngine";

/**
 * IndustryGrid — carrusel "¿cuál es tu rubro?". Motor coverflow 3D propio
 * (NO usa el useCoverflow compartido por Servicios/Precios, a propósito:
 * necesita profundidad/blur/opacidad más agresivos para que las laterales no
 * "lean por encima" de la central, y así no arriesgamos esos otros
 * carruseles). Mismo patrón de drag/inercia/tilt, adaptado.
 *
 * El CONTENEDOR de la tarjeta (vidrio, borde, glow, reflejo) es exactamente
 * el mismo sistema compartido que usan ServicesSection/PricingSection
 * (`.ds-glass-face` + `GlassReflection`/`GlassContactLight`/`GlassFloor` de
 * GlassCard.jsx / designV2.css) — a propósito, para que las tres secciones
 * no vuelvan a divergir visualmente. Tamaño/ancho/gap/alto de tarjeta salen
 * de cardTokens.js (compartido con ServicesSection, misma razón). Este
 * archivo sólo aporta el contenido (ícono/título/eyebrow/descripción/
 * pastilla/CTA de WhatsApp) y el motor del carrusel.
 *
 * El único elemento clicable real de la tarjeta es el botón de WhatsApp
 * (`buildWhatsAppHref` de whatsappConfig.js, mensaje pre-cargado por rubro);
 * la tarjeta en sí ya no es un link — evita anidar un <a> dentro de otro.
 * Sólo queda activo/clicable en la tarjeta central (`.ind-card--active`);
 * en las demás queda atenuado y con pointer-events:none.
 *
 * Pensado como bloque reutilizable para un builder de landing pages (props
 * serializables a JSON: `icon` es un nombre de string, no un componente).
 *
 * @typedef {Object} IndustryItem
 * @property {string} id
 * @property {keyof typeof ICONS} icon
 * @property {string} title
 * @property {string} eyebrow
 * @property {string} description
 * @property {string} pill
 * @property {string} whatsappMessage mensaje pre-cargado para el botón de WhatsApp
 *
 * @typedef {Object} IndustryGridProps
 * @property {string} title
 * @property {string} [subtitle]
 * @property {IndustryItem[]} items
 * @property {boolean} [loop] circular infinito (default true)
 * @property {boolean} [autoplay] rotación automática (default true)
 * @property {number} [autoplayDelayMs] ms por tarjeta (default 3500)
 * @property {boolean} [pauseOnHover] pausar autoplay al pasar el mouse (default true)
 */

const ICONS = { Stethoscope, ShoppingBag, Dumbbell, Building2, Scissors, UtensilsCrossed };

const GRACE_MS = 2000;

// Distancia circular con signo, misma lógica que useCoverflow.js (motor
// hermano de Servicios/Precios) para que el loop infinito se comporte igual
// en los tres carruseles.
const wrapDelta = (a, n) => {
  let d = ((a % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
};

let styleInjected = false;
function ensureStylesInjected() {
  if (styleInjected || typeof document === "undefined") return;
  styleInjected = true;
  const style = document.createElement("style");
  style.id = "industry-grid-styles";
  style.textContent = CSS_TEXT;
  document.head.appendChild(style);
}

const CSS_TEXT = `
.ind-halo {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 55% 50% at 50% 42%, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0.05) 45%, transparent 72%);
  filter: blur(50px);
}
@media (max-width: 640px) {
  .ind-halo { filter: blur(25px); }
}
/* Sin overflow-x/y en .ind-track a propósito: si un eje es no-visible (ej.
   hidden) y el otro queda en 'visible' -aunque se declare explícito-, el
   navegador computa igual el otro eje como 'auto' (quirk real de CSS
   Overflow). Con el contenedor de altura fija y tarjetas/reflejos que se
   proyectan más abajo, eso disparaba un scrollbar vertical suelto en el
   medio de la sección. .ds-glass-face ya recorta su propio contenido con
   overflow:hidden — el contenedor externo no necesita recortar nada. */

/* El contenedor de vidrio (fondo, borde, glow, reflejo, radios, sombra) es
   .ds-glass-face + GlassReflection/GlassContactLight/GlassFloor, compartido
   con Servicios/Precios (ver designV2.css). Acá sólo el contenido — la
   respuesta al hover (tilt, glare, partículas) la da el motor del carrusel
   más abajo, igual que en Servicios/Precios; no hay :hover propio acá a
   propósito, para no duplicar el sistema. */
.ind-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  text-decoration: none;
  color: inherit;
}

.ind-icon {
  width: 48px; height: 48px; border-radius: 12px; margin-bottom: 16px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.35);
  color: #38BDF8; box-shadow: 0 0 18px rgba(56,189,248,0.18);
}
.ind-title { color: #fff; font-weight: 600; font-size: 21px; line-height: 1.25; margin: 0 0 6px; }
.ind-eyebrow { color: #38BDF8; opacity: 0.8; text-transform: uppercase; letter-spacing: .15em; font-size: 11px; font-weight: 600; margin: 0 0 10px; }
.ind-desc {
  color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 0 0 16px;
  /* min-height reserva 3 líneas siempre, aunque el texto sea más corto, así
     la pastilla y el botón quedan alineados entre tarjetas con distinto
     largo de descripción. */
  min-height: 4.8em;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.ind-pill {
  align-self: flex-start; font-size: 12px; color: #fff; font-weight: 500;
  padding: 5px 12px; border-radius: 9999px; margin-bottom: 18px;
  border: 1px solid rgba(59,130,246,0.4); background: rgba(37,99,235,0.12);
}
/* CTA de WhatsApp: siempre anclado abajo (margin-top:auto en un padre
   flex-column). Sólo interactivo en la tarjeta central — en el resto queda
   atenuado y sin pointer-events (ver .ind-card--active más abajo). */
.ind-wa-btn {
  margin-top: auto;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; box-sizing: border-box;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  color: #fff; font-weight: 600; font-size: 14px;
  text-decoration: none;
  opacity: 0.4;
  pointer-events: none;
  transition: transform .25s ease, filter .25s ease, box-shadow .25s ease, opacity .25s ease;
}
.ind-card--active .ind-wa-btn {
  opacity: 1;
  pointer-events: auto;
}
.ind-wa-btn:hover, .ind-wa-btn:focus-visible {
  filter: brightness(1.12);
  transform: translateY(-2px);
  box-shadow: 0 0 24px rgba(37,99,235,0.5);
}
.ind-wa-btn:focus-visible { outline: 2px solid #38BDF8; outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .ind-wa-btn { transition: filter .25s ease, opacity .25s ease; }
  .ind-wa-btn:hover, .ind-wa-btn:focus-visible { transform: none; }
}
`;

/**
 * @param {IndustryGridProps} props
 */
export default function IndustryGrid({
  title,
  subtitle,
  items,
  loop = true,
  autoplay = true,
  autoplayDelayMs = 3500,
  pauseOnHover = true,
}) {
  const N = items.length;
  const initial = Math.floor((N - 1) / 2);

  const [node, setNode] = useState(null);
  const [activeIndex, setActiveIndex] = useState(initial);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [isPlaying, setIsPlaying] = useState(() => autoplay && !reducedMotion);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = (el) => setNode(el);
  const cardEls = useRef([]);
  const engineRef = useRef(null);

  useEffect(() => {
    ensureStylesInjected();
    const mqRm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const update = () => {
      setReducedMotion(mqRm.matches);
      setIsMobile(mqMobile.matches);
    };
    update();
    mqRm.addEventListener("change", update);
    mqMobile.addEventListener("change", update);
    return () => {
      mqRm.removeEventListener("change", update);
      mqMobile.removeEventListener("change", update);
    };
  }, []);

  // Motor del carrusel: manipula transform/opacity/filter/CSS vars directo
  // sobre los nodos en cada frame (nunca useState) por performance; sólo
  // re-renderiza cuando cambia el índice activo (dots/aria).
  useEffect(() => {
    const root = node;
    if (!root || N === 0) return undefined;
    const cards = cardEls.current.slice(0, N);
    if (cards.some((c) => !c)) return undefined;
    // Cacheado una sola vez (no en cada frame de render()): con autoplay
    // continuo el loop corre indefinidamente mientras el carrusel está en
    // pantalla, así que un querySelector por tarjeta por frame sí pesa.
    const cardInnerEls = cards.map((c) => c.querySelector('.ind-card'));
    const shineEls = cards.map((c) => c.querySelector('[data-cf-shine]'));

    const rm = reducedMotion;
    // hover:hover + pointer:fine = mouse/trackpad real, nunca táctil. Gatea
    // tilt+glare+partículas por igual (ver mismo patrón en useCoverflow.js).
    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const particlesOk = hoverCapable && !rm && (navigator.hardwareConcurrency || 8) > 4;
    const eng = {
      pos: initial, target: initial, vel: 0, raf: 0, lastFrameAt: 0,
      dragging: false, moved: false, tiltCard: -1, tiltX: 0, tiltY: 0,
      userPaused: !autoplay || rm, pointerInside: false, hasFocus: false,
      inViewport: true, lastInteractionAt: -Infinity, lastRenderedPos: null,
    };
    engineRef.current = eng;

    // gapMult sale de cardTokens.js (compartido con ServicesSection) para
    // que la separación horizontal entre tarjetas sea idéntica en ambos
    // carruseles.
    const gapMult = cardGapMultFor(isMobile);
    const gap = () => Math.max(100, (cards[0].offsetWidth || 230) * gapMult);

    // Mismos puntos de control que useCoverflow.js: 1 en el centro, ~0.3 en
    // adyacentes (ad~1), ~0.12 en lejanas (ad~2), 0 desde ad=3.
    const opacityFor = (ad) => {
      if (ad <= 1) return 1 - ad * 0.7;
      if (ad <= 2) return 0.3 - (ad - 1) * 0.18;
      return Math.max(0, 0.12 - (ad - 2) * 0.12);
    };

    // Índice 0..N-1 normalizado (circular si loop) para dots/aria/comparar.
    const wrapIdx = (v) => (loop
      ? ((Math.round(v) % N) + N) % N
      : Math.max(0, Math.min(N - 1, Math.round(v))));

    const syncActiveIndex = () => {
      const norm = wrapIdx(eng.target);
      setActiveIndex((prev) => (prev !== norm ? norm : prev));
    };

    let ariaLiveIsOff = null;
    const syncAriaLive = (autoplaying) => {
      if (ariaLiveIsOff === autoplaying) return;
      ariaLiveIsOff = autoplaying;
      root.setAttribute("aria-live", autoplaying ? "off" : "polite");
    };

    const render = () => {
      const g = gap();
      for (let i = 0; i < N; i++) {
        const d = loop ? wrapDelta(i - eng.pos, N) : (i - eng.pos);
        const ad = Math.abs(d);
        const tilt = i === eng.tiltCard;
        // Sólo en móvil: menos rotación y menos translateZ que en desktop —
        // la perspectiva agresiva de desktop (rotY hasta 40°, z hasta -380
        // por unidad de distancia) empuja a las laterales fuera del cuadro
        // en una pantalla angosta. Desktop queda intacto.
        const rotYMax = isMobile ? 16 : 40;
        const rotYMult = isMobile ? 13 : 34;
        const zMult = isMobile ? -150 : -380;
        const rotY = Math.max(-rotYMax, Math.min(rotYMax, -d * rotYMult)) + (tilt ? eng.tiltY : 0);
        const rotX = tilt ? eng.tiltX : 0;
        // Más translateZ negativo que un coverflow estándar: separa mucho
        // las laterales en profundidad para que dejen de pisar a la central.
        const z = ad * zMult + (tilt ? 40 : 0);
        const sc = Math.max(0.6, 1 - ad * 0.18);
        // Blur en desktop (hasta 6px en las lejanas); en móvil se ELIMINA
        // del todo (ver misma nota en useCoverflow.js).
        const blurPx = isMobile ? 0 : Math.min(6, ad * 3);
        const edge = Math.max(0, 1 - ad);
        const el = cards[i];
        // Transform redondeado a 1 decimal en los 5 componentes (ver misma
        // nota en useCoverflow.js).
        el.style.transform = `translate(-50%,-50%) translateX(${(d * g).toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg) scale(${sc.toFixed(1)})`;
        el.style.opacity = String(+opacityFor(ad).toFixed(3));
        el.style.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : "";
        el.style.zIndex = String(200 - Math.round(ad * 15));
        el.style.pointerEvents = ad > 1.1 ? "none" : "auto";
        el.style.visibility = ad >= 3 ? "hidden" : "visible";
        // Sólo en móvil: display:none (no sólo visibility:hidden) para lo
        // que no sea central + 2 adyacentes (ver misma nota en useCoverflow.js
        // sobre por qué esta asignación es incondicional, no "if (isMobile)").
        el.style.display = (isMobile && ad >= 1.5) ? "none" : "";
        el.setAttribute("aria-hidden", ad < 0.5 ? "false" : "true");
        el.style.setProperty("--edge", edge.toFixed(3));
        const card = cardInnerEls[i];
        if (card) card.classList.toggle("ind-card--active", ad < 0.5);
        const sh = shineEls[i];
        if (sh) sh.style.opacity = !rm && ad < 0.25 ? "1" : "0";
      }
    };

    const shouldAutoplay = (now) => autoplay && !rm && !eng.userPaused && !eng.dragging
      && !(pauseOnHover && eng.pointerInside) && !eng.hasFocus
      && !document.hidden && eng.inViewport
      && (now - eng.lastInteractionAt) >= GRACE_MS;

    // Único rAF loop del motor: además de la física de settle (spring hacia
    // eng.target), cuando corresponde autoplay hace derivar eng.target de
    // forma continua (no saltos de setInterval) — eng.pos lo persigue con el
    // MISMO spring que usa la navegación manual, así se lee igual.
    const ensureLoop = () => {
      if (eng.raf) return;
      eng.lastFrameAt = performance.now();
      const step = () => {
        eng.raf = 0;
        if (eng.dragging || !root.isConnected) return;
        const now = performance.now();
        const rawDt = now - eng.lastFrameAt;
        // dt (clamped) alimenta solo el spring de settle, para que no
        // "salte" tras un frame largo; el drift de autoplay usa rawDt sin
        // recortar, así el ritmo de ~3.5s/tarjeta se cumple en tiempo real
        // aunque el rAF venga más lento de lo normal (pestaña ocupada,
        // pantalla de bajo refresh, etc.).
        const dt = Math.min(50, rawDt);
        eng.lastFrameAt = now;

        const autoplaying = shouldAutoplay(now);
        syncAriaLive(autoplaying);
        if (autoplaying) {
          eng.target += rawDt / autoplayDelayMs;
        } else if (Math.abs(eng.target - Math.round(eng.target)) > 1e-6) {
          eng.target = Math.round(eng.target);
        }

        // k/damp están calibrados por-frame asumiendo ~60fps (16.6667ms);
        // se escalan por dt para que el settle y el autoplay se vean igual
        // de rápido en pantallas/tabs con otro refresh rate o con el rAF
        // momentáneamente más lento (si no, con menos frames por segundo la
        // rotación "1 tarjeta cada 3.5s" se percibiría más lenta).
        const fs = dt / 16.6667;
        const k = (rm ? 0.3 : 0.09) * fs, damp = Math.pow(rm ? 0.55 : 0.8, fs);
        eng.vel = (eng.vel + (eng.target - eng.pos) * k) * damp;
        eng.pos += eng.vel * fs;

        if (!autoplaying && Math.abs(eng.vel) < 0.0008 && Math.abs(eng.target - eng.pos) < 0.0008) {
          eng.pos = eng.target;
          render();
          eng.lastRenderedPos = eng.pos;
          syncActiveIndex();
          return;
        }
        // Ver misma nota en useCoverflow.js: no reescribir estilos si el
        // cambio de posición es imperceptible (<0.001).
        if (eng.lastRenderedPos === null || Math.abs(eng.pos - eng.lastRenderedPos) >= 0.001) {
          render();
          eng.lastRenderedPos = eng.pos;
        }
        syncActiveIndex();
        eng.raf = requestAnimationFrame(step);
      };
      eng.raf = requestAnimationFrame(step);
    };

    let graceTimer = null;
    const markInteraction = () => {
      eng.lastInteractionAt = performance.now();
      if (graceTimer) clearTimeout(graceTimer);
      graceTimer = setTimeout(() => { graceTimer = null; ensureLoop(); }, GRACE_MS + 30);
    };

    const settleTo = (targetPos) => {
      markInteraction();
      eng.target = targetPos;
      syncActiveIndex();
      ensureLoop();
    };

    const goTo = (i) => {
      settleTo(loop ? eng.pos + wrapDelta(i - eng.pos, N) : Math.max(0, Math.min(N - 1, Math.round(i))));
    };
    eng.goTo = goTo;

    const stepBy = (dir) => {
      settleTo(loop ? eng.target + dir : Math.max(0, Math.min(N - 1, eng.target + dir)));
    };
    eng.next = () => stepBy(1);
    eng.prev = () => stepBy(-1);

    eng.setUserPaused = (paused) => {
      eng.userPaused = paused;
      setIsPlaying(!paused);
      if (!paused) { eng.lastInteractionAt = -Infinity; ensureLoop(); }
    };
    eng.togglePlay = () => eng.setUserPaused(!eng.userPaused);

    let lastX = 0, lastT = 0, vfilt = 0;

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      eng.dragging = true; eng.moved = false; vfilt = 0;
      markInteraction();
      if (eng.raf) { cancelAnimationFrame(eng.raf); eng.raf = 0; }
      lastX = e.clientX; lastT = performance.now();
      root.style.cursor = "grabbing";
      try { root.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    };

    const onPointerMove = (e) => {
      if (eng.dragging) {
        const now = performance.now(), dt = Math.max(1, now - lastT);
        const dpos = -(e.clientX - lastX) / gap();
        if (Math.abs(e.clientX - lastX) > 3) eng.moved = true;
        eng.pos = loop ? (eng.pos + dpos) : Math.max(-0.35, Math.min(N - 0.65, eng.pos + dpos));
        vfilt = vfilt * 0.7 + (dpos / dt * 16) * 0.3;
        lastX = e.clientX; lastT = now;
        eng.tiltCard = -1;
        render();
      } else if (!rm && hoverCapable) {
        const ci = wrapIdx(eng.pos);
        const c = cards[ci];
        if (!c) return;
        const r = c.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        const glare = c.querySelector("[data-cf-glare]");
        if (inside) {
          if (particlesOk && eng.tiltCard !== ci) {
            emitBurst(r, { count: 11, spread: [20, 40], edgeBias: "perimeter", colors: ['#FFFFFF', 'rgba(255,255,255,0.85)'] });
          }
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          eng.tiltCard = ci; eng.tiltX = -py * 8; eng.tiltY = px * 10;
          if (glare) {
            glare.style.opacity = "1";
            glare.style.background = `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, rgba(200,230,255,0.5), rgba(200,230,255,0) 60%)`;
          }
        } else {
          if (eng.tiltCard === -1) return;
          eng.tiltCard = -1;
          if (glare) glare.style.opacity = "0";
        }
        if (!eng.raf) render();
      }
    };

    const endDrag = () => {
      if (!eng.dragging) return;
      eng.dragging = false;
      root.style.cursor = "grab";
      eng.vel = vfilt;
      settleTo(eng.pos + vfilt * 6);
    };

    const onPointerLeave = () => {
      if (eng.dragging) { endDrag(); return; }
      if (eng.tiltCard !== -1) {
        const glare = cards[eng.tiltCard] && cards[eng.tiltCard].querySelector("[data-cf-glare]");
        if (glare) glare.style.opacity = "0";
        eng.tiltCard = -1;
        if (!eng.raf) render();
      }
    };

    // Pausa/reanudación de autoplay por hover, foco y visibilidad — separado
    // del tilt/glare de arriba a propósito, así no se toca esa lógica ya
    // afinada. "Sobre el carrusel" = sobre el área del track completo.
    const onPointerEnterRoot = () => {
      eng.pointerInside = true;
      markInteraction();
    };
    const onPointerLeaveRoot = () => {
      eng.pointerInside = false;
      markInteraction();
    };
    const onFocusIn = () => {
      eng.hasFocus = true;
      markInteraction();
    };
    const onFocusOut = (e) => {
      if (root.contains(e.relatedTarget)) return;
      eng.hasFocus = false;
      markInteraction();
    };

    const onClick = (e) => {
      if (eng.moved) { e.preventDefault(); e.stopPropagation(); eng.moved = false; return; }
      const card = e.target.closest ? e.target.closest("[data-cf-card]") : null;
      if (card) {
        const i = cards.indexOf(card);
        const cur = wrapIdx(eng.target);
        if (i !== -1 && i !== cur) { e.preventDefault(); e.stopPropagation(); goTo(i); }
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); eng.prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); eng.next(); }
    };

    const onDragStart = (e) => e.preventDefault();
    const onResize = () => render();

    const onVisibilityChange = () => {
      if (!document.hidden) ensureLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let io = null;
    if ("IntersectionObserver" in window) {
      // rootMargin generoso (ver misma nota en useCoverflow.js).
      io = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        eng.inViewport = entry.isIntersecting;
        if (eng.inViewport) ensureLoop();
      }, { threshold: 0.2, rootMargin: "200px" });
      io.observe(root);
    }

    root.style.cursor = "grab";
    root.setAttribute("aria-live", "polite");
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", endDrag);
    root.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("pointerenter", onPointerEnterRoot);
    root.addEventListener("pointerleave", onPointerLeaveRoot);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    root.addEventListener("click", onClick, true);
    root.addEventListener("keydown", onKeyDown);
    root.addEventListener("dragstart", onDragStart);
    window.addEventListener("resize", onResize);

    render();
    eng.lastRenderedPos = eng.pos;
    syncActiveIndex();
    if (!eng.userPaused) ensureLoop();

    return () => {
      if (eng.raf) cancelAnimationFrame(eng.raf);
      if (graceTimer) clearTimeout(graceTimer);
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", endDrag);
      root.removeEventListener("pointercancel", endDrag);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("pointerenter", onPointerEnterRoot);
      root.removeEventListener("pointerleave", onPointerLeaveRoot);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("click", onClick, true);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("resize", onResize);
    };
  }, [node, N, initial, reducedMotion, isMobile, loop, autoplay, autoplayDelayMs, pauseOnHover]);

  const next = () => engineRef.current?.next();
  const prev = () => engineRef.current?.prev();
  const goTo = (i) => engineRef.current?.goTo(i);
  const togglePlay = () => engineRef.current?.togglePlay();

  return (
    <div className="relative">
      <div className="ind-halo" aria-hidden="true" />
      <div className="relative">
        <div className="text-center mb-10" data-reveal>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          {subtitle && <p className="text-gray-400 text-base">{subtitle}</p>}
        </div>

        <div
          ref={containerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          tabIndex={0}
          className="ind-track relative outline-none touch-pan-y select-none"
          style={{ height: cardTrackHeightFor(isMobile), perspective: isMobile ? 1400 : 1000, transformStyle: "preserve-3d", cursor: "grab" }}
        >
          {items.map((it, i) => {
            const Icon = ICONS[it.icon];
            const faceStyle = { padding: CARD_PADDING, aspectRatio: cardAspectRatioFor(isMobile) };
            const waHref = buildWhatsAppHref(it.whatsappMessage);
            const cardVisual = (
              <>
                {Icon && (
                  <div className="ind-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                <h4 className="ind-title">{it.title}</h4>
                <p className="ind-eyebrow">{it.eyebrow}</p>
                <p className="ind-desc">{it.description}</p>
                <span className="ind-pill">{it.pill}</span>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Consultar por WhatsApp sobre ${it.title}`}
                  className="ind-wa-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                  Consultar por WhatsApp
                </a>
              </>
            );
            return (
              <div
                key={it.id}
                data-cf-card
                ref={(el) => (cardEls.current[i] = el)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${it.title}, ${i + 1} de ${N}`}
                className="absolute left-1/2 top-1/2"
                style={{ width: cardWidthFor(isMobile), willChange: "transform, opacity" }}
              >
                <div className="ds-cf-inner">
                  <article className="ds-glass-face ind-card" style={faceStyle}>
                    {cardVisual}
                    <div data-cf-glare className="absolute inset-0 opacity-0 transition-opacity duration-300" style={{ mixBlendMode: "overlay" }} />
                  </article>
                  <GlassFloor variant="full" />
                  <GlassReflection variant="full" sizeStyle={faceStyle} noContent={isMobile}>
                    {!isMobile && <div className="flex flex-col w-full h-full" style={{ boxSizing: "border-box" }}>{cardVisual}</div>}
                  </GlassReflection>
                  <GlassContactLight variant="full" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center justify-center gap-[18px] mt-10">
          <button
            onClick={prev}
            aria-label="Rubro anterior"
            className="w-11 h-11 rounded-full border text-white flex items-center justify-center shrink-0 transition-all"
            style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)" }}
          >
            <ChevronLeft className="w-[18px] h-[18px]" />
          </button>
          <div className="flex items-center gap-2.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a rubro ${i + 1} de ${N}`}
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
            aria-label="Rubro siguiente"
            className="w-11 h-11 rounded-full border text-white flex items-center justify-center shrink-0 transition-all"
            style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)" }}
          >
            <ChevronRight className="w-[18px] h-[18px]" />
          </button>
          {autoplay && !reducedMotion && (
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
  );
}
