import React from "react";

/**
 * Capa de fondo compartida por toda la landing (excepto Hero y Footer, que
 * conservan su propio fondo): viñeta invertida (centro despejado, bordes con
 * más densidad) + un pozo de luz azul posicionado según el tipo de sección.
 * Se monta como PRIMER hijo de cada `<section>` — pinta detrás de halos,
 * partículas y contenido existentes (no los toca, no cambia su DOM).
 *
 * Un solo componente reutilizable: las variantes ajustan forma/posición del
 * pozo de luz, nunca la paleta (siempre azul #2563EB sobre densidad
 * #080F23→#050A1A — ver designV2.css para el porqué de cada color).
 *
 * @param {{ variant: 'carousel'|'grid'|'panel', intensity?: number, vignette?: number }} props
 *   intensity: 0-1, multiplica la opacidad del pozo de luz central.
 *   vignette: 0-1, multiplica la densidad de la viñeta lateral (usar valores
 *   cercanos a 1, ±0.05, para dar "respiración" entre secciones consecutivas
 *   sin que se note como cambio de color).
 */
export default function SectionBackdrop({ variant, intensity = 1, vignette = 1 }) {
  return (
    <div
      className={`sb-backdrop sb-backdrop--${variant}`}
      aria-hidden="true"
      style={{ "--sb-intensity": intensity, "--sb-vignette": vignette }}
    >
      <div className="sb-vignette" />
      <div className="sb-well" />
      <div className="sb-horizon" />
      <div className="sb-grain" />
    </div>
  );
}
