import React, { useEffect, useRef } from 'react';

// Grano sutil: mismo patrón feTurbulence que ya usa HeroSection.jsx para su
// noise overlay, a opacity muy baja para cortar el banding de los
// degradados sin agregar peso (SVG inline, no imagen).
const NOISE_BG =
  "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22/></svg>')";

/**
 * Fondo fijo de todas las secciones salvo el Hero (que pinta su propio video
 * + fondo opaco encima, ocultándolo por completo por stacking normal): nodos
 * (puntos brillantes, SIN líneas conectoras entre ellos) distribuidos en una
 * grilla con oleaje senoidal y proyección en perspectiva, "cercanos"
 * brillantes y "lejanos" tenues, y un parallax suave hacia la posición del
 * mouse.
 *
 * Capas (atrás → adelante): 1) base atmosférica (radial-gradient en el
 * wrapper), 2) [el halo detrás de cada carrusel vive en ServicesSection /
 * PricingSection, no acá], 3) estos nodos, con mask-image para que se
 * desvanezcan hacia el horizonte y no compitan con los títulos, 4) grano.
 */
const Bg3DBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Fondo fijo detrás de TODA la landing: nunca sale de "viewport" por
    // scroll (es position:fixed), así que un IntersectionObserver no tiene
    // nada que pausar por posición — pero SÍ corría siempre, sin parar,
    // incluso con la pestaña en segundo plano (encontrado midiendo rAF con
    // la página scrolleada lejos de los 3 carruseles: ~28 llamadas/seg que
    // no bajaban a 0 hasta activar prefers-reduced-motion). Con la pestaña
    // oculta no hay nada que ver, así que se pausa igual que el resto.
    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const mkSprite = (core, glow) => {
      const s = 48;
      const c = document.createElement('canvas');
      c.width = s; c.height = s;
      const g = c.getContext('2d');
      const rg = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      rg.addColorStop(0, core);
      rg.addColorStop(0.3, glow);
      rg.addColorStop(1, 'rgba(0,212,255,0)');
      g.fillStyle = rg;
      g.fillRect(0, 0, s, s);
      return c;
    };
    const sprNear = mkSprite('rgba(255,255,255,1)', 'rgba(0,212,255,0.6)');
    const sprFar = mkSprite('rgba(140,200,255,0.9)', 'rgba(30,144,255,0.35)');

    // Sólo en móvil: menos nodos (menos sprites por frame = menos costo de
    // canvas2D/composición en GPUs de gama media/baja). Desktop intacto
    // (44x16=704 nodos, igual que siempre).
    const COLS = isMobile ? 26 : 44, ROWS = isMobile ? 10 : 16, FOV = 420;
    let mx = 0, my = 0, smx = 0, smy = 0;
    const onMouseMove = (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const px = new Float32Array(COLS * ROWS);
    const py = new Float32Array(COLS * ROWS);
    const pz = new Float32Array(COLS * ROWS);

    let raf = 0;
    let alive = true;

    const frame = (t) => {
      if (!alive) return;
      smx += (mx - smx) * 0.05;
      smy += (my - smy) * 0.05;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(-0.10 + smx * 0.02);
      ctx.translate(-W / 2, -H / 2);

      const T = t * 0.0009;
      const spanX = W * 1.7, horizon = H * 0.58;
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const k = j * COLS + i;
          const wx = (i / (COLS - 1) - 0.5) * spanX + smx * (34 - j * 1.6);
          const depth = j * 65;
          const wy = Math.sin(i * 0.42 + T * 2 + j * 0.35) * 30 + Math.cos(j * 0.5 + T * 1.5) * 26;
          const s = FOV / (FOV + depth);
          px[k] = W / 2 + wx * s;
          py[k] = horizon + (150 + wy + smy * 20) * s;
          pz[k] = s;
        }
      }

      // Sin líneas conectoras entre nodos a propósito: solo los puntos
      // brillantes flotando, nada de retícula/constelación.
      for (let k = 0; k < COLS * ROWS; k++) {
        const s = pz[k];
        const d = s * s * 9;
        if (d < 1.6) continue;
        ctx.globalAlpha = Math.min(1, (s - 0.35) * 1.5);
        ctx.drawImage(s > 0.8 ? sprNear : sprFar, px[k] - d / 2, py[k] - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      // prefers-reduced-motion: un solo frame estático, sin loop de rAF.
      // document.hidden: con la pestaña en segundo plano no hay nada que
      // ver, así que no seguimos dibujando (se retoma solo al volver).
      if (!reduceMotion && !document.hidden) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    raf = requestAnimationFrame(frame);

    const onVisibilityChange = () => {
      // Al volver de segundo plano, si el loop se había parado (raf===0
      // porque la última frame() salió sin re-programarse), retomarlo.
      if (!document.hidden && !reduceMotion && alive && !raf) {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        // Base atmosférica — azulado, nunca #000 puro (banding).
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #0D1526 0%, #05070D 70%)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 85%)',
          maskImage: 'linear-gradient(to top, black 0%, transparent 85%)',
        }}
      />
      {/* Grano sutil, corta el banding de los degradados. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: NOISE_BG,
          backgroundSize: '120px 120px',
        }}
      />
    </div>
  );
};

export default Bg3DBackground;
