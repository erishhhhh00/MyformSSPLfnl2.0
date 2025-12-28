import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-column footer-brand">
          <div className="footer-logo">
            <div className="logo-icon">
              <i className="fas fa-cog"></i>
              <i className="fas fa-hard-hat"></i>
              <div className="cityscape"></div>
            </div>
            <div className="logo-text">SSIPL</div>
          </div>
          <div className="footer-taglines">
            <p>Calming Fears. Easing Minds. Saving Lives.</p>
            <p>Shielding Lives, Building Futures.</p>
          </div>
          <div className="contact-button">
            <button className="contact-btn">
              <i className="fas fa-phone"></i>
            </button>
            <div className="contact-info">
              <span className="contact-label">CONTACT US</span>
              <span className="contact-number">+91-9266964744</span>
            </div>
          </div>
        </div>
        
        <div className="footer-column">
          <h3>Pages</h3>
          <ul className="footer-links">
            <li><i className="fas fa-check"></i><a href="#home">Home</a></li>
            <li><i className="fas fa-check"></i><a href="#about">About Us</a></li>
            <li><i className="fas fa-check"></i><a href="#contact">Contact Us</a></li>
            <li><i className="fas fa-check"></i><a href="#">Certificates</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>The Services</h3>
          <ul className="footer-links">
            <li><i className="fas fa-check"></i><a href="#">AWARENESS PROGRAMME</a></li>
            <li><i className="fas fa-check"></i><a href="#">CERTIFIED COURSE & REFRESHER</a></li>
            <li><i className="fas fa-check"></i><a href="#">FIRE FIGHTING</a></li>
            <li><i className="fas fa-check"></i><a href="#">COMPETENCY PROGRAMME</a></li>
            <li><i className="fas fa-check"></i><a href="#">FIRST AID TRAINING</a></li>
            <li><i className="fas fa-check"></i><a href="#">TOWER ERECTION TRAINING BASIC</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Information</h3>
          <div className="info-item">
            <div className="info-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="info-content">
              <span className="info-label">Address</span>
              <span className="info-detail">A - 24/9, Mohan Co-operative. Industrial Estate, Mathura Road, Saidabad New Delhi 110044</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="info-content">
              <span className="info-label">Email</span>
              <span className="info-detail">md@shieldskillinstitute.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>© 2023 SSIPL. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;



