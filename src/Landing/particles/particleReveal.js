/**
 * Efecto "formación por partículas" al aparecer contenido en scroll.
 * Uso: poné data-reveal en cualquier elemento (opcional data-delay="150" en ms).
 * Llamá initParticleReveal() una vez después del primer render (Landing.jsx).
 *
 * Switch global: cambiar esta línea alcanza para volver al comportamiento
 * anterior (una sola vez, sin reset) sin tocar el resto de la lógica.
 */
export const REVEAL_MODE = 'repeat'; // 'once' | 'repeat'

// Umbral de entrada (empieza a animar) — el de salida es fijo en 0 (salió
// COMPLETO del viewport), ver nota en el IntersectionObserver más abajo.
const ENTER_THRESHOLD = 0.15;
// Si reingresa antes de esto desde su último reveal, aparece directo en su
// estado final (sin partículas): evita parpadeo por scroll ida-y-vuelta.
const COOLDOWN_MS = 800;
// Por encima de esta velocidad (px/s), lo que entra aparece directo en su
// estado final: re-animar durante un scroll veloz solo genera ruido/jank.
const FAST_SCROLL_PX_S = 1500;
// Nunca más de esta cantidad de elementos materializándose a la vez.
const MAX_CONCURRENT = 3;
// Tiempo que un elemento "ocupa" un cupo de concurrencia: transition
// (.25s delay + .8s duration ≈ 1.05s) + margen. Solo como red de
// seguridad — normalmente el cupo se libera antes, por transitionend.
const SLOT_FALLBACK_MS = 1300;

/**
 * Nota sobre reduced-motion: con prefers-reduced-motion: reduce el
 * contenido aparece directo, sin partículas, sin blur, sin translateY —
 * y el re-trigger queda completamente desactivado (nada re-anima nunca).
 */
export function initParticleReveal(opts = {}) {
  const {
    selector = '[data-reveal]',
    colors = ['#ffffff', '#00d4ff', '#1e90ff'],
    zIndex = 40,
  } = opts;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vh = window.innerHeight;

  // data-revealed (además de el._revealed): expuesto como atributo para que
  // consumidores externos (ej. la medición del timeline en ProcessSection)
  // puedan chequear de forma robusta "¿está esto REALMENTE asentado ahora?"
  // sin adivinar leyendo style.transform a mano.
  const setFinal = (el) => {
    el.style.transition = 'none';
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.filter = 'none';
    el._revealed = true;
    el.dataset.revealed = 'true';
  };

  const setHidden = (el) => {
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.filter = 'blur(8px)';
    el._revealed = false;
    el.dataset.revealed = 'false';
  };

  if (reduced) {
    document.querySelectorAll(selector).forEach(setFinal);
    return () => {};
  }

  // --- canvas de partículas compartido ---
  const pc = document.createElement('canvas');
  pc.setAttribute('aria-hidden', 'true');
  pc.style.cssText =
    `position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:${zIndex}`;
  document.body.appendChild(pc);
  const pctx = pc.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    pc.width = window.innerWidth * dpr;
    pc.height = window.innerHeight * dpr;
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const parts = [];
  let raf = 0;
  let paused = false;

  const loop = () => {
    if (paused) { raf = 0; return; }
    pctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const now = performance.now();
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (now < p.t0) continue;
      const t = Math.min(1, (now - p.t0) / p.dur);
      const e = 1 - Math.pow(1 - t, 3);              // ease-out cúbico
      const x = p.x0 + (p.x1 - p.x0) * e;
      const y = p.y0 + (p.y1 - p.y0) * e;
      const a = t < 0.7 ? 0.9 : 0.9 * (1 - (t - 0.7) / 0.3); // fade final
      pctx.globalAlpha = a;
      pctx.fillStyle = p.c;
      pctx.beginPath();
      pctx.arc(x, y, p.r, 0, 6.2832);
      pctx.fill();
      if (t >= 1) parts.splice(i, 1);
    }
    pctx.globalAlpha = 1;
    raf = parts.length ? requestAnimationFrame(loop) : 0;
  };

  const onVisibility = () => {
    paused = document.visibilityState !== 'visible';
    if (!paused && parts.length && !raf) raf = requestAnimationFrame(loop);
  };
  document.addEventListener('visibilitychange', onVisibility);

  // --- velocidad de scroll (decae sola si el scroll para) ---
  // OJO: en este layout el que scrollea de verdad no siempre es
  // window/<html> (puede haber un <body> u otro contenedor con su propio
  // overflow:auto — pasa en esta landing). "scroll" no burbujea desde ese
  // elemento hasta window, así que escuchamos en `document` con capture:true
  // (sí intercepta eventos de scroll de cualquier descendiente camino abajo)
  // y leemos la posición del propio e.target en vez de asumir window.scrollY.
  let scrollSpeed = 0;
  let lastY = null;
  let lastT = performance.now();
  let scrollDecayTimer = 0;
  const scrollTopOf = (target) => {
    if (!target || target === document) {
      return (document.scrollingElement || document.documentElement).scrollTop;
    }
    return target.scrollTop != null ? target.scrollTop : window.scrollY;
  };
  const onScroll = (e) => {
    const y = scrollTopOf(e.target);
    const t = performance.now();
    if (lastY === null) { lastY = y; lastT = t; return; }
    const dt = Math.max(1, t - lastT);
    scrollSpeed = (Math.abs(y - lastY) / dt) * 1000;
    lastY = y; lastT = t;
    clearTimeout(scrollDecayTimer);
    scrollDecayTimer = setTimeout(() => { scrollSpeed = 0; }, 150);
  };
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });

  // --- ráfaga de partículas para un elemento ---
  const emitParticles = (el) => {
    const r = el.getBoundingClientRect();
    const n = Math.min(70, Math.max(28, Math.round((r.width * r.height) / 8000)));
    const now = performance.now();
    for (let i = 0; i < n; i++) {
      // destino = un punto al azar sobre el borde del elemento
      const edge = Math.floor(Math.random() * 4);
      let x1, y1;
      if (edge === 0)      { x1 = r.left + Math.random() * r.width;  y1 = r.top; }
      else if (edge === 1) { x1 = r.left + Math.random() * r.width;  y1 = r.bottom; }
      else if (edge === 2) { x1 = r.left;  y1 = r.top + Math.random() * r.height; }
      else                 { x1 = r.right; y1 = r.top + Math.random() * r.height; }
      // origen = disperso alrededor del destino
      const ang = Math.random() * 6.2832, dist = 120 + Math.random() * 260;
      parts.push({
        x0: x1 + Math.cos(ang) * dist,
        y0: y1 + Math.sin(ang) * dist,
        x1, y1,
        t0: now + Math.random() * 200,
        dur: 520 + Math.random() * 320,
        r: 1 + Math.random() * 1.8,
        c: Math.random() < 0.3 ? colors[0]
           : (Math.random() < 0.5 ? colors[1] : colors[2]),
      });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };

  const animateIn = (el) => {
    emitParticles(el);
    // el elemento se materializa mientras llegan las partículas
    el.style.transition =
      'opacity .8s ease .25s, transform .8s ease .25s, filter .8s ease .25s';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    el.style.filter = 'blur(0)';
    el._revealed = true;
    el.dataset.revealed = 'true';
    el._lastRevealAt = performance.now();
    const filterTimer = setTimeout(() => { el.style.filter = ''; }, 1400);
    el._pendingTimers.push(filterTimer);
  };

  // --- concurrencia: máximo MAX_CONCURRENT materializándose a la vez,
  // el resto espera su turno respetando su propio data-delay ---
  let activeCount = 0;
  const queue = [];

  const releaseSlot = () => {
    activeCount = Math.max(0, activeCount - 1);
    drainQueue();
  };

  const drainQueue = () => {
    while (activeCount < MAX_CONCURRENT && queue.length) {
      const el = queue.shift();
      if (!el.isConnected) continue;
      activeCount++;
      runJob(el);
    }
  };

  const runJob = (el) => {
    const delay = +(el.dataset.delay || 0);
    const timer = setTimeout(() => {
      if (el._cancelled) { el._queued = false; releaseSlot(); return; }
      el._queued = false;
      animateIn(el);
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        el.removeEventListener('transitionend', onEnd);
        el._releaseSlotFn = null;
        releaseSlot();
      };
      const onEnd = (e) => { if (e.target === el) release(); };
      el.addEventListener('transitionend', onEnd);
      const fallback = setTimeout(release, SLOT_FALLBACK_MS);
      el._pendingTimers.push(fallback);
      el._releaseSlotFn = release;
    }, delay);
    el._pendingTimers.push(timer);
  };

  const requestReveal = (el) => {
    el._cancelled = false;
    el._queued = true;
    queue.push(el);
    drainQueue();
  };

  // --- entrada / salida ---
  const handleEnter = (el) => {
    if (el._revealed || el._queued) return;
    if (el._skipFx) { setFinal(el); return; } // ya visible al cargar, solo la primera vez

    const now = performance.now();
    const withinCooldown = el._lastRevealAt && (now - el._lastRevealAt < COOLDOWN_MS);
    const fastScroll = scrollSpeed > FAST_SCROLL_PX_S;

    if (withinCooldown || fastScroll) {
      setFinal(el);
      el._lastRevealAt = now;
      return;
    }

    requestReveal(el);
  };

  const handleExit = (el) => {
    if (REVEAL_MODE !== 'repeat') return;
    el._skipFx = false;      // ya salió una vez: de acá en más, ciclo normal
    el._cancelled = true;
    el._queued = false;
    (el._pendingTimers || []).forEach(clearTimeout);
    el._pendingTimers = [];
    if (el._releaseSlotFn) el._releaseSlotFn(); // libera el cupo si estaba activo
    setHidden(el);
  };

  // threshold [0, ENTER_THRESHOLD]: 0 para detectar salida COMPLETA (sin eso
  // dispararía con cualquier cruce parcial → parpadeo en micro-scroll).
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.intersectionRatio >= ENTER_THRESHOLD) {
        handleEnter(el);
        if (REVEAL_MODE === 'once') io.unobserve(el);
      } else if (entry.intersectionRatio === 0) {
        handleExit(el);
      }
    });
  }, { threshold: [0, ENTER_THRESHOLD] });

  // --- accesibilidad: Tab hacia un elemento aún oculto lo revela YA ---
  const onFocusIn = (e) => {
    const el = e.target.closest ? e.target.closest(selector) : null;
    if (el && !el._revealed) {
      el._cancelled = true;
      el._queued = false;
      (el._pendingTimers || []).forEach(clearTimeout);
      el._pendingTimers = [];
      if (el._releaseSlotFn) el._releaseSlotFn();
      setFinal(el);
    }
  };
  document.addEventListener('focusin', onFocusIn);

  // --- estado inicial ---
  document.querySelectorAll(selector).forEach((n) => {
    n._pendingTimers = [];
    const r = n.getBoundingClientRect();
    if (r.top > vh * 0.85) {                 // fuera de pantalla → animar
      setHidden(n);
    } else {
      n._skipFx = true;                      // ya visible → sin efecto (una vez)
      setFinal(n);
    }
    io.observe(n);
  });

  // cleanup para React
  return () => {
    io.disconnect();
    window.removeEventListener('resize', resize);
    document.removeEventListener('scroll', onScroll, true);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('focusin', onFocusIn);
    clearTimeout(scrollDecayTimer);
    pc.remove();
    if (raf) cancelAnimationFrame(raf);
  };
}
