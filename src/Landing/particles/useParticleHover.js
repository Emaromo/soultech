import { useEffect, useRef } from "react";
import { emitBurst } from "./particleEngine";

const VARIANTS = {
  card: { count: 11, spread: [20, 40], edgeBias: "perimeter" },
  button: { count: 7, spread: [16, 30], edgeBias: "sides" },
  icon: { count: 6, spread: [14, 26], edgeBias: "perimeter" },
};

const DEFAULT_COLORS = ["#38BDF8", "#FFFFFF"];

/** Inserta (una sola vez) el <span> del shine-sweep dentro del botón y lo
 * reproduce. El elemento debe tener position:relative + overflow:hidden
 * (.ds-wa-btn y .ds-liquid-glass ya lo tienen). */
const playButtonShine = (el) => {
  let shine = el.querySelector(":scope > .ds-btn-shine");
  if (!shine) {
    shine = document.createElement("span");
    shine.className = "ds-btn-shine";
    shine.setAttribute("aria-hidden", "true");
    el.appendChild(shine);
  }
  shine.classList.remove("is-playing");
  // Fuerza reflow para poder reiniciar la animación si se re-dispara.
  // eslint-disable-next-line no-unused-expressions
  shine.offsetWidth;
  shine.classList.add("is-playing");
};

/**
 * Ráfaga de partículas (una sola vez por entrada del puntero) sobre el
 * elemento referenciado por `ref`. No toca estilos del elemento — el
 * acompañamiento visual (elevación, glow de borde) vive en CSS puro
 * (`:hover`/`:focus-visible`), esto solo dispara el shimmer del canvas
 * compartido.
 *
 * Solo se activa con `(hover: hover) and (pointer: fine)`, sin
 * prefers-reduced-motion, y con navigator.hardwareConcurrency > 4 — en
 * cualquier otro caso el hook queda inerte (el elemento conserva su
 * cambio de borde/elevación por CSS, simplemente sin partículas).
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @param {{variant?: 'card'|'button'|'icon', count?: number, colors?: string[], disabled?: boolean}} [options]
 */
export default function useParticleHover(ref, { variant = "card", count, colors, disabled = false } = {}) {
  const willChangeRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return undefined;

    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;

    let hasEmitted = false;

    const setWillChange = (on) => {
      if (on === willChangeRef.current) return;
      willChangeRef.current = on;
      el.style.willChange = on ? "transform, box-shadow" : "auto";
    };

    const onEnter = () => {
      setWillChange(true);
      if (hasEmitted || !mqHover.matches || mqReduced.matches || lowPower) return;
      hasEmitted = true;
      const cfg = VARIANTS[variant] || VARIANTS.card;
      emitBurst(el.getBoundingClientRect(), {
        count: count ?? cfg.count,
        colors: colors ?? DEFAULT_COLORS,
        spread: cfg.spread,
        edgeBias: cfg.edgeBias,
      });
      if (variant === "button") playButtonShine(el);
    };
    const onLeave = () => { hasEmitted = false; };
    const onTransitionEnd = (e) => { if (e.target === el) setWillChange(false); };

    // A propósito NO se dispara en focus/blur: el foco por teclado tiene su
    // propio tratamiento (borde cian + glow, puro CSS `:focus-visible`), sin
    // partículas — ráfagas en cada Tab serían ruido, no una mejora.
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("transitionend", onTransitionEnd);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [ref, variant, count, colors, disabled]);
}
