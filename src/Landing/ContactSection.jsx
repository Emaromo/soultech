import React, { useState } from "react";
import {
  Mail,
  User,
  MessageSquare,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // 📩 Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construir el mensaje de WhatsApp
    const { name, email, message } = formData;
    const whatsappNumber = "5493516325887"; // ← tu número en formato internacional sin "+"
    const text = `Hola! 👋 Soy ${name}%0A📧 Email: ${email}%0A💬 Mensaje: ${message}`;

    // Abrir WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  };

  // Manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section
      id="contacto"
      className="py-20 futuristic-bg relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* === TÍTULO === */}
        <div className="text-center mb-16 slide-in-down">
          <h2 className="text-4xl font-bold text-white mb-4 glow-text">
            Contacto
          </h2>
          <p className="text-xl text-gray-300">
            ¿Listo para comenzar tu proyecto con nosotros?
          </p>
          <p className="text-gray-400 mt-2">
            Contanos tu idea y te responderemos con una propuesta personalizada.
          </p>
        </div>

        {/* === CONTENEDOR PRINCIPAL === */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* === FORMULARIO === */}
          <div
            className="relative glass-panel p-10 rounded-2xl border border-white/10 
            bg-gradient-to-br from-[#0a0a0a]/80 to-[#1a1a2e]/80 backdrop-blur-md 
            shadow-[0_0_30px_rgba(255,255,255,0.1)] group overflow-hidden"
          >
            {/* Reflejo animado */}
            <div className="absolute inset-0 pointer-events-none before:content-[''] before:absolute before:top-0 before:left-[-75%] before:w-[50%] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:rotate-12 group-hover:before:animate-shine"></div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 relative z-10"
            >
              <div className="relative">
                <User className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Tu correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Tu mensaje"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-lg text-white 
                bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 
                transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]"
              >
                Enviar por WhatsApp
              </button>
            </form>
          </div>

          {/* === INFORMACIÓN DE CONTACTO + MAPA === */}
          <div
            className="glass-panel p-10 rounded-2xl border border-white/10
            bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">
                Información de contacto
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-cyan-400 mt-1" />
                  <p>Lima 438, Córdoba, Argentina</p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-cyan-400" />
                  <p>+54 9 351 632-5887</p>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-cyan-400" />
                  <p>techsolutions@gmail.com</p>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <p>Lunes a Viernes – 9:00 a 18:00 hs</p>
                </div>
              </div>
            </div>

            {/* === MAPA === */}
            <div className="mt-8 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
              <iframe
                title="Mapa Soul Tech"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13747.86816707953!2d-64.19521355975393!3d-31.41733923846899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a28e7b7a3f3f%3A0x6a8d0277c2e2f3ef!2sC%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses-419!2sar!4v1706900000000!5m2!1ses-419!2sar"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* EFECTO BRILLO */}
      <style>
        {`
          @keyframes shine {
            0% { transform: translateX(0); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateX(200%); opacity: 0; }
          }
          .animate-shine {
            animation: shine 2.5s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default ContactSection;
