import React, { useEffect } from 'react';
import './designV2.css';
import Bg3DBackground from '../Landing/Bg3DBackground';
import ParticleCanvas from '../Landing/particles/ParticleCanvas';
import { initParticleReveal } from '../Landing/particles/particleReveal';
import Header from '../Landing/Header';
import HeroSection from '../Landing/HeroSection';
import AssistantSection from '../Landing/AssistantSection';
import ClientsSection from '../Landing/ClientsSection';
import ServicesSection from '../Landing/ServicesSection';
import PricingSection from '../Landing/PricingSection';
import ProcessSection from '../Landing/ProcessSection';
import ContactSection from '../Landing/ContactSection';
import Footer from '../Landing/Footer';
import LazyMobileSection from '../Landing/LazyMobileSection';

const Landing = () => {
  useEffect(() => initParticleReveal(), []);

  return (
    <div className="futuristic-bg">
      <Bg3DBackground />
      <ParticleCanvas />

      <Header />

      <HeroSection />
      <AssistantSection />
      <ClientsSection />
      {/* Servicios y Precios (que además monta el carrusel de Rubros/
          IndustryGrid adentro) son los 3 carruseles pesados de la página —
          en móvil, diferir su montaje real hasta cerca del viewport es lo
          que de verdad baja el trabajo de hilo principal antes del primer
          pintado (ver LazyMobileSection.jsx). approxHeight medido en vivo a
          390px de ancho (mobile), con margen: servicios ~976px real →
          1000px reservados; precios ~1776px real (incluye IndustryGrid) →
          1800px reservados. */}
      <LazyMobileSection id="servicios" approxHeight={1000}>
        <ServicesSection />
      </LazyMobileSection>
      <LazyMobileSection id="precios" approxHeight={1800}>
        <PricingSection />
      </LazyMobileSection>
      <ProcessSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Landing;
