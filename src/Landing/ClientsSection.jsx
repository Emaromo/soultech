import React, { useState, useEffect } from "react";
import { Building2, UserCog, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ClientsSection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndexes, setCurrentIndexes] = useState({});

  const clientTypes = [
    {
      title: "Pequeñas Empresas y Comercios",
      color: "cyan",
      icon: <Building2 className="w-12 h-12 text-cyan-400 group-hover:text-cyan-300 transition" />,
      includes: [
        "Aplicación web a medida para gestión de tu comercio.",
        "Client Dashboard para promociones, reservas e información.",
        "Admin Dashboard para ventas, stock, facturación y turnos.",
        "Landing Page profesional con contacto y encuestas por WhatsApp.",
        "Dominio gratis por 6 meses.",
        "Actualizaciones mensuales con mejoras continuas.",
      ],
      features: [
        "Control de ventas y stock en tiempo real.",
        "Agenda de turnos online.",
        "Gestión de promociones y clientes desde un panel central.",
        "Reportes automáticos de ventas y clientes.",
      ],
      ad: "Tu comercio online y organizado en un solo lugar: ventas, stock, turnos y contacto con tus clientes desde una sola app.",
    },
    {
      title: "Profesionales Independientes",
      color: "purple",
      icon: <UserCog className="w-12 h-12 text-purple-400 group-hover:text-purple-300 transition" />,
      includes: [
        "Aplicación web personalizada para gestionar tu negocio profesional.",
        "Client Dashboard para seguimiento de servicios, rutinas o tratamientos.",
        "Admin Dashboard para control de clientes, sesiones, pagos y resultados.",
        "Landing Page profesional con contacto vía WhatsApp.",
        "Dominio gratis por 6 meses.",
        "Actualizaciones mensuales adaptadas a tu rubro.",
      ],
      features: [
        "Técnicos: seguimiento en tiempo real de reparaciones.",
        "Psicólogos: control de pacientes y tareas vía email.",
        "Personal Trainers / Nutricionistas: rutinas, dietas, seguimiento y recordatorios.",
        "Esteticistas / Manicuras: gestión de turnos, historial y pagos.",
      ],
      ad: "Tu negocio profesional en la web, organizado y conectado con tus clientes. Seguimiento de servicios, rutinas o tratamientos, todo desde tu panel personal.",
    },
  ];

  const projectExamples = [
    {
      title: "App para Comercios",
      images: ["/Captura.PNG", "/Captura1.PNG", "/Captura33.PNG"],
      desc: "Sistema de gestión de ventas, stock y promociones en tiempo real.",
    },
    {
      title: "Panel para Profesionales",
      images: ["/psico.png", "/img3.jpg", "/Captur3.png"],
      desc: "Dashboard para técnicos, psicólogos o entrenadores con seguimiento de clientes.",
    },
    {
      title: "Landing Page Empresarial",
      images: ["/tiket1.png", "/dashclient.png", "/login.png"],
      desc: "Diseño moderno y optimizado para captar clientes desde la web.",
    },
  ];

  // 🎞️ Rotación automática de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndexes((prev) => {
        const next = { ...prev };
        projectExamples.forEach((proj, i) => {
          next[i] = ((prev[i] ?? 0) + 1) % proj.images.length;
        });
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="clientes" className="py-20 futuristic-bg relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">

        {/* === TÍTULO PRINCIPAL === */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4 glow-text">
            Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Desarrollamos{" "}
            <span className="font-semibold text-white">aplicaciones a medida</span> para{" "}
            <span className="font-semibold text-white">comercios y profesionales</span> que buscan digitalizar su gestión y potenciar su crecimiento.
          </p>
        </motion.div>

        {/* === BLOQUES DE CLIENTES === */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {clientTypes.map((client, index) => (
            <motion.div
              key={index}
              className={`relative group glass-panel panel-3d p-10 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-${client.color}-400/40 transition-all duration-500`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* ÍCONO + TÍTULO CENTRADOS */}
              <div className="flex flex-col items-center justify-center text-center mb-8">
                <div className={`glass-panel w-20 h-20 rounded-xl flex items-center justify-center border border-${client.color}-500/20 shadow-[0_0_20px_rgba(255,255,255,0.15)] mb-4`}>
                  {client.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{client.title}</h3>
              </div>

              {/* CONTENIDO DETALLADO */}
              <div className="space-y-6 text-gray-300 text-left">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">💻 Qué incluye</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {client.includes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">🚀 Funcionalidades destacadas</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {client.features.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/10 italic text-sm">
                  “{client.ad}”
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* === EJEMPLOS VISUALES === */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-6 glow-text">
            Aplicaciones exitosas de nuestros clientes
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interfaces modernas y funcionales creadas para diferentes rubros. Cada diseño se adapta a la identidad de tu negocio.
          </p>
        </motion.div>

        {/* === GALERÍA === */}
        <div className="grid md:grid-cols-3 gap-8">
          {projectExamples.map((proj, i) => {
            const active = proj.images[currentIndexes[i] || 0];
            return (
              <motion.div
                key={i}
                onClick={() => setSelectedImage(active)}
                className="group relative glass-panel panel-3d rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-500 cursor-pointer border border-white/10 bg-gradient-to-b from-[#101020]/70 to-[#1a1a2e]/80"
                whileHover={{ y: -3 }}
              >
                <img
                  src={active}
                  alt={proj.title}
                  loading="lazy"
                  className="w-full h-56 object-cover opacity-90 hover:opacity-100 transition-transform duration-700 ease-in-out transform hover:scale-110"
                />
                <div className="p-6 text-left">
                  <h4 className="text-xl font-semibold mb-2 text-white text-center">{proj.title}</h4>
                  <p className="text-gray-400 text-sm text-center">{proj.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* === MODAL === */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-5xl mx-auto p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage}
                alt="Vista ampliada"
                className="rounded-2xl max-h-[80vh] object-contain shadow-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ClientsSection;
