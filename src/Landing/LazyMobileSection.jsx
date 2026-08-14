import React, { useEffect, useRef, useState } from "react";

const getIsMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;

/**
 * Sólo móvil: difiere el MONTAJE real de una sección pesada (carrusel,
 * partículas, tilt) hasta que está por entrar al viewport, en vez de montar
 * todo de una sincrónicamente al cargar la página — la causa real medida de
 * que el hilo principal esté ocupado ~4.5s antes de poder pintar el LCP
 * (Lighthouse mobile: "Render Delay" 91% del tiempo hasta LCP, con
 * mainthread-work-breakdown en 6.5s, pese a que el LCP en sí es un simple
 * párrafo de texto en el Hero sin ninguna dependencia de red). En desktop,
 * mount inmediato SIEMPRE — este wrapper es un no-op ahí, cero cambio de
 * comportamiento (isMobile arranca en `false` ahí y nunca cambia).
 *
 * Mientras no está montada en móvil, en su lugar hay un placeholder con:
 * - la altura reservada (`approxHeight`), para no reintroducir layout shift
 *   cuando el contenido real reemplaza al placeholder;
 * - el `id` real de la sección y el mismo `scrollMarginTop`, así los links
 *   del nav (`href="#servicios"`, `href="#precios"`) siguen encontrando el
 *   destino y frenando en el lugar correcto (bajo el header fijo) aunque el
 *   contenido real todavía no montó.
 *
 * rootMargin generoso (800px): para cuando el usuario llega a scrollear
 * hasta ahí de verdad, ya montó hace rato. Esto además hace que un click en
 * el nav (o un link directo con #hash) se resuelva solo: el navegador
 * scrollea hasta el placeholder (ya tiene la altura/posición correcta), eso
 * lo mete en la ventana de intersección, y el observer dispara el montaje
 * real ahí mismo — sin necesitar detectar el hash a mano.
 *
 * No se vuelve a desmontar una vez montada (a propósito): re-montar
 * perdería el estado interno del carrusel/animaciones cada vez que la
 * sección sale y vuelve a entrar en viewport con el scroll normal.
 */
const LazyMobileSection = ({ id, approxHeight, scrollMarginTop = 80, children }) => {
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [mounted, setMounted] = useState(() => !getIsMobile());
  const placeholderRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => {
      const nowMobile = mq.matches;
      setIsMobile(nowMobile);
      // Si deja de ser móvil (resize/rotación/devtools), montar ya mismo —
      // desktop nunca debe quedar en estado "diferido".
      if (!nowMobile) setMounted(true);
    };
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (mounted || !isMobile) return undefined;
    const el = placeholderRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      // Sin soporte de IntersectionObserver: no vale la pena arriesgar que
      // la sección nunca aparezca — se monta directo.
      setMounted(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, isMobile]);

  if (mounted) return children;

  return (
    <div
      ref={placeholderRef}
      id={id}
      aria-hidden="true"
      style={{ minHeight: approxHeight, scrollMarginTop }}
    />
  );
};

export default LazyMobileSection;
