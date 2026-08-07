import { useCallback, useEffect, useState } from 'react';

/**
 * Dispara, una sola vez cuando el carrusel entra en viewport, la
 * materialización por desintegración de cada tarjeta `[data-cf-card]`, con
 * stagger. El `<animate id="{prefix}-anim-{i}" begin="indefinite">` vive en
 * el `<svg><defs>` del carrusel (ver GlassDisintegrationDefs), no dentro de
 * la tarjeta, por eso se busca por id global en vez de por descendencia.
 * Con `prefers-reduced-motion` o sin soporte de filtros SVG, degrada a un
 * fade+scale simple (clase `.mz-fallback-in`).
 *
 * Devuelve una callback ref para fusionar con la del carrusel:
 *   ref={(el) => { containerRef(el); materializeRef(el); }}
 */
export default function useMaterialize({ prefix, disintegration = 'full', staggerMs = 120 } = {}) {
  const [node, setNode] = useState(null);
  const ref = useCallback((el) => setNode(el), []);

  useEffect(() => {
    if (!node || !('IntersectionObserver' in window)) return undefined;

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doff = disintegration === 'off' || !('SVGFETurbulenceElement' in window);
    const cards = Array.from(node.querySelectorAll('[data-cf-card]'));
    if (!cards.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (rm || doff) {
          cards.forEach((c, i) => {
            const face = c.querySelector('.ds-glass-face');
            if (face) {
              face.style.animationDelay = `${i * staggerMs}ms`;
              face.classList.add('mz-fallback-in');
            }
          });
          return;
        }
        node.classList.add('is-materializing');
        cards.forEach((_, i) => {
          setTimeout(() => {
            const a = document.getElementById(`${prefix}-anim-${i}`);
            if (a && a.beginElement) {
              try { a.beginElement(); } catch (err) { /* noop */ }
            }
          }, i * staggerMs);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, prefix, disintegration, staggerMs]);

  return ref;
}
