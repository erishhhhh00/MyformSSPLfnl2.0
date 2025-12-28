import React, { useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header>
      <div className="header-container">
        <a href="#" className="logo">
          <i className="fas fa-shield-alt"></i>
          SSIPL
        </a>
        <nav>
          <button className="mobile-menu-btn" aria-label="Open Menu">
            <i className="fas fa-bars"></i>
          </button>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <div className="dropdown-container">
              <a 
                href="#" 
                className={`dropdown-trigger ${activeDropdown === 'trainings' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDropdownToggle('trainings');
                }}
              >
                Trainings
                <i className="fas fa-chevron-down"></i>
              </a>
              {activeDropdown === 'trainings' && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    AWARENESS PROGRAMME
                    <i className="fas fa-chevron-down"></i>
                  </a>
                  <a href="#" className="dropdown-item">
                    COMPETENCY PROGRAMME
                    <i className="fas fa-chevron-down"></i>
                  </a>
                  <a href="#" className="dropdown-item">
                    CERTIFIED COURSE & REFRESHER
                    <i className="fas fa-chevron-down"></i>
                  </a>
                </div>
              )}
            </div>
            <div className="dropdown-container">
              <a 
                href="#" 
                className={`dropdown-trigger ${activeDropdown === 'rescue' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDropdownToggle('rescue');
                }}
              >
                Rescue Manpower
                <i className="fas fa-chevron-down"></i>
              </a>
              {activeDropdown === 'rescue' && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">Rescue Services</a>
                  <a href="#" className="dropdown-item">Emergency Response</a>
                  <a href="#" className="dropdown-item">Manpower Solutions</a>
                </div>
              )}
            </div>
            <a href="/user" className="apply-now-btn">Apply Now</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;


