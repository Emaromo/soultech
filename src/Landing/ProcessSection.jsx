import React from "react";
import { Lightbulb, FileCode2, Rocket, Users } from "lucide-react";

const ProcessSection = () => {
  const steps = [
    {
      title: "1. Análisis y Reunión Inicial",
      icon: <Lightbulb className="w-8 h-8 text-cyan-400" />,
      desc: "Escuchamos tus necesidades y analizamos tu negocio para definir objetivos claros y crear una propuesta a medida.",
    },
    {
      title: "2. Diseño y Planificación",
      icon: <FileCode2 className="w-8 h-8 text-blue-400" />,
      desc: "Diseñamos la interfaz con enfoque en experiencia de usuario, estética y coherencia visual con tu marca.",
    },
    {
      title: "3. Desarrollo y Pruebas",
      icon: <Rocket className="w-8 h-8 text-purple-400" />,
      desc: "Desarrollamos tu aplicación con pruebas continuas para asegurar calidad, seguridad y rendimiento.",
    },
    {
      title: "4. Lanzamiento y Acompañamiento",
      icon: <Users className="w-8 h-8 text-green-400" />,
      desc: "Lanzamos la app y brindamos soporte y actualizaciones para acompañar el crecimiento de tu negocio.",
    },
  ];

  return (
    <section id="procesos" className="py-24 futuristic-bg relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* === TÍTULO === */}
        <div className="text-center mb-20 slide-in-down">
          <h2 className="text-4xl font-bold text-white mb-4 glow-text">
            Nuestros Procesos
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Así trabajamos cada proyecto: desde la idea inicial hasta el
            lanzamiento y acompañamiento continuo. Un proceso claro, ágil y
            personalizado para cada cliente.
          </p>
        </div>

        {/* === TIMELINE HORIZONTAL === */}
        <div className="relative flex flex-wrap lg:flex-nowrap justify-center items-start gap-10">
          {/* === Línea de energía dinámica === */}
          <div className="hidden lg:block absolute top-[3.8rem] left-0 w-full h-[4px] rounded-full overflow-hidden bg-[rgba(255,255,255,0.1)]">
            <div className="absolute top-0 left-0 h-full w-full bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.8),rgba(255,255,255,0.8),transparent)] animate-energyFlow hue-rotate" />
          </div>

          {/* === PASOS === */}
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative glass-panel panel-3d text-center p-6 rounded-2xl border border-white/10 
              shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] 
              transition-all duration-500 flex-1 min-w-[240px] max-w-[260px] min-h-[260px] 
              flex flex-col justify-between bg-white/5 backdrop-blur-sm"
            >
              {/* PUNTO LUMINOSO */}
              <div className="hidden lg:flex justify-center absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse"></div>
              </div>

              <div className="flex justify-center mb-3">{step.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* === FIGURAS DECORATIVAS === */}
      <div className="absolute top-16 right-20 w-24 h-24 border border-blue-500/20 rotate-12 floating-element"></div>
      <div
        className="absolute bottom-10 left-10 w-20 h-20 border border-purple-500/20 rotate-45 floating-element"
        style={{ animationDelay: "-3s" }}
      ></div>

      {/* === ANIMACIONES === */}
      <style>
        {`
          @keyframes energyFlow {
            0% { transform: translateX(-100%); opacity: 0.6; }
            50% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0.6; }
          }

          .animate-energyFlow {
            animation: energyFlow 5s linear infinite, colorShift 8s linear infinite;
          }

          @keyframes colorShift {
            0% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
            100% { filter: hue-rotate(360deg); }
          }
        `}
      </style>
    </section>
  );
};

export default ProcessSection;
