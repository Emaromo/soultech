import React, { useRef } from "react";
import { motion } from "framer-motion";
import MarqueeLogos from "./MarqueeLogos";
import useParticleHover from "./particles/useParticleHover";

const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4";

const NOISE_BG =
  "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22/></svg>')";

const HeroSection = () => {
  const ctaRef = useRef(null);
  useParticleHover(ctaRef, { variant: "button" });

  return (
  <section
    className="relative flex flex-col overflow-visible text-white"
    style={{ minHeight: "100vh" }}
  >
    {/* Capas de fondo (color base + video/ruido), separadas del contenido a
        propósito: llevan .hero-bg-fade para desvanecerse hacia abajo en vez
        de cortar en seco contra la sección siguiente (ver designV2.css). El
        contenido (texto/CTA/marquee) NO lleva esta clase — sigue opaco. */}
    <div className="absolute inset-0 hero-bg-fade" style={{ background: "hsl(260,87%,3%)" }} />
    <div className="absolute inset-0 overflow-hidden hero-bg-fade">
      <video
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        src={HERO_VIDEO_SRC}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "contrast(1.08) saturate(1.12) brightness(1.03)" }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05, backgroundImage: NOISE_BG, backgroundSize: "120px 120px" }} />
    </div>

    <div className="relative z-10 flex-1 flex flex-col" style={{ paddingTop: 72 }}>
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
        <div
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{ transform: "translate(-50%,-50%)", width: "min(984px,110vw)", height: 527, opacity: 0.9, background: "#030712", filter: "blur(82px)" }}
        />
        <motion.h1
          className="relative m-0 font-medium leading-[1.02] tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'General Sans', Inter, sans-serif", fontSize: "clamp(64px,12vw,220px)", color: "#f2f1ee" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          Soul{" "}
          <span
            className="ds-shiny-text"
            style={{
              backgroundImage:
                "linear-gradient(to right,#091020 0%,#0B2551 12.5%,#A4F4FD 32.5%,#00d2ff 50%,#0B2551 67.5%,#091020 87.5%,#091020 100%)",
            }}
          >
            Tech
          </span>
        </motion.h1>

        <motion.p
          className="relative mt-2 text-lg leading-8 max-w-md"
          style={{ color: "hsl(40,6%,82%)", opacity: 0.8 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          Desarrollamos soluciones tecnológicas personalizadas que impulsan el crecimiento de tu empresa.
        </motion.p>

        <motion.a
          ref={ctaRef}
          href="https://wa.me/5493516325887?text=%C2%A1Hola!%20Quiero%20agendar%20una%20consulta"
          target="_blank"
          rel="noopener noreferrer"
          className="ds-liquid-glass hero-cta relative inline-flex items-center justify-center mt-6 px-[29px] py-6 rounded-full text-[#f2f1ee] text-[15px] font-semibold leading-none no-underline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          whileHover={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 0 28px rgba(168,85,247,0.3)" }}
        >
          Agendá una consulta
        </motion.a>
      </div>

      <MarqueeLogos />
    </div>

    <div className="hero-divider z-[11]" aria-hidden="true">
      <div className="hero-divider__beam" />
    </div>
  </section>
  );
};

export default HeroSection;
