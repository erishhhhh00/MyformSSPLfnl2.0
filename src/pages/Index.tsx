import React from 'react';
import Header from './landing/Header';
import Hero from './landing/Hero';
import About from './landing/About';
import Services from './landing/Services';
import Contact from './landing/Contact';
import Footer from './landing/Footer';
import ProductFinder from './landing/ProductFinder';
import Showcase from './landing/Showcase';
import './index.css';
import './landing/Landing.css';
import { useLandingInteractions } from './landing/useLandingInteractions';

const Index: React.FC = () => {
  useLandingInteractions();
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <ProductFinder />
      <Showcase />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;