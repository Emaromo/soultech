/**
 * Único lugar para cambiar el número de WhatsApp de contacto de todo el
 * sitio (sin el "+", formato esperado por wa.me).
 */
export const WHATSAPP_NUMBER = "5493516325887";

export const buildWhatsAppHref = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
