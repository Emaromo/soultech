import React, { useEffect } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Send,
} from "lucide-react";

const FooterSoulTech = () => {
  useEffect(() => {
    const container = document.getElementById("footer-particles");
    if (!container) return;

    container.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "footer-particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 6 + Math.random() * 8 + "s";
      p.style.animationDelay = Math.random() * 5 + "s";
      container.appendChild(p);
    }
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const success = document.getElementById("newsletter-success");
    success.classList.add("show");
    setTimeout(() => success.classList.remove("show"), 4000);
  };

  return (
    <footer className="relative overflow-hidden mt-0 text-center md:text-left">
      {/* === Fondo oscuro === */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#0a0a1a] to-[#101020]" />
      <div id="footer-particles" className="absolute inset-0 footer-particles" />

      {/* === Línea de energía superior === */}
      <div className="absolute top-0 left-0 w-full h-[4px] z-20">
        <div className="w-[200%] h-full animate-energyGradient shadow-[0_0_25px_5px_rgba(0,255,255,0.4)]" />
      </div>

      {/* === Contenido === */}
      <div className="relative z-10 container mx-auto px-6 py-16 text-gray-300 mt-[4px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-10 place-items-center md:place-items-start">
          {/* === LOGO === */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src="/letras.png"
              alt="Soul Tech"
              className="w-44 mb-4 select-none"
            />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Tecnología, diseño y visión del futuro. <br />
              Impulsamos tu crecimiento con innovación real  <br />
              soluciones digitales inteligentes.
            </p>

            {/* Íconos sociales */}
            <div className="flex justify-center md:justify-start gap-4 mt-5">
              {[
                { icon: Facebook, color: "#1877F2" },
                { icon: Instagram, color: "#E4405F" },
                { icon: Linkedin, color: "#0A66C2" },
                { icon: Twitter, color: "#1DA1F2" },
              ].map(({ icon: Icon, color }, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full bg-white/5 border border-white/10 transition hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </a>
              ))}
            </div>
          </div>

          {/* === SERVICIOS === */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-white mb-4">Servicios</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Aplicaciones a medida</li>
              <li>IA & Automatización</li>
              <li>Diseño Web Avanzado</li>
              <li>Soporte técnico</li>
            </ul>
          </div>

          {/* === EMPRESA === */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Sobre nosotros</li>
              <li>Carreras</li>
              <li>Casos de éxito</li>
              <li>Contacto</li>
            </ul>
          </div>

          {/* === NEWSLETTER === */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-4">
              Suscribite
            </h3>
            <p className="text-sm text-gray-400 mb-3 max-w-xs">
              Recibí novedades, promociones y lanzamientos tecnológicos antes que nadie.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-xs sm:max-w-sm items-center bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-cyan-400 transition-all"
            >
              <Mail className="w-5 h-5 ml-4 text-gray-400" />
              <input
                type="email"
                placeholder="tu@email.com"
                required
                className="flex-grow bg-transparent text-white placeholder-gray-500 px-3 py-3 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-white hover:from-blue-600 hover:to-purple-500 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div
              className="newsletter-success text-cyan-400 mt-3 text-sm opacity-0 transition-opacity duration-500"
              id="newsletter-success"
            >
              ✅ ¡Gracias por suscribirte!
            </div>
          </div>
        </div>

        {/* === LÍNEA INFERIOR === */}
        <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © 2025{" "}
          <span className="text-white font-medium">Soul Tech</span> — Innovación
          digital futurista
        </div>
      </div>

      {/* === ESTILOS === */}
      <style>
        {`
          /* Partículas del fondo */
          .footer-particle {
            position: absolute;
            bottom: 0;
            width: 4px;
            height: 4px;
            background: rgba(0, 255, 255, 0.4);
            border-radius: 50%;
            animation: rise 8s linear infinite;
          }
          @keyframes rise {
            0% { transform: translateY(0) scale(1); opacity: 0.3; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
          }

          /* Línea superior animada */
          .animate-energyGradient {
            background: linear-gradient(90deg, #00ffff, #008cff, #7b2ff7, #00ffff);
            background-size: 300% 100%;
            animation: energyFlow 6s linear infinite;
          }
          @keyframes energyFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Mensaje de newsletter */
          .newsletter-success.show {
            opacity: 1 !important;
          }

          /* Responsivo */
          @media (max-width: 768px) {
            footer {
              text-align: center;
            }
            footer ul {
              text-align: center;
            }
            footer form {
              justify-content: center;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default FooterSoulTech;
