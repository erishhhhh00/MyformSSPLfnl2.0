import React from 'react';
import './Projects.css';

const Projects: React.FC = () => {
  return (
    <section className="section" id="projects">
      <h2 className="section-title">Our Projects</h2>
      <div className="projects-grid">
        <div className="project-card">
          <div className="project-img"><span>Manufacturing Facility Safety</span></div>
          <div className="project-overlay">
            <h3>Manufacturing Facility Safety</h3>
            <p>Complete safety overhaul for a large manufacturing plant</p>
          </div>
        </div>
        <div className="project-card">
          <div className="project-img"><span>Construction Site Safety</span></div>
          <div className="project-overlay">
            <h3>Construction Site Safety</h3>
            <p>Safety implementation for a high-rise construction project</p>
          </div>
        </div>
        <div className="project-card">
          <div className="project-img"><span>Chemical Plant Safety</span></div>
          <div className="project-overlay">
            <h3>Chemical Plant Safety</h3>
            <p>Hazardous material handling and safety protocols</p>
          </div>
        </div>
        <div className="project-card">
          <div className="project-img"><span>Oil & Gas Safety</span></div>
          <div className="project-overlay">
            <h3>Oil & Gas Safety</h3>
            <p>Comprehensive safety solutions for offshore drilling operations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;


