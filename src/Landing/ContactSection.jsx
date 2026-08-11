import React, { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Clock, Mail, MessageCircle } from "lucide-react";
import AmbientParticles from "./AmbientParticles";
import SectionBackdrop from "./SectionBackdrop";
import { GlassReflection, GlassContactLight, GlassFloor } from "./GlassCard";
import { WHATSAPP_NUMBER, buildWhatsAppHref } from "./whatsappConfig";
import useParticleHover from "./particles/useParticleHover";

const CONTACT_EMAIL = "techresolutions24@gmail.com";

// --edge en reposo bajo, igual que ProcessSection: son dos paneles "pares",
// ninguno debe verse como la tarjeta activa de un carrusel.
const REST_EDGE = 0.4;
// textAlign:"left" es necesario acá: .App (boilerplate de CRA) setea
// text-align:center global, y nada más lo pisaba dentro de estos paneles.
const PANEL_STYLE = { padding: 32, height: "100%", textAlign: "left" };

const CONTACT_ITEMS = [
  {
    Icon: MapPin,
    label: "Dirección",
    value: "Lima 438, Córdoba, Argentina",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Lima 438, Córdoba, Argentina")}`,
    external: true,
  },
  { Icon: Phone, label: "Teléfono", value: "+54 9 351 632-5887", href: `tel:+${WHATSAPP_NUMBER}` },
  { Icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { Icon: Clock, label: "Horario", value: "Lunes a Viernes, 9:00 a 18:00 hs", href: null },
];

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const submitBtnRef = useRef(null);
  useParticleHover(submitBtnRef, { variant: "button" });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Falta tu nombre.";
    if (!formData.email.trim()) next.email = "Falta tu email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Ese email no parece válido.";
    if (!formData.message.trim()) next.message = "Contanos brevemente qué necesitás.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const { name, email, message } = formData;
    const text = `¡Hola! Soy ${name} (${email}). ${message}`;
    window.open(buildWhatsAppHref(text), "_blank");
  };

  return (
    <section id="contacto" className="relative overflow-hidden py-28 px-6" style={{ scrollMarginTop: 80 }}>
      <SectionBackdrop variant="panel" vignette={0.95} />
      <AmbientParticles count={isMobile ? 6 : 14} seed={5000} />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-14" data-reveal>
          <h2 className="text-4xl font-extrabold text-white mb-3" style={{ textShadow: "0 0 28px rgba(0,255,255,0.35)" }}>
            Hablemos de tu proyecto
          </h2>
          <p className="text-gray-400 text-lg">Contanos qué necesitás y te respondemos en el día.</p>
        </div>

        <div className="grid gap-[22px] items-stretch" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          {/* Formulario */}
          <div data-reveal>
            <div className="ds-cf-inner ds-static-glass" style={{ "--edge": REST_EDGE, height: "100%" }}>
              <div className="ds-glass-face" style={PANEL_STYLE}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="contact-name" className="ds-input-label">Nombre</label>
                    <input
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className={`ds-input${errors.name ? " ds-input--error" : ""}`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                    />
                    {errors.name && <p id="contact-name-error" className="ds-input-error">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="ds-input-label">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Tu email"
                      className={`ds-input${errors.email ? " ds-input--error" : ""}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                    />
                    {errors.email && <p id="contact-email-error" className="ds-input-error">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="ds-input-label">Mensaje</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Contanos sobre tu proyecto..."
                      className={`ds-input resize-y${errors.message ? " ds-input--error" : ""}`}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                    />
                    {errors.message && <p id="contact-message-error" className="ds-input-error">{errors.message}</p>}
                  </div>
                  <button ref={submitBtnRef} type="button" onClick={handleSubmit} className="ds-wa-btn">
                    <MessageCircle className="w-[18px] h-[18px]" />
                    Enviar por WhatsApp
                  </button>
                </div>
              </div>
              <GlassFloor variant="full" />
              <GlassReflection variant="grid" sizeStyle={PANEL_STYLE} />
              <GlassContactLight variant="full" />
            </div>
          </div>

          {/* Panel de contacto directo */}
          <div data-reveal data-delay="150">
            <div className="ds-cf-inner ds-static-glass" style={{ "--edge": REST_EDGE, height: "100%" }}>
              <div className="ds-glass-face flex flex-col" style={PANEL_STYLE}>
                <h3 className="text-xl font-bold text-white mb-6">Contacto directo</h3>

                {/* gap-6 = separación mínima (24px); justify-between reparte
                    el resto del alto del panel de forma pareja entre los 4
                    items, sin huecos sueltos. */}
                <div className="flex-1 flex flex-col justify-between gap-6">
                  {CONTACT_ITEMS.map(({ Icon, label, value, href, external }, idx) => {
                    const Tag = href ? "a" : "div";
                    const tagProps = href ? { href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {};
                    return (
                      <Tag key={idx} {...tagProps} className="ds-contact-row flex items-center gap-4 no-underline">
                        <span
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <div>
                          <div className="text-[14px] font-semibold text-white">{label}</div>
                          <div className="ds-contact-value text-sm mt-0.5" style={{ color: href ? "#38BDF8" : "#94A3B8" }}>
                            {value}
                          </div>
                        </div>
                      </Tag>
                    );
                  })}
                </div>
              </div>
              <GlassFloor variant="full" />
              <GlassReflection variant="grid" sizeStyle={PANEL_STYLE} />
              <GlassContactLight variant="full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
