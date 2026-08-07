import { useEffect, useRef, useState } from "react";

/**
 * Tilt 3D sutil (máx ±5°) siguiendo el puntero + glare radial que sigue el
 * cursor (mix-blend-mode: overlay, vía [data-glare] hijo) — compartido por
 * todas las tarjetas "sueltas" que no viven dentro de un carrusel coverflow
 * (esas ya tienen su propio tilt/glare en useCoverflow.js / IndustryGrid.jsx).
 * Devuelve el `ref` a poner en el elemento con `transform-style: preserve-3d`.
 */
const MAX_TILT = 5;

export default function useCardTilt(disabled) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateX(${(-py * MAX_TILT * 2).toFixed(2)}deg) rotateY(${(px * MAX_TILT * 2).toFixed(2)}deg)`;
    const glare = ref.current.querySelector("[data-glare]");
    if (glare) {
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)`;
    }
  };
  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
    const glare = ref.current.querySelector("[data-glare]");
    if (glare) glare.style.opacity = "0";
  };
  return { ref, onMouseMove, onMouseLeave };
}

/** Detecta el guard combinado que usan todas las variantes de tilt/hover:
 * puntero fino con hover real, sin reduced-motion, sin CPU limitada. */
export function useTiltDisabled() {
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const update = () => setDisabled(!mqFine.matches || mqReduced.matches || lowPower);
    update();
    mqFine.addEventListener("change", update);
    mqReduced.addEventListener("change", update);
    return () => {
      mqFine.removeEventListener("change", update);
      mqReduced.removeEventListener("change", update);
    };
  }, []);
  return disabled;
}
