import React from 'react';
import Header from '../Landing/Header';
import HeroSection from '../Landing/HeroSection';
import ServicesSection from '../Landing/ServicesSection';
import ClientsSection from '../Landing/ClientsSection';
import PricingSection from '../Landing/PricingSection';
import ProcessSection from '../Landing/ProcessSection';
import ContactSection from '../Landing/ContactSection';
import Footer from '../Landing/Footer';
import MatrixBackground from '../Landing/MatrixBackground';


const Landing = () => {
  return (
    <div className="futuristic-bg">
      <MatrixBackground />
      
      <Header />
      
      <HeroSection />
      <ServicesSection />
      <ClientsSection />
      <PricingSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Landing;