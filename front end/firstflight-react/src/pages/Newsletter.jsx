import React from 'react';

const Newsletter = () => {
  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <h2>Subscribe to our Newsletter</h2>
        <p>Get 20% off your first trip by signing up today!</p>
        <div className="input-wrapper">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;