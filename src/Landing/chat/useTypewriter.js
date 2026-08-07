import { useEffect, useRef, useState } from "react";

/**
 * Revela `text` progresivamente (palabra por palabra) en vez de de una,
 * simulando streaming — así el día que ApiChatProvider entregue tokens
 * reales, esto se reemplaza por ir concatenando lo que llega en vez de
 * animar un string ya completo, sin cambiar el resto del componente.
 * `active=false` (mensajes históricos, o reduced-motion) muestra el texto
 * completo de una.
 */
export default function useTypewriter(text, active, onDone) {
  const [shown, setShown] = useState(active ? "" : text);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!active) {
      setShown(text);
      return undefined;
    }
    setShown("");
    const words = text.split(" ");
    let i = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      i += 1;
      setShown(words.slice(0, i).join(" "));
      if (i < words.length) {
        setTimeout(step, 32 + Math.random() * 28);
      } else if (doneRef.current) {
        doneRef.current();
      }
    };
    const t = setTimeout(step, 32);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active]);

  return shown;
}
