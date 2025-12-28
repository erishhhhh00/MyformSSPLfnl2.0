import React from 'react';
import './Showcase.css';

const Showcase: React.FC = () => {
  return (
    <section className="company-policy" aria-label="Company Policy">
      <h2 className="company-policy__title">Company Policy</h2>
      <div className="company-policy__content">
        <div className="company-policy__column">
          <div className="policy-section">
            <h3 className="policy-section__title">Commitment to Safety Excellence</h3>
            <ul className="policy-section__list">
              <li>Excellence Delivering high-quality training programs designed to meet industry standards and regulations.</li>
              <li>Continuously improving our training methodologies to address emerging safety challenges</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3 className="policy-section__title">Compliance with Standards</h3>
            <ul className="policy-section__list">
              <li>Ensuring all training modules align with local, national, and international safety regulations.</li>
              <li>Maintaining transparency and adherence to legal and ethical practices in all our operations.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3 className="policy-section__title">Empowering Individuals and Organizations</h3>
            <ul className="policy-section__list">
              <li>Focusing on practical, hands-on learning to enhance safety awareness and risk management skills.</li>
              <li>Supporting clients in achieving their safety objectives and fostering a proactive safety culture.</li>
            </ul>
          </div>
        </div>

        <div className="company-policy__column">
          <div className="policy-section">
            <h3 className="policy-section__title">Sustainability and Innovation</h3>
            <ul className="policy-section__list">
              <li>Encouraging sustainable safety practices to minimize workplace risks and promote environmental responsibility.</li>
              <li>Leveraging advanced technology and tools to deliver impactful training solutions.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3 className="policy-section__title">Continuous Improvement</h3>
            <ul className="policy-section__list">
              <li>Gathering feedback from participants and stakeholders to refine and enhance our programs.</li>
              <li>Regularly updating our policies to reflect advancements in safety standards and best practices.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;


