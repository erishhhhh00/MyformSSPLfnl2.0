import React from 'react';
import Waves from '../../components/Waves/Waves';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero" id="home">
      <Waves
        className="hero-waves"
        lineColor="rgb(255,255,255)"
        backgroundColor="transparent"
        waveSpeedX={0.01}
        waveSpeedY={0.004}
        waveAmpX={28}
        waveAmpY={14}
        xGap={12}
        yGap={28}
        maxCursorMove={80}
      />
       <div className="hero-content">
         <h1>Welcome to SSIPL</h1>
         <p>
           At SSIPL, our mission is to empower individuals and organizations with the knowledge and skills required to create safer workplaces and promote a culture of safety excellence. With years of experience in safety training and consultancy, we take pride in delivering world-class training solutions tailored to meet industry standards and client-specific needs.
         </p>
         <p>
           Our team of certified trainers and state-of-the-art training methodologies ensure that every participant gains practical insights and confidence to handle real-world challenges. Whether it's occupational safety, risk management, or compliance training, we are committed to helping you achieve your safety goals effectively.
         </p>
         <p>
           Together, let's build a safer future.
         </p>
         <div className="hero-btns">
           <a href="#services" className="btn btn-primary">Our Services</a>
           <a href="#contact" className="btn btn-secondary">Contact Us</a>
         </div>
       </div>
      <div className="hero-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </section>
  );
};

export default Hero;


