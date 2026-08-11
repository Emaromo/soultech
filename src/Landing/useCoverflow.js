import { useCallback, useEffect, useRef, useState } from 'react';
import { emitBurst } from './particles/particleEngine';

const GRACE_MS = 2000;

// Punto 5 (sólo móvil): en vez de animar el spring JS frame a frame durante
// el settle, el motor salta directo a la posición final y deja que ESTA
// transición CSS interpole el cambio de transform en el compositor — cero
// JS corriendo durante la animación en sí. Medido con CPU 4x: ajustar el
// spring (k/damp/umbral) bajó la cantidad de frames necesarios pero no el
// costo de cada uno bajo el hilo principal saturado, así que seguía
// entrecortado; esto saca el rAF de la ecuación por completo para el
// settle (el arrastre en sí sigue 1:1 con el dedo, sin transición).
const MOBILE_CSS_TRANSITION = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';

// Distancia circular con signo: para N tarjetas, la diferencia i-pos
// "envuelve" por el lado más corto (ej. con N=7, ir de la 6 a la 0 es +1,
// no -6). Se usa tanto para el render (rotY/z/opacidad por distancia) como
// para resolver a qué target ir en loop.
const wrapDelta = (a, n) => {
  let d = ((a % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
};

/**
 * Carrusel "coverflow" 3D con drag/inercia (pointer events), tilt/glare al
 * pasar el mouse sobre la tarjeta activa, loop infinito circular y rotación
 * automática (autoplay) con pausa por interacción. El contenedor debe recibir
 * `containerRef`, y cada tarjeta hija debe tener el atributo `data-cf-card`
 * (opcionalmente `data-cf-shine`/`data-cf-glare` dentro para los brillos).
 *
 * Manipula `style.transform` directo sobre los nodos en cada frame (no
 * re-renderiza React) por performance; solo dispara un re-render cuando
 * cambia el índice activo (para los indicadores/dots) o el estado de
 * autoplay (para el botón Play/Pausa).
 *
 * @param {number} count
 * @param {number} [initial]
 * @param {{
 *   gapMult?: number,
 *   loop?: boolean,
 *   autoplay?: boolean,
 *   autoplayDelayMs?: number,
 *   pauseOnHover?: boolean,
 *   isMobile?: boolean,
 * }} [options] gapMult: multiplicador de separación horizontal (gap =
 *   anchoTarjeta * gapMult, default 0.8). loop: circular infinito (default
 *   true). autoplay: rotación automática (default true). autoplayDelayMs:
 *   ms por tarjeta (default 3500). pauseOnHover: pausar autoplay al pasar
 *   el mouse por el carrusel (default true). isMobile: sólo atenúa
 *   rotación/translateZ (ver render()) — el caller sigue siendo dueño del
 *   media query, este hook no detecta nada por su cuenta (default false).
 */
export default function useCoverflow(count, initial = 0, options = {}) {
  const {
    gapMult = 0.8,
    loop = true,
    autoplay = true,
    autoplayDelayMs = 3500,
    pauseOnHover = true,
    isMobile = false,
  } = options;

  const [node, setNode] = useState(null);
  const [activeIndex, setActiveIndex] = useState(initial);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isPlaying, setIsPlaying] = useState(() => autoplay && !reducedMotion);
  const engineRef = useRef(null);

  const containerRef = useCallback((el) => {
    setNode(el);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const root = node;
    if (!root || count === 0) return undefined;

    const cards = Array.from(root.querySelectorAll('[data-cf-card]'));
    const N = cards.length;
    if (N < count) return undefined;
    // Cacheado una sola vez (no en cada frame de render()): con autoplay
    // continuo el loop corre indefinidamente mientras el carrusel está en
    // pantalla, así que un querySelector por tarjeta por frame sí pesa.
    const shineEls = cards.map((c) => c.querySelector('[data-cf-shine]'));

    const rm = reducedMotion;
    // hover:hover + pointer:fine = mouse/trackpad real, nunca táctil (en
    // touch no existe hover de verdad y el puntero es "coarse"). Gatea
    // tilt+glare+partículas por igual: en táctil ninguno de los tres debe
    // ejecutarse (el pointermove "de paso sin tocar" tampoco existe en
    // touch, pero este chequeo lo hace explícito en vez de depender de eso).
    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    // Partículas de hover (useParticleHover.js las gatea igual, repetido acá
    // porque este motor no pasa por ese hook): solo con hover real + puntero
    // fino + CPU con margen.
    const particlesOk = hoverCapable && !rm && (navigator.hardwareConcurrency || 8) > 4;
    const eng = {
      pos: initial, target: initial, vel: 0, raf: 0, lastFrameAt: 0,
      dragging: false, moved: false, tiltCard: -1, tiltX: 0, tiltY: 0,
      userPaused: !autoplay || rm, pointerInside: false, hasFocus: false,
      inViewport: true, lastInteractionAt: -Infinity, lastRenderedPos: null,
    };
    engineRef.current = eng;

    // Separación horizontal configurable por el caller (gapMult), así
    // Servicios puede alinearse exactamente con el carrusel de rubros sin
    // afectar a Precios (que no pasa la opción y usa el default 0.8).
    const gap = () => Math.max(140, (cards[0].offsetWidth || 300) * gapMult);

    // Opacidad por distancia (ad): 1 en el centro, ~0.3 en las adyacentes
    // (ad~1), ~0.12 en las lejanas (ad~2), 0 desde ad=3 — lineal a trozos
    // por esos puntos de control.
    const opacityFor = (ad) => {
      if (ad <= 1) return 1 - ad * 0.7;
      if (ad <= 2) return 0.3 - (ad - 1) * 0.18;
      return Math.max(0, 0.12 - (ad - 2) * 0.12);
    };

    // Índice 0..N-1 normalizado (circular si loop) para dots/aria/comparar.
    const wrapIdx = (v) => (loop
      ? ((Math.round(v) % N) + N) % N
      : Math.max(0, Math.min(N - 1, Math.round(v))));

    const syncActiveIndex = () => {
      const norm = wrapIdx(eng.target);
      setActiveIndex((prev) => (prev !== norm ? norm : prev));
    };

    let ariaLiveIsOff = null;
    const syncAriaLive = (autoplaying) => {
      if (ariaLiveIsOff === autoplaying) return;
      ariaLiveIsOff = autoplaying;
      // Mientras gira sola, aria-live="off" para no bombardear lectores de
      // pantalla con cada cambio de tarjeta (W3C APG); en reposo/manual,
      // "polite" para que sí anuncie la navegación del usuario.
      root.setAttribute('aria-live', autoplaying ? 'off' : 'polite');
    };

    // moving=true: SOLO EN MÓVIL, mientras el spring está activo (arrastre
    // o settle sin terminar) — se saltea el shine (única "extra" que este
    // motor escribe por tarjeta además de transform/opacity/etc). Se
    // vuelve a escribir en el frame final (moving=false) así no queda
    // desincronizado tras la transición.
    const render = (moving = false) => {
      const skipExtras = isMobile && moving;
      const g = gap();
      for (let i = 0; i < N; i++) {
        const d = loop ? wrapDelta(i - eng.pos, N) : (i - eng.pos);
        const ad = Math.abs(d);
        const tilt = i === eng.tiltCard;
        // Sólo en móvil: menos rotación y menos translateZ — la perspectiva
        // de desktop empuja a las laterales fuera de una pantalla angosta.
        // Desktop queda exactamente como estaba (42°/-340 por unidad).
        const rotYMax = isMobile ? 16 : 42;
        const rotYMult = isMobile ? 13 : 36;
        const zMult = isMobile ? -150 : -340;
        const rotY = Math.max(-rotYMax, Math.min(rotYMax, -d * rotYMult)) + (tilt ? eng.tiltY : 0);
        const rotX = tilt ? eng.tiltX : 0;
        // Mucho más translateZ negativo que antes (-200→-340 por unidad de
        // distancia): separa de verdad a las laterales en profundidad para
        // que dejen de "pisar" visualmente a la tarjeta central.
        const z = ad * zMult + (tilt ? 40 : 0);
        const sc = Math.max(0.6, 1 - ad * 0.18);
        // Blur progresivo en desktop (nítido en el centro, hasta 6px en las
        // lejanas). En móvil el blur se ELIMINA del todo: filter:blur()
        // sobre elementos con transform 3D es de lo más caro en GPU móvil,
        // y la opacidad+escala ya comunican la profundidad sin él.
        const blurPx = isMobile ? 0 : Math.min(6, ad * 3);
        const el = cards[i];
        // Transform redondeado a 1 decimal en los 5 componentes (antes
        // rotateY/rotateX/scale tenían más precisión que translateX/Z):
        // mismo resultado visual, menos bytes de string y menos variación
        // de un frame al otro por microcambios de sub-píxel.
        el.style.transform = `translate(-50%,-50%) translateX(${(d * g).toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg) scale(${sc.toFixed(1)})`;
        el.style.opacity = String(+opacityFor(ad).toFixed(3));
        el.style.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : '';
        el.style.zIndex = String(100 - Math.round(ad * 15));
        el.style.pointerEvents = ad > 1.1 ? 'none' : 'auto';
        // A distancia >=3 la tarjeta queda invisible y fuera del hit-test
        // (no hay forma de "no montarla" desde este motor imperativo, pero
        // visibility:hidden + opacity 0 la saca por completo de pantalla).
        el.style.visibility = ad >= 3 ? 'hidden' : 'visible';
        // Sólo en móvil: display:none (no sólo visibility:hidden) para todo
        // lo que no sea central + 2 adyacentes — motor/browser dejan de
        // pintar/componer esas tarjetas por completo en vez de sólo
        // ocultarlas, que es lo caro en un carrusel con blur+3D+glass.
        // Asignación incondicional (no "if (isMobile) ..."): si no, al pasar
        // de móvil a desktop (resize/rotación) el 'none' de la corrida
        // anterior queda pegado, porque esta rama nunca lo volvería a tocar.
        el.style.display = (isMobile && ad >= 1.5) ? 'none' : '';
        // will-change dinámico SOLO en móvil (en desktop lo sigue poniendo
        // el JSX, fijo, como siempre): activarlo únicamente mientras hay
        // movimiento evita que cada tarjeta visible mantenga su propia capa
        // de GPU todo el tiempo — con varias tarjetas de vidrio+blur, eso
        // satura memoria de video en gama media/baja. Se limpia solo (moving
        // pasa a false en el frame final del settle).
        if (isMobile) el.style.willChange = (moving && ad < 1.5) ? 'transform, opacity' : 'auto';
        el.setAttribute('aria-hidden', ad < 0.5 ? 'false' : 'true');
        // Proximidad al centro (1 = tarjeta activa, 0 = lejana): alimenta el
        // glow del borde blanco (--edge) en las tarjetas de vidrio.
        el.style.setProperty('--edge', String(Math.max(0, 1 - ad * 0.75).toFixed(3)));
        if (!skipExtras) {
          const sh = shineEls[i];
          if (sh) sh.style.opacity = (!rm && ad < 0.25) ? '1' : '0';
        }
      }
    };

    const shouldAutoplay = (now) => autoplay && !rm && !eng.userPaused && !eng.dragging
      && !(pauseOnHover && eng.pointerInside) && !eng.hasFocus
      && !document.hidden && eng.inViewport
      && (now - eng.lastInteractionAt) >= GRACE_MS;

    // Único rAF loop del motor: además de la física de settle (spring hacia
    // eng.target), cuando corresponde autoplay hace derivar eng.target de
    // forma continua (no saltos de setInterval) — eng.pos lo persigue con el
    // MISMO spring que usa la navegación manual, así se lee igual.
    const ensureLoop = () => {
      if (eng.raf) return;
      eng.lastFrameAt = performance.now();
      const step = () => {
        eng.raf = 0;
        if (eng.dragging || !root.isConnected) return;
        const now = performance.now();
        const rawDt = now - eng.lastFrameAt;
        // dt (clamped) alimenta solo el spring de settle, para que no
        // "salte" tras un frame largo; el drift de autoplay usa rawDt sin
        // recortar, así el ritmo de ~3.5s/tarjeta se cumple en tiempo real
        // aunque el rAF venga más lento de lo normal (pestaña ocupada,
        // pantalla de bajo refresh, etc.). En móvil el techo es más alto
        // (100ms en vez de 50ms): medido con CPU 4x throttle, los frames
        // durante una transición llegan a tardar 100-150ms reales — con el
        // techo en 50ms el spring subestimaba el tiempo transcurrido y
        // necesitaba MÁS frames reales para converger (más ventana de
        // jank). Con el techo más alto, el spring "sabe" cuánto tardó de
        // verdad y cierra antes.
        const dt = Math.min(isMobile ? 100 : 50, rawDt);
        eng.lastFrameAt = now;

        const autoplaying = shouldAutoplay(now);
        syncAriaLive(autoplaying);
        if (autoplaying) {
          eng.target += rawDt / autoplayDelayMs;
        } else if (Math.abs(eng.target - Math.round(eng.target)) > 1e-6) {
          // Al pausar (por el motivo que sea), el target deja de derivar y
          // se redondea a la tarjeta más cercana: el spring hace el resto,
          // dejando el carrusel EXACTAMENTE como en reposo manual.
          eng.target = Math.round(eng.target);
        }

        // k/damp están calibrados por-frame asumiendo ~60fps (16.6667ms);
        // se escalan por dt para que el settle y el autoplay se vean igual
        // de rápido en pantallas/tabs con otro refresh rate o con el rAF
        // momentáneamente más lento (si no, con menos frames por segundo la
        // rotación "1 tarjeta cada 3.5s" se percibiría más lenta). En móvil,
        // k/damp más rígidos (0.16/0.75 vs 0.09/0.8): la transición dura
        // menos frames en total, así que hay menos ventana para que se note
        // el jank aunque cada frame individual siga costando lo mismo.
        const fs = dt / 16.6667;
        const kBase = rm ? 0.3 : (isMobile ? 0.16 : 0.09);
        const dampBase = rm ? 0.55 : (isMobile ? 0.75 : 0.8);
        const k = kBase * fs, damp = Math.pow(dampBase, fs);
        eng.vel = (eng.vel + (eng.target - eng.pos) * k) * damp;
        eng.pos += eng.vel * fs;

        // Umbral de corte: en móvil, más alto (0.004 vs 0.0008) — esa cola
        // final del settle no se nota visualmente pero sí alarga cuántos
        // frames más sigue corriendo el rAF (y en un hilo ya saturado, cada
        // frame de más importa).
        const settleThreshold = isMobile ? 0.004 : 0.0008;
        if (!autoplaying && Math.abs(eng.vel) < settleThreshold && Math.abs(eng.target - eng.pos) < settleThreshold) {
          eng.pos = eng.target;
          render();
          eng.lastRenderedPos = eng.pos;
          syncActiveIndex();
          return;
        }
        // Si la posición cambió menos de 0.001 desde el último frame
        // pintado, no reescribir estilos — un microcambio así no se nota
        // (es un settle terminando de converger) pero sí sale caro repetir
        // recalculo de estilo/layout/paint en cada rAF por nada.
        if (eng.lastRenderedPos === null || Math.abs(eng.pos - eng.lastRenderedPos) >= 0.001) {
          render(true);
          eng.lastRenderedPos = eng.pos;
        }
        syncActiveIndex();
        eng.raf = requestAnimationFrame(step);
      };
      eng.raf = requestAnimationFrame(step);
    };

    let graceTimer = null;
    const markInteraction = () => {
      eng.lastInteractionAt = performance.now();
      if (graceTimer) clearTimeout(graceTimer);
      graceTimer = setTimeout(() => { graceTimer = null; ensureLoop(); }, GRACE_MS + 30);
    };

    // Sólo móvil: prende/apaga la transición CSS en las N tarjetas.
    // Apagada durante el arrastre real (sigue al dedo 1:1, sin lag);
    // prendida antes de cualquier salto programático (settle, goTo,
    // botones, dots) para que ESE cambio de transform se interpole solo.
    const setCssTransition = (enabled) => {
      const value = enabled ? MOBILE_CSS_TRANSITION : 'none';
      for (let i = 0; i < N; i++) cards[i].style.transition = value;
    };

    const settleTo = (targetPos) => {
      markInteraction();
      if (isMobile) {
        // Salta directo a la tarjeta más cercana (misma lógica de
        // redondeo/clamping que ya usaba el motor) y deja que la
        // transición CSS anime el cambio de transform — nada de spring
        // JS por frame acá. eng.vel en 0 para no arrastrar inercia
        // residual de un drag anterior al siguiente step() (ver
        // markInteraction, que igual programa uno de cortesía).
        const target = loop
          ? Math.round(targetPos)
          : Math.max(0, Math.min(N - 1, Math.round(targetPos)));
        setCssTransition(true);
        eng.vel = 0;
        eng.pos = target;
        eng.target = target;
        render();
        eng.lastRenderedPos = eng.pos;
        syncActiveIndex();
        return;
      }
      eng.target = targetPos;
      syncActiveIndex();
      ensureLoop();
    };

    const goTo = (i) => {
      settleTo(loop ? eng.pos + wrapDelta(i - eng.pos, N) : Math.max(0, Math.min(N - 1, Math.round(i))));
    };
    eng.goTo = goTo;

    const stepBy = (dir) => {
      settleTo(loop ? eng.target + dir : Math.max(0, Math.min(N - 1, eng.target + dir)));
    };
    eng.next = () => stepBy(1);
    eng.prev = () => stepBy(-1);

    eng.setUserPaused = (paused) => {
      eng.userPaused = paused;
      setIsPlaying(!paused);
      if (!paused) { eng.lastInteractionAt = -Infinity; ensureLoop(); }
    };
    eng.togglePlay = () => eng.setUserPaused(!eng.userPaused);

    let lastX = 0, lastT = 0, vfilt = 0;

    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      eng.dragging = true; eng.moved = false; vfilt = 0;
      // Apaga la transición CSS mientras se arrastra: tiene que seguir al
      // dedo 1:1 en cada pointermove, no interpolar con retraso hacia cada
      // posición intermedia.
      if (isMobile) setCssTransition(false);
      markInteraction();
      if (eng.raf) { cancelAnimationFrame(eng.raf); eng.raf = 0; }
      lastX = e.clientX; lastT = performance.now();
      root.style.cursor = 'grabbing';
      try { root.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    };

    const onPointerMove = (e) => {
      if (eng.dragging) {
        const now = performance.now(), dt = Math.max(1, now - lastT);
        const dpos = -(e.clientX - lastX) / gap();
        if (Math.abs(e.clientX - lastX) > 3) eng.moved = true;
        eng.pos = loop ? (eng.pos + dpos) : Math.max(-0.35, Math.min(N - 0.65, eng.pos + dpos));
        vfilt = vfilt * 0.7 + (dpos / dt * 16) * 0.3;
        lastX = e.clientX; lastT = now;
        eng.tiltCard = -1;
        render(true);
      } else if (!rm && hoverCapable) {
        const ci = wrapIdx(eng.pos);
        const c = cards[ci];
        if (!c) return;
        const r = c.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        const glare = c.querySelector('[data-cf-glare]');
        if (inside) {
          // Ráfaga de partículas UNA sola vez por entrada (tiltCard pasa de
          // -1 a ci acá mismo), no en cada mousemove mientras está encima.
          if (particlesOk && eng.tiltCard !== ci) {
            emitBurst(r, { count: 11, spread: [20, 40], edgeBias: 'perimeter', colors: ['#FFFFFF', 'rgba(255,255,255,0.85)'] });
          }
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          eng.tiltCard = ci; eng.tiltX = -py * 9; eng.tiltY = px * 11;
          if (glare) {
            glare.style.opacity = '1';
            glare.style.background = `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, rgba(200,230,255,0.55), rgba(200,230,255,0) 60%)`;
          }
        } else {
          if (eng.tiltCard === -1) return;
          eng.tiltCard = -1;
          if (glare) glare.style.opacity = '0';
        }
        if (!eng.raf) render();
      }
    };

    const endDrag = () => {
      if (!eng.dragging) return;
      eng.dragging = false;
      root.style.cursor = 'grab';
      eng.vel = vfilt;
      settleTo(eng.pos + vfilt * 6);
    };

    const onPointerLeave = () => {
      if (eng.dragging) { endDrag(); return; }
      if (eng.tiltCard !== -1) {
        const glare = cards[eng.tiltCard] && cards[eng.tiltCard].querySelector('[data-cf-glare]');
        if (glare) glare.style.opacity = '0';
        eng.tiltCard = -1;
        if (!eng.raf) render();
      }
    };

    // Pausa/reanudación de autoplay por hover, foco y visibilidad — separado
    // del tilt/glare de arriba a propósito, así no se toca esa lógica ya
    // afinada. "Sobre el carrusel" = sobre el área del track completo.
    const onPointerEnterRoot = () => {
      eng.pointerInside = true;
      markInteraction();
    };
    const onPointerLeaveRoot = () => {
      eng.pointerInside = false;
      markInteraction();
    };
    const onFocusIn = () => {
      eng.hasFocus = true;
      markInteraction();
    };
    const onFocusOut = (e) => {
      if (root.contains(e.relatedTarget)) return;
      eng.hasFocus = false;
      markInteraction();
    };

    const onClick = (e) => {
      if (eng.moved) { e.preventDefault(); e.stopPropagation(); eng.moved = false; return; }
      const card = e.target.closest ? e.target.closest('[data-cf-card]') : null;
      if (card) {
        const i = cards.indexOf(card);
        const cur = wrapIdx(eng.target);
        if (i !== -1 && i !== cur) { e.preventDefault(); e.stopPropagation(); goTo(i); }
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); eng.prev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); eng.next(); }
    };

    const onDragStart = (e) => e.preventDefault();
    const onResize = () => render();

    // Pausar con la pestaña oculta y fuera de viewport ahorra CPU/batería;
    // ninguno de los dos exige el delay de gracia (no son "interacciones").
    const onVisibilityChange = () => {
      if (!document.hidden) ensureLoop();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let io = null;
    if ('IntersectionObserver' in window) {
      // rootMargin generoso: entra/sale del estado "visible" un poco antes
      // de cruzar el borde real del viewport, así no hay un frame en seco
      // arrancando/parando justo cuando el usuario ya está viéndolo.
      io = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        eng.inViewport = entry.isIntersecting;
        if (eng.inViewport) ensureLoop();
      }, { threshold: 0.2, rootMargin: '200px' });
      io.observe(root);
    }

    root.style.cursor = 'grab';
    root.setAttribute('aria-live', 'polite');
    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', endDrag);
    root.addEventListener('pointercancel', endDrag);
    root.addEventListener('pointerleave', onPointerLeave);
    root.addEventListener('pointerenter', onPointerEnterRoot);
    root.addEventListener('pointerleave', onPointerLeaveRoot);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    root.addEventListener('click', onClick, true);
    root.addEventListener('keydown', onKeyDown);
    root.addEventListener('dragstart', onDragStart);
    window.addEventListener('resize', onResize);

    render();
    eng.lastRenderedPos = eng.pos;
    // Recién DESPUÉS del primer render: si se prendiera antes, ese primer
    // pintado (de "nada" al estado inicial) podría animarse solo, con las
    // tarjetas "entrando" desde quién sabe dónde.
    if (isMobile) setCssTransition(true);
    syncActiveIndex();
    if (!eng.userPaused) ensureLoop();

    return () => {
      if (eng.raf) cancelAnimationFrame(eng.raf);
      if (graceTimer) clearTimeout(graceTimer);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', endDrag);
      root.removeEventListener('pointercancel', endDrag);
      root.removeEventListener('pointerleave', onPointerLeave);
      root.removeEventListener('pointerenter', onPointerEnterRoot);
      root.removeEventListener('pointerleave', onPointerLeaveRoot);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      root.removeEventListener('click', onClick, true);
      root.removeEventListener('keydown', onKeyDown);
      root.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('resize', onResize);
    };
  }, [node, count, initial, gapMult, loop, autoplay, autoplayDelayMs, pauseOnHover, reducedMotion, isMobile]);

  const next = useCallback(() => { engineRef.current?.next(); }, []);
  const prev = useCallback(() => { engineRef.current?.prev(); }, []);
  const goTo = useCallback((i) => { engineRef.current?.goTo(i); }, []);
  const togglePlay = useCallback(() => { engineRef.current?.togglePlay(); }, []);

  return { containerRef, activeIndex, next, prev, goTo, isPlaying, togglePlay, reducedMotion };
}
