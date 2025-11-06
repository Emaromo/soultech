import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si la pantalla es móvil (y actualizar si se redimensiona)
  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesLoaded = () => {};

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 backdrop-blur-lg border-b border-green-400/30 shadow-lg">
      {/* === Partículas === */}
      <Particles
        id="tsparticles-header"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 60,
          background: { color: "transparent" },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              repulse: { distance: 150, duration: 0.4 },
              push: { quantity: 2 },
            },
          },
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ["#00ff99", "#0ff", "#3b82f6"] },
            shape: { type: "circle" },
            opacity: { value: 1 },
            size: { value: { min: 4, max: 6 } },
            links: {
              enable: true,
              distance: 130,
              color: "#00ff99",
              opacity: 0.6,
              width: 1.5,
            },
            move: {
              enable: true,
              speed: 1.8,
              random: true,
              outModes: { default: "bounce" },
            },
          },
        }}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />

      {/* === NAV PRINCIPAL === */}
      <motion.nav
        className="container mx-auto px-4 sm:px-6 h-full flex justify-between items-center relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
    {/* ==== LOGO ==== */}
<div className="flex items-center gap-2 sm:gap-3 h-full">
  <motion.img
    src="/soultech1.png"
    alt="Soul Tech Logo"
    className="h-14 sm:h-16 w-auto object-contain mix-blend-screen -mb-1"
    style={{
      filter: "drop-shadow(0 0 8px #3682a2ff) drop-shadow(0 0 9px #0f5491ff)",
    }}
    animate={{
      scale: [1, 1.03, 1], // solo el pulso suave
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

          <motion.img
            src="/letras.png"
            alt="Soul Tech Texto"
            className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            style={{ marginLeft: "-8px" }}
            initial={{ opacity: 0.9 }}
            animate={{
              opacity: [0.9, 1, 0.9],
              filter: [
                "drop-shadow(0 0 6px #ffffff)",
                "drop-shadow(0 0 7px #ffffff)",
                "drop-shadow(0 0 6px #ffffff)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* ==== MENÚ (solo escritorio) ==== */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 text-base lg:text-lg">
          {["Servicios", "Precios", "Clientes", "Contacto"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-300 hover:text-blue-400 hover:drop-shadow-[0_0_3px_#00ff99] transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        {/* ==== BOTÓN DE COTIZAR (solo escritorio) ==== */}
        <a
  href="https://wa.me/5493516325887"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setMenuOpen(false)}
  className="
    hidden md:inline-block       /* 👈 Oculto en móviles, visible desde pantallas medianas */
    mt-2 px-6 py-2 rounded-lg font-semibold text-white text-base
    bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500
    transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]
    text-center
  "
>
  Cotizar Proyecto
</a>


        {/* ==== MENÚ HAMBURGUESA (solo móvil) ==== */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none md:hidden"
          >
            <motion.div
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-blue-400 drop-shadow-[0_0_4px_#00ff99]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    menuOpen
                      ? "M6 18L18 6M6 6l12 12" // X
                      : "M4 6h16M4 12h16M4 18h16" // ☰
                  }
                />
              </svg>
            </motion.div>
          </button>
        )}
      </motion.nav>

      {/* ==== MENÚ DESPLEGABLE (solo móvil) ==== */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
           className="absolute top-20 left-0 w-full bg-[linear-gradient(120deg,rgba(60,100,150,0.55),rgba(15,30,70,0.75))] backdrop-blur-xl border-t border-blue-400/40 shadow-[0_0_25px_rgba(0,255,255,0.15)] flex flex-col items-center space-y-4 md:hidden"


          >
            {["Servicios", "Precios", "Clientes", "Contacto"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 text-lg hover:text-blue-400 transition-all duration-300"
              >
                {item}
              </a>
            ))}

            <a
  href="https://wa.me/5493516325887"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setMenuOpen(false)}
  className="w-full py-3 rounded-lg font-semibold text-lg text-white 
  bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 
  transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] 
  text-center block"
>
  Cotizar Proyecto
</a>

          </motion.div>
        )}
      </AnimatePresence>
      {/* === TIRA NEÓN AL FINAL === */}
<div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-neon-line"></div>

    </header>
  );
};

export default Header;
