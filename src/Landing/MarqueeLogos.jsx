import React from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiTailwindcss,
  SiDocker,
  SiFlutter,
  SiSwift,
  SiKotlin,
} from "react-icons/si";

const STACK = [
  { name: "React", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "Python", Icon: SiPython },
  { name: "React Native", Icon: SiReact },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "Tailwind", Icon: SiTailwindcss },
  { name: "Docker", Icon: SiDocker },
  { name: "Flutter", Icon: SiFlutter },
  { name: "Swift", Icon: SiSwift },
  { name: "Kotlin", Icon: SiKotlin },
];
// Duplicado para el loop visual continuo (ver .hero-marquee-track,
// dsMarquee desplaza -50% = exactamente un set). Este track queda
// aria-hidden porque está duplicado y en movimiento — el <ul> de abajo es
// la versión accesible, con cada tecnología UNA sola vez.
const track = [...STACK, ...STACK].map((t, i) => ({ ...t, key: i }));

/**
 * Franja de tecnologías con scroll infinito debajo del Hero. Label arriba,
 * marquee abajo (apilados, no en la misma fila) para que a ningún ancho el
 * texto termine superpuesto contra los logos.
 */
const MarqueeLogos = () => (
  <div style={{ padding: "0 24px 40px" }}>
    <div style={{ maxWidth: 1024, margin: "0 auto" }}>
      <p className="hero-stack-label">Nuestro stack</p>

      <div className="hero-marquee-mask">
        <div className="hero-marquee-track" aria-hidden="true">
          {track.map((t) => (
            <span key={t.key} className="hero-stack-item">
              <t.Icon className="hero-stack-icon" aria-hidden="true" />
              <span className="hero-stack-name">{t.name}</span>
            </span>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {STACK.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default MarqueeLogos;
