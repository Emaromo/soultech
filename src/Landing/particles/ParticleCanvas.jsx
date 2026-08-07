import { useEffect, useRef } from "react";
import { mountEngine } from "./particleEngine";

/**
 * Canvas único y compartido para TODAS las partículas de hover de la
 * landing. Se monta una sola vez (ver Landing.jsx) — nunca crear uno por
 * tarjeta/botón, eso es lo que mata el rendimiento.
 */
const ParticleCanvas = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    return mountEngine(ref.current);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 70, pointerEvents: "none" }}
    />
  );
};

export default ParticleCanvas;
