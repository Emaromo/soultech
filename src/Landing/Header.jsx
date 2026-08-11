import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useParticleHover from "./particles/useParticleHover";
import SoulTechLogo from "./SoulTechLogo";

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Precios", href: "#precios" },
  { label: "Clientes", href: "#clientes" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Contacto", href: "#contacto" },
];

const WHATSAPP_QUOTE_URL = "https://wa.me/5493516325887?text=%C2%A1Hola!%20Quiero%20cotizar%20un%20proyecto";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Breakpoint aparte del isMobile de arriba (860px, colapso a hamburguesa):
  // el logo/wordmark sólo necesitan achicarse en teléfonos angostos de
  // verdad (probado 360-420px); entre 640-860px (tablets) el tamaño de
  // desktop entra perfecto igual.
  const [isSmallPhone, setIsSmallPhone] = useState(false);
  const ctaRef = useRef(null);
  useParticleHover(ctaRef, { variant: "button" });

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 860);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsSmallPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 border-b border-cyan-400/20"
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(24px)", boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
      >
        <motion.nav
          className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between gap-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <a href="/" className="soultech-logo-link flex items-center no-underline" aria-label="Soul Tech - Inicio">
            <SoulTechLogo size={isSmallPhone ? 38 : 55} />
            {/* Antes se ocultaba entero en móvil (<860px) — el logo es la
                marca, es lo último que debería desaparecer. Ahora se ve
                siempre; en teléfonos angostos de verdad (isSmallPhone) se
                achican escudo y wordmark juntos y proporcionalmente en vez
                de sacar uno de los dos (ver .soultech-wordmark-img--sm). */}
            <img
              src="letras.png"
              alt="Soul Tech"
              className={`soultech-wordmark-img${isSmallPhone ? " soultech-wordmark-img--sm" : ""}`}
            />
          </a>

          {!isMobile && (
            <>
              <nav className="flex items-center gap-9 text-[15px] font-medium">
                {NAV_LINKS.map((item) => (
                  <a key={item.href} href={item.href} className="ds-nav-link">
                    {item.label}
                  </a>
                ))}
              </nav>
              <a
                ref={ctaRef}
                href={WHATSAPP_QUOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-header-cta inline-block px-[22px] py-[10px] rounded-full text-white font-semibold text-sm whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#06b6d4,#2563eb)", boxShadow: "0 0 18px rgba(0,255,255,0.4)" }}
              >
                Cotizar Proyecto
              </a>
            </>
          )}

          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
              aria-expanded={menuOpen}
              className="ds-hamburger-btn relative z-[60] w-11 h-11 flex flex-col items-center justify-center gap-[5px] shrink-0 rounded-xl cursor-pointer"
            >
              <motion.span className="block w-5 h-0.5 rounded-full bg-cyan-400" animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }} transition={{ duration: 0.3 }} />
              <motion.span className="block w-5 h-0.5 rounded-full bg-cyan-400" animate={{ opacity: menuOpen ? 0 : 1 }} transition={{ duration: 0.3 }} />
              <motion.span className="block w-5 h-0.5 rounded-full bg-cyan-400" animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }} transition={{ duration: 0.3 }} />
            </button>
          )}
        </motion.nav>
      </header>

      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-white text-[28px] font-bold hover:text-cyan-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href={WHATSAPP_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-white font-semibold text-base px-8 py-3.5 rounded-full"
              style={{ background: "linear-gradient(135deg,#06b6d4,#2563eb)", boxShadow: "0 0 24px rgba(0,255,255,0.5)" }}
            >
              Cotizar Proyecto
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
