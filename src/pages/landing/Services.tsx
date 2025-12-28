import React from 'react';
import './Services.css';

const Services: React.FC = () => {
  return (
    <section className="section" id="services">
      <h2 className="section-title">Our Services</h2>
      <div className="services-grid">
        <div className="service-card">
          <div className="service-icon"><i className="fas fa-hard-hat"></i></div>
          <h3>Safety Training</h3>
          <p>Comprehensive training programs designed to educate your workforce on safety protocols, emergency procedures, and hazard recognition.</p>
        </div>
        <div className="service-card">
          <div className="service-icon"><i className="fas fa-clipboard-check"></i></div>
          <h3>Risk Assessment</h3>
          <p>Thorough evaluation of workplace hazards and development of risk mitigation strategies to prevent accidents and injuries.</p>
        </div>
        <div className="service-card">
          <div className="service-icon"><i className="fas fa-tools"></i></div>
          <h3>Safety Equipment</h3>
          <p>Supply and installation of high-quality safety equipment including PPE, fire suppression systems, and emergency signage.</p>
        </div>
        <div className="service-card">
          <div className="service-icon"><i className="fas fa-file-contract"></i></div>
          <h3>Compliance Audits</h3>
          <p>Detailed audits to ensure your facility meets all regulatory requirements and industry safety standards.</p>
        </div>
        <div className="service-card">
          <div className="service-icon"><i className="fas fa-headset"></i></div>
          <h3>Safety Consulting</h3>
          <p>Expert guidance on developing safety policies, procedures, and management systems tailored to your organization.</p>
        </div>
        <div className="service-card">
          <div className="service-icon"><i className="fas fa-exclamation-triangle"></i></div>
          <h3>Emergency Planning</h3>
          <p>Development and implementation of comprehensive emergency response plans for various workplace scenarios.</p>
        </div>
      </div>
    </section>
  );
};

export default Services;


