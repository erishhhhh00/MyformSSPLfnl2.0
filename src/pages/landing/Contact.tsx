import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.currentTarget.reset();
  };

  return (
    <section className="section" id="contact">
      <h2 className="section-title">Contact Us</h2>
      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
            <div>
              <h3>Our Location</h3>
              <p>123 Safety Avenue, Industrial Zone, City - 500001</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
            <div>
              <h3>Phone Number</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fas fa-envelope"></i></div>
            <div>
              <h3>Email Address</h3>
              <p>info@safetyprojects.co.in</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fas fa-clock"></i></div>
            <div>
              <h3>Working Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" className="form-control" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" className="form-control" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" className="form-control" placeholder="Enter subject" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" className="form-control" placeholder="Enter your message"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;


