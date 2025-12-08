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
      icon: <Building2 className="w-12 h-12 text-cyan-400 transition" />,
    },
    {
      title: "Profesionales Independientes",
      color: "purple",
      icon: <UserCog className="w-12 h-12 text-purple-400 transition" />,
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
      images: ["/psico.jpg", "/img3.jpg"],
      desc: "Dashboard para técnicos, psicólogos o entrenadores con seguimiento de clientes.",
    },
    {
      title: "Landing Page Empresarial",
      images: ["/tiket1.jpg", "/dashclient.jpg", "/login.jpg"],
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
    <motion.section
      id="clientes"
      className="relative overflow-hidden bg-transparent py-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 relative z-10">

        {/* === TÍTULO === */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-6 glow-text">
            Aplicaciones exitosas de nuestros clientes
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interfaces modernas y funcionales creadas para diferentes rubros. Cada diseño se adapta a la identidad de tu negocio.
          </p>
        </motion.div>

        {/* === GALERÍA === */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.18 },
            },
          }}
        >
          {projectExamples.map((proj, i) => {
            const active = proj.images[currentIndexes[i] || 0];

            return (
              <motion.div
                key={i}
                onClick={() => setSelectedImage(active)}
                className="group relative glass-panel panel-3d rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-gradient-to-b from-[#101020]/70 to-[#1a1a2e]/80"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  boxShadow: "0 0 30px rgba(255,255,255,0.25)",
                }}
              >
                <motion.img
                  src={active}
                  alt={proj.title}
                  loading="lazy"
                  className="w-full h-56 object-cover opacity-90"
                  whileHover={{ scale: 1.12 }}
                  transition={{ duration: 0.6 }}
                />

                <div className="p-6 text-center">
                  <h4 className="text-xl font-semibold mb-2 text-white">
                    {proj.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {proj.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
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
    </motion.section>
  );
};

export default ClientsSection;
