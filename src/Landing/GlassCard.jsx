import React from "react";

// Mismo generador pseudoaleatorio determinístico que Landing/AmbientParticles.jsx.
const rand = (seed) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

const supportsSvgFilters =
  typeof window !== "undefined" && "SVGFETurbulenceElement" in window;

/**
 * Filtros SVG de desintegración (feTurbulence + feDisplacementMap) para un
 * carrusel de N tarjetas. Cada `<animate id="{prefix}-anim-{i}">` arranca en
 * "indefinite" y lo dispara `useMaterialize` (por índice, con stagger) al
 * entrar en viewport. El pulso de hover sobre la tarjeta activa es 100%
 * declarativo: `begin="{prefix}-card-{i}.mouseover"` referencia el id del
 * elemento HTML de esa tarjeta, sin JS.
 */
export function GlassDisintegrationDefs({ prefix, count, activeIndex, disintegration = "full" }) {
  if (disintegration === "off" || !supportsSvgFilters) return null;
  const fromScale = disintegration === "subtle" ? 30 : 80;
  const pulseScale = disintegration === "subtle" ? 6 : 14;
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {Array.from({ length: count }, (_, i) => (
          <filter key={i} id={`${prefix}-diss-${i}`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed={i * 7 + 3} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale={fromScale}>
              <animate
                id={`${prefix}-anim-${i}`}
                attributeName="scale"
                begin="indefinite"
                dur="900ms"
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.16 1 0.3 1"
                values={`${fromScale};0`}
              />
              {i === activeIndex && (
                <animate
                  attributeName="scale"
                  begin={`${prefix}-card-${i}.mouseover`}
                  dur="700ms"
                  fill="freeze"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.3 0 0.6 1;0.3 0 0.6 1"
                  values={`0;${pulseScale};0`}
                />
              )}
            </feDisplacementMap>
          </filter>
        ))}
      </defs>
    </svg>
  );
}

export function glassFilterUrl(prefix, index, disintegration = "full") {
  if (disintegration === "off" || !supportsSvgFilters) return undefined;
  // Bajo reduced-motion, useMaterialize nunca dispara el <animate> que lleva
  // `scale` a 0 (queda en su valor inicial, ~80) — sin este chequeo el
  // filtro se aplicaría "congelado" al máximo de distorsión para siempre.
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
  return `url(#${prefix}-diss-${index})`;
}

/** Partículas blancas que "reagrupan" la tarjeta durante la materialización. */
export function GlassParticles({ seed, count = 10 }) {
  const particles = Array.from({ length: count }, (_, p) => {
    const ang = rand(seed * 31 + p * 7) * Math.PI * 2;
    const rad = 60 + rand(seed * 17 + p * 11) * 90;
    return {
      cx: `${50 + rand(seed * 3 + p) * 96 - 48}%`,
      cy: `${50 + rand(seed * 5 + p) * 96 - 48}%`,
      sz: `${2 + rand(seed * 9 + p) * 3}px`,
      dx: `${Math.cos(ang) * rad}px`,
      dy: `${Math.sin(ang) * rad}px`,
      delay: p * 18,
    };
  });
  return (
    <div className="mz-particles" aria-hidden="true">
      {particles.map((p, pi) => (
        <span
          key={pi}
          className="mz-particle"
          style={{ "--cx": p.cx, "--cy": p.cy, "--sz": p.sz, "--dx": p.dx, "--dy": p.dy, "--pdelay": `${p.delay}ms` }}
        />
      ))}
    </div>
  );
}

/**
 * Reflejo en la base: duplicado completo de la tarjeta (mismo `children` que
 * la cara real: borde, glow, ícono, título, texto), espejado, comprimido y
 * "acostado" en perspectiva (ver `.ds-glass-reflection` en designV2.css para
 * la matemática del transform). Puramente decorativo: `pointer-events:none`
 * + `aria-hidden`, no duplica listeners ni estado. Hereda `--edge`
 * (proximidad al centro) del `[data-cf-card]` ancestro, así las tarjetas
 * laterales quedan con reflejo más tenue automáticamente — con `full`,
 * `--refl-op` está calibrado para que a edge=1 (tarjeta central del
 * carrusel) el reflejo renderizado sea exactamente 0.35, y a edge≈0.25
 * (tarjeta lateral inmediata) caiga solo a ~0.15, sin necesitar una
 * variante separada para las laterales.
 *
 * @param {'off'|'subtle'|'full'|'grid'} [variant]
 *   - full: tarjeta central de carrusel (Servicios/Precios/Rubros) — 0.35 a edge=1.
 *   - grid: tarjetas de grilla y paneles estáticos (Proyectos, Proceso,
 *     Contacto, Asistente) — calibrado para ≈0.25 al --edge de reposo (0.4)
 *     de esas secciones, ver REST_EDGE en cada componente.
 *   - subtle: reflejos puntuales más tenues (0.15 fijo, sin depender de edge).
 * @param {object} [sizeStyle] mismo padding/aspectRatio/minHeight que la cara real
 */
export function GlassReflection({ variant = "full", sizeStyle, children }) {
  if (variant === "off") return null;
  const baseOpacity = { subtle: 0.15, full: 0.35, grid: 0.47 }[variant] ?? 0.35;
  return (
    <div
      className="ds-glass-face ds-glass-reflection"
      aria-hidden="true"
      // `inert` saca del orden de tabulación a los elementos focusables
      // duplicados (p. ej. el botón "Consultar por WhatsApp"), además de
      // ocultarlos de lectores de pantalla; aria-hidden queda como refuerzo.
      inert={true}
      style={{ ...sizeStyle, "--refl-op": baseOpacity }}
    >
      {/* El contorno (borde/glow/fondo de vidrio, heredados de
          .ds-glass-face) debe seguir leyéndose; el CONTENIDO (ícono, texto,
          chips, bullets) va extra atenuado para que no se lea como texto
          invertido — ver .ds-reflection-content en designV2.css. */}
      <div className="ds-reflection-content">{children}</div>
    </div>
  );
}

/** Elipse difusa donde la tarjeta "toca" el piso (remata el contacto visual). */
export function GlassContactLight({ variant = "full" }) {
  if (variant === "off") return null;
  return <div className="ds-contact-light" aria-hidden="true" />;
}

/** Oscurecimiento sutil de la "superficie" bajo la tarjeta: le da al reflejo
 * algo sobre lo que apoyarse en vez de quedar flotando en el vacío. Debe
 * declararse ANTES que <GlassReflection> en el JSX para quedar detrás. */
export function GlassFloor({ variant = "full" }) {
  if (variant === "off") return null;
  return <div className="ds-glass-floor" aria-hidden="true" />;
}
