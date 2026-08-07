// Motor compartido de partículas de hover para toda la landing. Un único
// canvas, un único rAF, un pool fijo de partículas reutilizadas (nunca se
// instancia un objeto nuevo por partícula) — ver ParticleCanvas.jsx (monta
// esto UNA vez) y useParticleHover.js (lo consume desde cada elemento).
const MAX_PARTICLES = 60;
const DPR_CAP = 2;

const pool = Array.from({ length: MAX_PARTICLES }, () => ({
  active: false,
  x: 0, y: 0, dx: 0, dy: 0, dist: 0,
  size: 0, color: "", startAt: 0, life: 0,
}));
let activeCount = 0;
// Stack de índices libres: emitir/liberar es O(1) en vez de escanear el pool.
const freeStack = Array.from({ length: MAX_PARTICLES }, (_, i) => MAX_PARTICLES - 1 - i);

let canvas = null;
let ctx = null;
let dpr = 1;
let running = false;
let rafId = 0;
let paused = false;

const resize = () => {
  if (!canvas) return;
  dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

const tick = (now) => {
  rafId = 0;
  if (!ctx || paused) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  let stillActive = false;
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = pool[i];
    if (!p.active) continue;
    const t = now - p.startAt;
    if (t < 0) { stillActive = true; continue; } // agendada, todavía no nace
    const progress = t / p.life;
    if (progress >= 1) {
      p.active = false;
      activeCount = Math.max(0, activeCount - 1);
      freeStack.push(i);
      continue;
    }
    stillActive = true;
    const e = easeOutQuad(progress);
    const x = p.x + p.dx * p.dist * e;
    const y = p.y + p.dy * p.dist * e;
    // Curva de brillo "sostenida y después apaga" en vez de fade lineal desde
    // el nacimiento: se mantiene casi al máximo un rato y recién cae hacia
    // el final, así el ojo alcanza a registrar la chispa en vez de un
    // parpadeo de un frame. (pow con exponente <1 retrasa la caída inicial.)
    const alpha = 0.95 * Math.pow(1 - progress, 0.6);
    const scale = 1 - 0.5 * progress;
    const r = Math.max(0.6, (p.size * scale) / 2);

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 7;
    ctx.shadowColor = p.color;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  if (stillActive) {
    rafId = requestAnimationFrame(tick);
  } else {
    running = false;
  }
};

const ensureLoop = () => {
  if (!running && !paused && canvas) {
    running = true;
    rafId = requestAnimationFrame(tick);
  }
};

/** Monta el canvas compartido. Llamar UNA sola vez (ver ParticleCanvas.jsx). */
export function mountEngine(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);

  const onVisibility = () => {
    paused = document.visibilityState !== "visible";
    if (!paused) ensureLoop();
    else if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    if (rafId) cancelAnimationFrame(rafId);
    running = false;
    canvas = null;
    ctx = null;
  };
}

export function isEngineMounted() {
  return !!canvas;
}

/**
 * Emite una ráfaga de partículas alrededor de `rect` (DOMRect en
 * coordenadas de viewport, mismo espacio que el canvas fixed inset:0).
 * @param {DOMRect} rect
 * @param {{count?:number, colors?:string[], spread?:[number,number], edgeBias?:'perimeter'|'sides', life?:[number,number]}} [opts]
 */
export function emitBurst(rect, opts = {}) {
  if (!canvas || !rect || rect.width <= 0) return;
  const {
    count = 10,
    colors = ["#38BDF8", "#FFFFFF"],
    spread = [20, 40],
    edgeBias = "perimeter",
    life = [700, 950],
  } = opts;

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const now = performance.now();

  for (let i = 0; i < count; i++) {
    if (activeCount >= MAX_PARTICLES || freeStack.length === 0) break;
    const idx = freeStack.pop();
    const p = pool[idx];

    let x, y;
    if (edgeBias === "sides") {
      // Botones: concentradas en los bordes laterales (izquierda/derecha).
      const left = Math.random() < 0.5;
      x = left ? rect.left : rect.right;
      y = rect.top + Math.random() * rect.height;
    } else {
      // Perímetro completo, distribuido por longitud de cada lado.
      const w = rect.width, h = rect.height, perim = 2 * (w + h);
      let d = Math.random() * perim;
      if (d < w) { x = rect.left + d; y = rect.top; }
      else if (d < w + h) { x = rect.right; y = rect.top + (d - w); }
      else if (d < 2 * w + h) { x = rect.right - (d - w - h); y = rect.bottom; }
      else { x = rect.left; y = rect.bottom - (d - 2 * w - h); }
    }

    // Dirección hacia afuera (del centro al punto de nacimiento) + jitter
    // aleatorio leve, para la "deriva" que pide la spec.
    let ang = Math.atan2(y - cy, x - cx);
    ang += (Math.random() - 0.5) * (Math.PI / 4.5); // ±20°
    if (!Number.isFinite(ang)) ang = Math.random() * Math.PI * 2;

    p.x = x;
    p.y = y;
    p.dx = Math.cos(ang);
    p.dy = Math.sin(ang);
    p.dist = spread[0] + Math.random() * (spread[1] - spread[0]);
    p.size = 2.5 + Math.random() * 2.5;
    p.color = colors[Math.floor(Math.random() * colors.length)];
    p.life = life[0] + Math.random() * (life[1] - life[0]);
    // Emisión escalonada: nacimiento programado unos ms en el futuro.
    p.startAt = now + i * (14 + Math.random() * 10);
    p.active = true;
    activeCount++;
  }

  ensureLoop();
}
