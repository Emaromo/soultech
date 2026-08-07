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
      <ServicesSection />
      <PricingSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Landing;
