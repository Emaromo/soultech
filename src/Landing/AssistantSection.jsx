import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, RotateCw, AlertCircle, MessageCircle } from "lucide-react";
import { GlassReflection, GlassContactLight, GlassFloor } from "./GlassCard";
import SectionBackdrop from "./SectionBackdrop";
import { nextMessageId } from "./chat/chatTypes";
import { ScriptedChatProvider } from "./chat/ScriptedChatProvider";
import { initialChips, fallbackChips, welcomeMessage, matchNode, getNode } from "./chatFlow";
import { buildWhatsAppHref } from "./whatsappConfig";
import useTypewriter from "./chat/useTypewriter";
import useParticleHover from "./particles/useParticleHover";

// --edge en reposo bajo, mismo lenguaje que Proceso/Contacto: es una tarjeta
// "par", no la activa de un carrusel. Sube en hover/foco vía .ds-static-glass.
const REST_EDGE = 0.4;
const FACE_STYLE = { padding: 0, height: "100%" };

const toMessage = (seed, status) => ({ id: nextMessageId(), timestamp: Date.now(), status, ...seed });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const formatTime = (ts) => new Date(ts).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
// "¿Qué es un agente de voz?" -> "qué es un agente de voz", para que el
// contexto del mensaje de WhatsApp lea como frase, no como pregunta pegada
// dentro de otra pregunta.
const stripQuestionMarks = (s) => s.replace(/^¿/, "").replace(/\?$/, "");

/** Una burbuja. El typewriter (streaming-ready) solo corre para el mensaje
 * del asistente recién agregado — `animate` lo decide el padre vía
 * `typedIdsRef`, para no re-tipear mensajes ya mostrados en renders futuros.
 * No tiene botón de WhatsApp inline — hay un único botón fijo en la UI
 * (ver AssistantSection), tenerlo acá también lo triplicaba. */
const ChatBubble = ({ m, animate, reducedMotion, onTypeDone, onRetry }) => {
  const isUser = m.role === "user";
  const isError = m.status === "error";
  const shown = useTypewriter(m.content, animate, onTypeDone);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: m.status === "sending" ? 0.6 : 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
      className="flex items-end gap-2"
      style={{ alignSelf: isUser ? "flex-end" : "flex-start", flexDirection: isUser ? "row-reverse" : "row", maxWidth: "100%" }}
    >
      {!isUser && (
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5"
          style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}
          aria-hidden="true"
        >
          <Bot className="w-[14px] h-[14px]" />
        </span>
      )}
      {/* min-width:0 — sin esto, un flex child con max-width puede seguir
          empujando el ancho del padre con contenido largo y generar scroll
          horizontal en todo el log. */}
      <div className="max-w-[75%] flex flex-col gap-1.5" style={{ alignItems: isUser ? "flex-end" : "flex-start", minWidth: 0 }}>
        <div
          className="text-sm leading-relaxed px-4 py-3"
          style={{
            // Gradiente oscuro de punta a punta a propósito: la punta clara
            // original (#38BDF8) daba ~2.1:1 de contraste con texto blanco
            // (falla WCAG AA, que pide 4.5:1) — este rango se queda entre
            // ~5:1 y ~6.7:1 en toda la burbuja.
            background: isUser ? "linear-gradient(135deg,#1D4ED8,#2563EB)" : "rgba(255,255,255,0.06)",
            border: isUser ? "none" : isError ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(255,255,255,0.12)",
            color: isUser ? "#fff" : "#E2E8F0",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            boxShadow: isUser ? "0 6px 20px rgba(37,99,235,0.3)" : "none",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {isError && (
            <span className="flex items-center gap-1.5 mb-1" style={{ color: "#F87171" }}>
              <AlertCircle className="w-[14px] h-[14px]" /> {shown}
            </span>
          )}
          {!isError && shown}
        </div>
        {isError && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: "#38BDF8" }}
          >
            <RotateCw className="w-[13px] h-[13px]" /> Reintentar
          </button>
        )}
        {/* Timestamp discreto — muy tenue, no compite con el contenido. */}
        <time className="text-[10px] px-1" style={{ color: "rgba(148,163,184,0.45)" }} dateTime={new Date(m.timestamp).toISOString()}>
          {formatTime(m.timestamp)}
        </time>
      </div>
    </motion.div>
  );
};

const AssistantSection = () => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [input, setInput] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  // Ids de los chips vigentes — arrancan en initialChips, después de cada
  // respuesta pasan a ser `node.next` (o initialChips de nuevo si next
  // viene vacío, o fallbackChips si la última respuesta fue un fallback).
  const [chipIds, setChipIds] = useState(initialChips);
  // Si el último nodo respondido tenía cta:true, el botón fijo de
  // WhatsApp se destaca (ver .ds-wa-btn--cta) — se resetea a false en
  // cualquier respuesta sin cta (incluido cualquier fallback).
  const [ctaActive, setCtaActive] = useState(false);
  // Texto de lo último consultado (pregunta del chip o texto libre que
  // matcheó, sin los signos de interrogación) — va en el mensaje
  // precargado de WhatsApp para que el asesor tenga contexto real.
  const [lastContext, setLastContext] = useState("");

  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const welcomeFired = useRef(false);
  const typedIdsRef = useRef(new Set());
  const pendingRetryRef = useRef(null);
  const providerRef = useRef(new ScriptedChatProvider());
  const messagesRef = useRef([]);
  messagesRef.current = messages;
  const advisorBtnRef = useRef(null);
  const sendBtnRef = useRef(null);
  useParticleHover(advisorBtnRef, { variant: "button" });
  useParticleHover(sendBtnRef, { variant: "icon" });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, []);

  // Sigue el mensaje más nuevo. Con un solo mensaje de bienvenida (no una
  // demo de varios) la conversación arranca visible desde el principio sin
  // ayuda extra, y de ahí en más cada mensaje nuevo empuja el scroll hacia
  // abajo, como cualquier chat.
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  // Mensaje de bienvenida único, al entrar en viewport (una sola vez).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || welcomeFired.current) return;
        welcomeFired.current = true;
        io.disconnect();

        const showWelcome = () => {
          setMessages([toMessage({ role: "assistant", content: welcomeMessage }, "sent")]);
          setWelcomed(true);
        };

        if (reducedMotion) {
          showWelcome();
          return;
        }

        (async () => {
          setTyping(true);
          await sleep(700 + Math.random() * 300);
          setTyping(false);
          showWelcome();
        })();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Aplica la respuesta de un nodo YA CONOCIDO (chip clickeado, o texto
  // libre que matcheó) — determinístico, no vuelve a llamar matchNode.
  const applyNodeReply = useCallback((node, userMsgId) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.id === userMsgId ? { ...m, status: "sent" } : m)),
      toMessage({ role: "assistant", content: node.answer }, "sent"),
    ]);
    setChipIds(node.next && node.next.length ? node.next : initialChips);
    setCtaActive(!!node.cta);
    setLastContext(stripQuestionMarks(node.question));
  }, []);

  const applyFallbackReply = useCallback((replyText, rawText, userMsgId) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.id === userMsgId ? { ...m, status: "sent" } : m)),
      toMessage({ role: "assistant", content: replyText }, "sent"),
    ]);
    setChipIds(fallbackChips);
    setCtaActive(false);
    setLastContext(rawText);
  }, []);

  // Texto libre del input: matchNode() decide TODO (respuesta, chips, cta)
  // — el provider solo entrega el texto de la respuesta (mismo texto que
  // node.answer cuando matchea, o un fallback rotado cuando no), para que
  // ApiChatProvider pueda implementar el mismo contrato sin saber qué es
  // un "chip". Volver a llamar matchNode() acá (en vez de que el provider
  // devuelva el nodo) es lo que permite que ese contrato quede minimal.
  const askProvider = useCallback(async (text, userMsgId) => {
    pendingRetryRef.current = text;
    setTyping(true);
    try {
      const replyText = await providerRef.current.sendMessage(text, messagesRef.current, { reducedMotion });
      const node = matchNode(text);
      if (node) applyNodeReply(node, userMsgId);
      else applyFallbackReply(replyText, text, userMsgId);
    } catch {
      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMsgId ? { ...m, status: "sent" } : m)),
        toMessage({ role: "assistant", content: "Ups, hubo un problema de conexión." }, "error"),
      ]);
    } finally {
      setTyping(false);
    }
  }, [reducedMotion, applyNodeReply, applyFallbackReply]);

  const handleSend = useCallback((rawText) => {
    const text = rawText.trim();
    if (!text || typing) return;
    const userMsg = toMessage({ role: "user", content: text }, "sending");
    setMessages((prev) => [...prev, userMsg]);
    askProvider(text, userMsg.id);
  }, [typing, askProvider]);

  // Click en un chip: el nodo ya se conoce (es el que se está renderizando),
  // así que resuelve directo por id — sin pasar por matchNode(), que podría
  // en teoría matchear un nodo distinto si el texto de la pregunta no pega
  // bien con sus propias keywords.
  const handleChipClick = useCallback(async (node) => {
    if (typing) return;
    const userMsg = toMessage({ role: "user", content: node.question }, "sending");
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    if (!reducedMotion) await sleep(700 + Math.random() * 400);
    setTyping(false);
    applyNodeReply(node, userMsg.id);
  }, [typing, reducedMotion, applyNodeReply]);

  const handleRetry = (errorMsgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== errorMsgId));
    if (pendingRetryRef.current) askProvider(pendingRetryRef.current, null);
  };

  const advisorHref = useMemo(() => {
    if (!lastContext) return buildWhatsAppHref("¡Hola! Vengo del asistente de la web de Soul Tech. Quiero más información.");
    return buildWhatsAppHref(`¡Hola! Estuve consultando por ${lastContext} y quiero más info.`);
  }, [lastContext]);

  const visibleChips = useMemo(() => chipIds.map(getNode).filter(Boolean).slice(0, 5), [chipIds]);

  return (
    <section id="asistente" ref={sectionRef} className="relative overflow-hidden py-24 px-6" style={{ scrollMarginTop: 80 }}>
      <SectionBackdrop variant="panel" vignette={1} />
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-10" data-reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ textShadow: "0 0 28px rgba(0,255,255,0.35)" }}>
            Consultá con nuestro asistente
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Respuestas al instante, las 24 horas. Preguntale por servicios, planes y tiempos de desarrollo.
          </p>
        </div>

        <div data-reveal data-delay="120">
          <div className="ds-cf-inner ds-static-glass" style={{ "--edge": REST_EDGE, height: "100%" }}>
            <div className="ds-glass-face flex flex-col" style={FACE_STYLE}>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                <span className="relative w-10 h-10 rounded-full bg-cyan-400/10 border border-cyan-400/35 flex items-center justify-center text-cyan-400 shadow-[0_0_16px_rgba(0,255,255,0.3)] shrink-0">
                  <Bot className="w-[18px] h-[18px]" />
                  <span className="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0a0a14] ds-online-dot" />
                </span>
                <div className="min-w-0">
                  <div className="text-[15px] font-bold text-white">Asistente Soul Tech</div>
                  <div className="text-xs text-green-400">En línea</div>
                </div>
              </div>

              {/* Log de mensajes — SOLO mensajes. Los chips y el CTA de
                  WhatsApp viven afuera de acá a propósito (ver más abajo):
                  son parte de la interfaz, no del hilo, así que no
                  scrollean con la conversación ni se pierden de vista.
                  overflow-x:hidden como red de seguridad además del fix de
                  raíz (min-width:0 en la burbuja + word-break). */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                className="ds-chat-scroll flex flex-col gap-3.5 p-5 overflow-y-auto"
                style={{ height: "min(380px, 46vh)", overflowX: "hidden" }}
              >
                {messages.map((m) => {
                  const shouldType = m.role === "assistant" && !reducedMotion && !typedIdsRef.current.has(m.id);
                  return (
                    <ChatBubble
                      key={m.id}
                      m={m}
                      animate={shouldType}
                      reducedMotion={reducedMotion}
                      onTypeDone={() => typedIdsRef.current.add(m.id)}
                      onRetry={() => handleRetry(m.id)}
                    />
                  );
                })}

                {typing && (
                  <div className="self-start flex items-center gap-2 bg-white/[0.06] border border-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                    <span className="ds-blink w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ animationDelay: "0s" }} />
                    <span className="ds-blink w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ animationDelay: ".2s" }} />
                    <span className="ds-blink w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ animationDelay: ".4s" }} />
                    <span className="sr-only">El asistente está escribiendo</span>
                  </div>
                )}
              </div>

              {/* CTA de WhatsApp: ÚNICO en toda la UI, fijo, fuera del área
                  con scroll. Se destaca (.ds-wa-btn--cta) cuando el último
                  nodo respondido tenía cta:true. */}
              {welcomed && (
                <div className="px-5 py-2.5 border-t border-white/10 bg-white/[0.02]">
                  <a
                    ref={advisorBtnRef}
                    href={advisorHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ds-wa-btn${ctaActive ? " ds-wa-btn--cta" : ""}`}
                  >
                    <MessageCircle className="w-[16px] h-[16px]" />
                    Continuar por WhatsApp
                  </a>
                </div>
              )}

              {/* Chips: SIEMPRE visibles (mientras haya conversación),
                  franja fija justo arriba del input — NO son un mensaje
                  más del hilo, así que viven acá afuera del log, no adentro
                  de él. Scroll horizontal propio si no entran las 4-5
                  preguntas, sin romper el resto del layout. */}
              {welcomed && visibleChips.length > 0 && (
                <div
                  className="ds-chat-scroll ds-chip-scroll flex gap-2 overflow-x-auto px-5 py-2.5 border-t border-white/10"
                  role="group"
                  aria-label="Preguntas sugeridas"
                >
                  {visibleChips.map((node) => (
                    <button key={node.id} type="button" className="ds-chip-btn shrink-0 whitespace-nowrap" onClick={() => handleChipClick(node)}>
                      {node.question}
                    </button>
                  ))}
                </div>
              )}

              <form
                className="flex items-center gap-2.5 px-4 py-3.5 border-t border-white/10 bg-white/[0.02]"
                onSubmit={(e) => { e.preventDefault(); handleSend(input); setInput(""); }}
              >
                <label htmlFor="assistant-input" className="sr-only">Escribí tu consulta</label>
                <input
                  id="assistant-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu consulta..."
                  disabled={typing}
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-full px-[18px] py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-400/60 transition-all disabled:opacity-60"
                />
                <button
                  ref={sendBtnRef}
                  type="submit"
                  aria-label="Enviar"
                  disabled={typing || !input.trim()}
                  className="ds-icon-btn-rotate w-[46px] h-[46px] rounded-full text-white flex items-center justify-center shrink-0 transition-all shadow-[0_0_18px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.7)] disabled:opacity-50 disabled:shadow-none"
                  style={{ background: "linear-gradient(135deg,#06b6d4,#2563eb)" }}
                >
                  <Send className="w-[17px] h-[17px]" />
                </button>
              </form>
            </div>
            <GlassFloor variant="full" />
            <GlassReflection variant="grid" sizeStyle={FACE_STYLE} />
            <GlassContactLight variant="full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantSection;
