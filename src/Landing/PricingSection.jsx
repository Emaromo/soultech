import React from "react";

const PricingSection = () => {
  return (
    <section id="precios" className="py-20 futuristic-bg relative">
      {/* === EFECTOS VISUALES DE FONDO === */}
      <div className="geometric-shapes">
        <div className="shape square-1"></div>
        <div className="shape square-2"></div>
        <div className="shape circle-1"></div>
        <div className="shape triangle-1"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* === TÍTULO PRINCIPAL === */}
        <div className="text-center mb-16 slide-in-down">
          <h2 className="text-4xl font-bold text-white mb-4 glow-text">
            Planes y Servicios
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto fade-in">
            Soluciones flexibles con actualizaciones mensuales para mantener tu
            aplicación siempre al día
          </p>
        </div>

        {/* === CONTENEDOR DE PLANES === */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-container">
          {/* 🧩 Plan 1: Aplicación a Medida */}
          <div
            className="glass-panel panel-3d p-8 rounded-xl relative overflow-hidden 
            hover:scale-105 hover:shadow-cyan-500/40 transition-all duration-500 
            slide-in-left"
            style={{ animationDelay: "3.5s", animationFillMode: "backwards" }}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-bl-lg text-sm font-semibold">
              🔧 EXCLUSIVO
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 glow-text">
                Aplicación a Medida
              </h3>
              <p className="text-gray-300 text-sm">
                Solución única y personalizada
              </p>
            </div>

            <div className="mb-6 fade-in" style={{ animationDelay: "3.8s" }}>
              <div className="text-3xl font-bold text-cyan-400 mb-2"></div>
              <div className="text-sm text-gray-400">Costo inicial</div>
              <div className="text-xl font-semibold text-white mt-2"></div>
              <div className="text-sm text-gray-400">
                Mensualidad según complejidad
              </div>
            </div>

            <div
              className="space-y-3 mb-8 slide-in-up"
              style={{ animationDelay: "4s" }}
            >
              {[
                "Desarrollo exclusivo y hecho a medida",
                "Client Dashboard (panel del cliente)",
                "Admin Dashboard (panel administrativo)",
                "Landing Page de presentación incluida",
                "Dominio gratis por un año",
                "Actualizaciones mensuales incluidas",
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  </div>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <button className="w-full glass-panel px-6 py-3 rounded-lg text-white font-semibold hover:bg-cyan-500/20 transition-all duration-300 neon-border">
              Solicitar Cotización
            </button>

            <div
              className="mt-4 text-center fade-in"
              style={{ animationDelay: "4.3s" }}
            >
              <span className="text-xs text-green-400">
                ✅ Ideal para soluciones únicas y personalizadas
              </span>
            </div>
          </div>

          {/* 🧩 Plan 2: Aplicación Compartida */}
          <div
            className="glass-panel panel-3d p-8 rounded-xl relative overflow-hidden 
            hover:scale-105 hover:shadow-purple-500/40 transition-all duration-500 
            slide-in-up"
            style={{ animationDelay: "4s", animationFillMode: "backwards" }}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-blue-600 text-white px-4 py-2 rounded-bl-lg text-sm font-semibold">
              🛒 POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 glow-text">
                Aplicación Compartida
              </h3>
              <p className="text-gray-300 text-sm">
                Acceso rápido sin inversión inicial
              </p>
            </div>

            <div className="mb-6 fade-in" style={{ animationDelay: "1.2s" }}>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                Sin costo inicial
              </div>
              <div className="text-xl font-semibold text-white mt-2"></div>
              <div className="text-sm text-gray-400">Suscripción mensual</div>
            </div>

            <div
              className="space-y-3 mb-8 slide-in-up"
              style={{ animationDelay: "3.5s" }}
            >
              {[
                "Acceso a sistema ya desarrollado",
                "Client Dashboard (panel del cliente)",
                "Admin Dashboard (panel administrativo)",
                "Actualizaciones mensuales incluidas",
                "Mejoras y nuevas funciones",
                "Entrada rápida al sistema",
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <button className="w-full glass-panel px-6 py-3 rounded-lg text-white font-semibold hover:bg-purple-500/20 transition-all duration-300 neon-border">
              Comenzar Suscripción
            </button>

            <div
              className="mt-4 text-center fade-in"
              style={{ animationDelay: "3.8s" }}
            >
              <span className="text-xs text-green-400">
                ✅ Perfecto para entrada rápida sin desarrollo exclusivo
              </span>
            </div>
          </div>

          {/* 🧩 Plan 3: Landing Page */}
          <div
            className="glass-panel panel-3d p-8 rounded-xl relative overflow-hidden 
            hover:scale-105 hover:shadow-green-500/40 transition-all duration-500 
            slide-in-right"
            style={{ animationDelay: "3.5s", animationFillMode: "backwards" }}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-blue-600 text-white px-4 py-2 rounded-bl-lg text-sm font-semibold">
              🌐 BÁSICO
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 glow-text">
                Landing Page
              </h3>
              <p className="text-gray-300 text-sm">Presencia web profesional</p>
            </div>

            <div className="mb-6 fade-in" style={{ animationDelay: "3.8s" }}>
              <div className="text-3xl font-bold text-green-400 mb-2"></div>
              <div className="text-sm text-gray-400">Costo inicial</div>
              <div className="text-xl font-semibold text-white mt-2"></div>
              <div className="text-sm text-gray-400">
                Mantenimiento semestral
              </div>
            </div>

            <div
              className="space-y-3 mb-8 slide-in-up"
              style={{ animationDelay: "4s" }}
            >
              {[
                "Página web informativa y profesional",
                "Formulario de contacto",
                "Encuestas vía WhatsApp",
                "Dominio incluido por 6 meses",
                "Actualizaciones cada 6 meses",
                "Generación de contactos",
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <button className="w-full glass-panel px-6 py-3 rounded-lg text-white font-semibold hover:bg-green-500/20 transition-all duration-300 neon-border">
              Crear Landing Page
            </button>

            <div
              className="mt-4 text-center fade-in"
              style={{ animationDelay: "2.3s" }}
            >
              <span className="text-xs text-green-400">
                ✅ Ideal para atraer clientes y generar contactos
              </span>
            </div>
          </div>
        </div>

        {/* === TABLA RESUMEN COMPARATIVO (oculta en mobile) === */}
        <div className="mt-16 slide-in-up hidden md:block">
          <h3 className="text-2xl font-bold text-white text-center mb-8 glow-text">
            Resumen Comparativo
          </h3>
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Servicio
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Costo Inicial
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Mensualidad
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Mantenimiento
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Incluye
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-cyan-400">
                      Aplicación a Medida
                    </td>
                    <td className="px-6 py-4 text-center"></td>
                    <td className="px-6 py-4 text-center"></td>
                    <td className="px-6 py-4 text-center">–</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      App exclusiva + Dashboards + Landing + Dominio 1 año
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-purple-400">
                      Aplicación Compartida
                    </td>
                    <td className="px-6 py-4 text-center">–</td>
                    <td className="px-6 py-4 text-center"></td>
                    <td className="px-6 py-4 text-center">–</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      Sistema estándar + Dashboards + Actualizaciones
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-green-400">
                      Landing Page
                    </td>
                    <td className="px-6 py-4 text-center"></td>
                    <td className="px-6 py-4 text-center">–</td>
                    <td className="px-6 py-4 text-center"></td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      Página web + Formularios + WhatsApp + Dominio 6 meses
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
