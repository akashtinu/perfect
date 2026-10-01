import React from "react";
import "./about.css";

function About() {
  return (
    <section className="about fade-in">
      <div className="about-container">
        <h2 className="slide-up" id="about"  style={{color:" rgba(199, 48, 118, 0.95)"}}> About JBN Cakes</h2>

        <p className="slide-up delay-1">
          JBN Cakes was born from a passion for baking and a love for creating
          moments that matter. We believe every celebration deserves a cake
          that is not only delicious but also visually unforgettable.
        </p>

        <p className="slide-up delay-2">
          From birthdays and weddings to intimate gatherings and grand events,
          our cakes are handcrafted with premium ingredients, artistic detail,
          and a whole lot of love. Each design is thoughtfully created to match
          your vision and your taste.
        </p>

        <p className="slide-up delay-3">
          At JBN Cakes, we don’t just bake cakes — we create experiences that
          bring smiles, joy, and sweetness to your special moments.
        </p>

        <div className="about-highlights">
          <div className="highlight">🎂 Custom Designs</div>
          <div className="highlight">✨ Premium Quality</div>
          <div className="highlight">❤️ Made With Love</div>
        </div>
      </div>
    </section>
  );
}

export default About;
