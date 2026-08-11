import React, { useEffect, useMemo, useRef, useState } from 'react';

// Generador pseudoaleatorio determinístico (misma fórmula para toda la app,
// así cada sección tiene un patrón de partículas estable entre renders).
const rand = (seed) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

/**
 * Partículas ambientales flotantes y sutiles usadas como fondo decorativo
 * de cada sección (más discretas que las del Hero).
 */
const AmbientParticles = ({ count = 14, seed = 0 }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.round(rand(i + seed) * 100),
        size: +(1.5 + rand(i + seed + 50) * 2.8).toFixed(1),
        dur: +(11 + rand(i + seed + 100) * 16).toFixed(1),
        delay: +(rand(i + seed + 150) * 14).toFixed(1),
        alpha: +(0.1 + rand(i + seed + 200) * 0.22).toFixed(2),
        glow: Math.round(3 + rand(i + seed + 250) * 5),
      })),
    [count, seed]
  );

  // Son animaciones CSS puras (corren en el compositor, no en el hilo
  // principal) pero de todas formas siguen "vivas" fuera de pantalla si no
  // se pausan explícitamente. IntersectionObserver propio (rootMargin
  // generoso, igual criterio que los carruseles) + visibilitychange, sin
  // desmontar los nodos (así no se reinicia el ciclo al volver a verlas).
  const wrapRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    let inViewport = true;
    const update = () => setPaused(!inViewport || document.hidden);
    const io = new IntersectionObserver(
      (entries) => {
        inViewport = entries[0]?.isIntersecting ?? true;
        update();
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    const onVisibility = () => update();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: '-8px',
            borderRadius: '50%',
            background: `rgba(0,255,255,${p.alpha})`,
            boxShadow: `0 0 ${p.glow}px rgba(0,255,255,0.5)`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `dsFloatUp ${p.dur}s linear ${p.delay}s infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      ))}
    </div>
  );
};

export default AmbientParticles;
