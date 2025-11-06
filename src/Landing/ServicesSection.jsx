import React from "react";

const ServicesSection = () => {
  const services = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-cyan-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          ></path>
        </svg>
      ),
      title: "Apps Móviles",
      description:
        "Aplicaciones nativas e híbridas para iOS y Android, diseñadas para ofrecer la mejor experiencia de usuario.",
      features: [
        "React Native & Flutter",
        "Diseño UX/UI personalizado",
        "Integración con APIs",
      ],
      animation: "slide-in-left",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      ),
      title: "Aplicaciones Web",
      description:
        "Plataformas web robustas y escalables que se adaptan perfectamente a los procesos de tu empresa.",
      features: [
        "React, Vue.js, Angular",
        "Arquitectura escalable",
        "Responsive design",
      ],
      animation: "slide-in-up",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
          ></path>
        </svg>
      ),
      title: "Sistemas Backend",
      description:
        "APIs y sistemas backend seguros y eficientes para gestionar toda la lógica de negocio de tu aplicación.",
      features: [
        "Node.js, Python, .NET",
        "Bases de datos optimizadas",
        "Seguridad avanzada",
      ],
      animation: "slide-in-right",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-cyan-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7l9-4 9 4v6c0 5-4 9-9 9s-9-4-9-9V7z"
          ></path>
        </svg>
      ),
      title: "Apps Multiplataforma",
      description:
        "Desarrollamos aplicaciones que funcionan sin problemas en cualquier dispositivo, con un diseño responsivo y una experiencia coherente entre plataformas.",
      features: [
        "Tecnologías híbridas modernas",
        "Optimización de rendimiento móvil y web",
        "Interfaz adaptable a pantallas",
      ],
      animation: "slide-in-up",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      ),
      title: "Diseño UX/UI",
      description:
        "Creamos experiencias visuales elegantes y funcionales, centradas en el usuario y alineadas con la identidad de tu marca.",
      features: [
        "Prototipos interactivos",
        "Diseños modernos y minimalistas",
        "Flujos de navegación intuitivos",
      ],
      animation: "slide-in-left",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-blue-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
      ),
      title: "Consultoría Tecnológica",
      description:
        "Te acompañamos en todo el proceso de transformación digital, desde la idea hasta la implementación final del producto.",
      features: [
        "Análisis de requerimientos",
        "Estrategia tecnológica",
        "Soporte y mantenimiento continuo",
      ],
      animation: "slide-in-right",
    },
  ];

  return (
    <section id="servicios" className="py-20 futuristic-bg relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 slide-in-down">
          <h2 className="text-4xl font-bold text-white mb-4 glow-text">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ofrecemos soluciones completas y personalizadas para potenciar tu
            presencia digital y optimizar tus procesos de negocio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container">
          {services.map((service, index) => (
            <div
              key={index}
              className={`glass-panel panel-3d p-8 rounded-xl ${service.animation}`}
            >
              <div className="w-16 h-16 glass-panel rounded-lg flex items-center justify-center mb-6 neon-border">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 glow-text">
                {service.title}
              </h3>
              <p className="text-gray-300 mb-6">{service.description}</p>
              <ul className="text-sm text-gray-400 space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Figuras decorativas flotantes */}
      <div className="absolute top-10 right-20 w-32 h-32 border border-blue-500/20 rotate-12 floating-element"></div>
      <div
        className="absolute bottom-10 left-20 w-24 h-24 border border-purple-500/20 rotate-45 floating-element"
        style={{ animationDelay: "-3s" }}
      ></div>
    </section>
  );
};

export default ServicesSection;
