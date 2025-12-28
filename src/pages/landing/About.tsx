import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section className="section" id="about">
      <h2 className="section-title">About Us</h2>
      <div className="about-content">
        <div className="about-text">
          <h3>Leading Safety Solutions Provider</h3>
          <p>With over 15 years of experience in industrial safety, SafetyProjects has established itself as a trusted partner for businesses seeking to create safer work environments.</p>
          <p>Our team of certified safety professionals works closely with clients to develop customized safety programs that address specific risks and compliance requirements.</p>
          <p>We leverage cutting-edge technology and industry best practices to deliver solutions that not only protect your workforce but also enhance operational efficiency.</p>
          <a href="#contact" className="btn btn-primary">Learn More</a>
        </div>
        <div className="about-image">
          <div className="placeholder-img">
            <span>About Us Image</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;


