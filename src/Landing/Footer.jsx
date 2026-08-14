import React, { useEffect, useRef, useState } from "react";
import { Mail, Send, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from "lucide-react";
import AmbientParticles from "./AmbientParticles";
import useParticleHover from "./particles/useParticleHover";

// Banda de cierre con video de fondo, antes de las columnas de links de
// siempre — mismo patrón de <video> (muted/loop/inline/autoPlay + overlay
// para contraste) que ya usa HeroSection.jsx, pero con un asset propio.
const FOOTER_CTA_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

// Mismo número/patrón de WhatsApp que el resto del sitio (Header/Hero),
// solo cambia el mensaje precargado para reflejar el contexto "cierre".
const FOOTER_CTA_WHATSAPP_URL =
  "https://wa.me/5493516325887?text=%C2%A1Hola!%20Quiero%20cotizar%20mi%20proyecto";

const SOCIALS = [
  { label: "Facebook", Icon: Facebook },
  { label: "Instagram", Icon: Instagram },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Twitter", Icon: Twitter },
];

const SocialButton = ({ label, Icon }) => {
  const ref = useRef(null);
  useParticleHover(ref, { variant: "icon" });
  return (
    <button ref={ref} type="button" aria-label={`Seguinos en ${label}`} className="ds-social-btn">
      <Icon className="w-[17px] h-[17px]" />
    </button>
  );
};

const FOOTER_LINK_CLASS = "ds-footer-link text-sm";

// Mismo degradado vertical de siempre, pero como overlay CASI opaco sobre
// fondo-tech4: la imagen sola tiene un remolino brillante concentrado a la
// izquierda (el mismo problema de "mancha" que ya se corrigió), así que el
// overlay la deja como textura sutil de fondo en vez de protagonista, y
// conserva el mismo tono parejo de arriba a abajo para no reintroducir la
// costura ni perder contraste en los textos.
const FOOTER_BG =
  "linear-gradient(to bottom, rgba(14, 26, 96, 0.72) 0%, rgb(5, 18, 37) 25%, rgba(10, 51, 104, 0.57) 55%, rgb(1, 5, 12) 100%), url(/fondo-tech4.jpg)";
const FOOTER_BG_STYLE = {
  backgroundImage: FOOTER_BG,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

// Que las partículas propias no arranquen con un corte duro contra lo que
// hay arriba: se funden en el primer ~18% de la altura del footer (spec:
// "15-20%"). En % (no px) para que escale con el alto real del footer.
const PARTICLES_FADE_STYLE = {
  maskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
};

const Footer = () => {
  const [newsEmail, setNewsEmail] = useState("");
  const [newsError, setNewsError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  // Inicializador LAZY (no `useState(false)`): este isMobile ahora decide
  // si se monta el <video> de abajo (antes sólo afectaba tamaños/opacidad
  // de partículas, donde un frame de más con el valor "equivocado" no
  // importaba). Con `false` fijo, en móvil el primer render igual montaba
  // el <video> con autoPlay+preload="auto" -- la descarga de 7MB ya
  // arrancaba antes de que el useEffect corrigiera el valor y lo sacara del
  // DOM. Mismo fix y misma razón que HeroSection.jsx (ver su comentario).
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  );
  const subscribeBtnRef = useRef(null);
  useParticleHover(subscribeBtnRef, { variant: "button" });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsEmail)) {
      setNewsError("Ingresá un email válido.");
      return;
    }
    setNewsError("");
    setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden" style={FOOTER_BG_STYLE}>
      {/* --- Banda de cierre: video de fondo a pantalla completa + heading
          grande con degradado animado (reusa .ds-shiny-text, la misma
          clase que "Soul Tech" en el Hero) + CTA a WhatsApp. Adaptación de
          un layout tipo "hero" que llegó pensado para una landing de
          cursos (nav propia, "seats", "designers launched") — se sacó la
          nav (el sitio ya tiene su Header, y acá abajo repetirla no suma)
          y se reescribió todo el copy para Soul Tech. --- */}
      <div className="relative overflow-hidden min-h-screen flex flex-col">
        <div className="absolute inset-0" style={{ background: "#000" }} />
        {/* Sólo desktop: en móvil, el fondo negro de arriba + el degradado de
            abajo alcanzan (mismo criterio que HeroSection.jsx) -- este video
            con autoPlay+preload="auto" se descargaba siempre (7MB) aunque
            preload="none" no hubiera alcanzado igual por el autoPlay. */}
        {!isMobile && (
          <video
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            src={FOOTER_CTA_VIDEO_SRC}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(1,5,12,0.5) 0%, rgba(1,5,12,0.72) 55%, rgba(1,5,12,0.95) 100%)" }}
        />

        <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 pt-24 pb-10">
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-md m-0">
              Diseñamos y desarrollamos software a medida con tecnología de punta, pensado para escalar junto a tu negocio.
            </p>
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-md m-0 lg:text-right lg:justify-self-end">
              Tu próximo proyecto, en manos de un equipo full-stack.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <p data-reveal data-delay="80" className="uppercase text-white/80 text-xs md:text-sm tracking-tight mb-4 m-0">
              Agenda abierta para nuevos proyectos este mes
            </p>
            <h2
              data-reveal
              data-delay="140"
              className="m-0 font-medium leading-[0.85] tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            >
              <span className="block text-white">Convertí tu idea</span>
              <span
                className="block ds-shiny-text"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg,#0B2551 0%,#64CEFB 30%,#ffffff 50%,#64CEFB 70%,#0B2551 100%)",
                }}
              >
                en producto digital.
              </span>
            </h2>

            <a
              href={FOOTER_CTA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              data-delay="220"
              className="group mt-10 inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white rounded-full px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium no-underline transition-colors"
            >
              Cotizar por WhatsApp
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Wrapper propio para las columnas de siempre: el bg/gradiente y las
          partículas de acá abajo son "absolute inset-0" y necesitan un
          ancestro relative que mida SOLO esta parte (no la banda de video
          de arriba, que ya tiene su propio fondo) para no taparla ni
          estirarse por accidente a lo largo de todo el footer. */}
      <div className="relative">
        <div className="absolute inset-0" style={{ ...PARTICLES_FADE_STYLE, opacity: isMobile ? 0.6 : 1 }}>
          <AmbientParticles count={isMobile ? 6 : 12} seed={500} />
        </div>

        <div
          className="relative max-w-6xl mx-auto px-6 pt-16 pb-8 grid gap-10 text-left grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr]"
        >
        <div data-reveal>
          <div className="flex items-center gap-2.5 mb-3">
            {/* .webp, 500px (originalmente 1334px mostrado a 34px — optimización de
                performance mobile, 2026-08); ver mismo criterio en SoulTechLogo.jsx. */}
            <img src="soultech1.webp" alt="Soul Tech" className="w-[34px] h-[34px] object-contain ds-logo-float" />
            <span className="text-[19px] font-extrabold text-white" style={{ filter: "drop-shadow(0 0 10px rgba(0,255,255,0.5))" }}>
              Soul<span className="text-cyan-400"> Tech</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 mb-5">Tecnología, diseño y visión del futuro.</p>
          <div className="flex gap-2.5">
            {SOCIALS.map(({ label, Icon }) => (
              <SocialButton key={label} label={label} Icon={Icon} />
            ))}
          </div>
        </div>

        <div data-reveal data-delay="80">
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Servicios</h4>
          <div className="flex flex-col gap-3.5">
            {["Apps Móviles", "Aplicaciones Web", "Sistemas Backend", "Diseño UX/UI"].map((s) => (
              <a key={s} href="#servicios" className={FOOTER_LINK_CLASS}>
                {s}
              </a>
            ))}
          </div>
        </div>

        <div data-reveal data-delay="160">
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Empresa</h4>
          <div className="flex flex-col gap-3.5">
            <a href="#clientes" className={FOOTER_LINK_CLASS}>Clientes</a>
            <a href="#proyectos" className={FOOTER_LINK_CLASS}>Proyectos</a>
            <a href="#procesos" className={FOOTER_LINK_CLASS}>Procesos</a>
            <a href="#precios" className={FOOTER_LINK_CLASS}>Precios</a>
            <a href="#contacto" className={FOOTER_LINK_CLASS}>Contacto</a>
          </div>
        </div>

        <div data-reveal data-delay="240">
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Novedades</h4>
          <p className="text-[13.5px] text-gray-400 leading-snug mb-3.5">Recibí tendencias de tecnología y novedades del estudio.</p>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} noValidate>
              <label htmlFor="footer-newsletter-email" className="ds-input-label">Tu email</label>
              <input
                id="footer-newsletter-email"
                value={newsEmail}
                onChange={(e) => { setNewsEmail(e.target.value); if (newsError) setNewsError(""); }}
                type="email"
                placeholder="tu@email.com"
                className={`ds-input${newsError ? " ds-input--error" : ""}`}
                aria-invalid={!!newsError}
                aria-describedby={newsError ? "footer-newsletter-error" : undefined}
              />
              {newsError && <p id="footer-newsletter-error" className="ds-input-error">{newsError}</p>}
              <button ref={subscribeBtnRef} type="submit" aria-label="Suscribirse al newsletter" className="ds-wa-btn" style={{ marginTop: 10 }}>
                <Send className="w-[16px] h-[16px]" />
                Suscribirme
              </button>
            </form>
          ) : (
            <p className="ds-check-pop text-sm" style={{ color: "#4ade80" }}>
              <Mail className="inline w-4 h-4 mr-1 -mt-0.5" /> ¡Gracias por suscribirte!
            </p>
          )}
        </div>
        </div>
      </div>

      {/* Scrim leve: en el borde inferior el degradado ya llegó a #bdcee4, y
          #94A3B8 (color de copyright pedido) da ~4.3:1 ahí — por debajo del
          4.5:1 de WCAG AA. Un scrim sutil alcanza para pasar el mínimo sin
          agregar ningún borde ni corte visible. */}
      <div className="relative border-t border-white/10 py-5 px-6 text-center text-[13px]" style={{ background: "rgba(2,6,14,0.35)", color: "#94A3B8" }}>
        © 2026 Soul Tech — Innovación digital futurista
      </div>
    </footer>
  );
};

export default Footer;
