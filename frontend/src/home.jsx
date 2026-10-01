import React from "react";
import logo from "./assets/jbn_cakes.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import "./home.css";

function Home() {
  return (
    <main className="main-content" id="home">
      {/* HERO */}
      <section className="hero fade-in">
        <div className="hero-text slide-left">

          {/* Badge pill */}
          <div className="hero-badge">
            ✨ Handcrafted in Kanyakumari.
          </div>

          {/* Brand name */}
          <h1 className="hero-brand">JBN Cakes</h1>

          {/* Main tagline */}
          <h2 className="hero-tagline">
            Fresh, Handcrafted Designer &amp; Premium Custom Cakes for All Your Special Moments
          </h2>

          {/* Description */}
          <p className="hero-desc">
            From birthdays and weddings to intimate celebrations, we bake
            custom cakes with premium ingredients and artistic detail.
          </p>

          {/* CTA buttons */}
          <div className="hero-actions">
            <a href="#cakes" className="btn-hero explore">
              🎂 Explore Cakes
            </a>
            <a
              href="https://www.instagram.com/jbnca_kes/"
              target="_blank"
              rel="noreferrer"
              className="btn-hero instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
              &nbsp; Order on Instagram
            </a>
          </div>

        </div>

        <div className="hero-image slide-right">
          <img src={logo} alt="JBN Cakes" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features fade-in">
        <div className="feature-card">
          <h3>🎂 Handcrafted Cakes</h3>
          <p>Every cake is freshly baked and uniquely designed for you.</p>
        </div>
        <div className="feature-card">
          <h3>✨ Premium Ingredients</h3>
          <p>Only the finest chocolate, cream, and flavors we trust.</p>
        </div>
        <div className="feature-card">
          <h3>❤️ Made With Love</h3>
          <p>We bake with passion to make your moments sweeter.</p>
        </div>
      </section>
    </main>
  );
}

export default Home;
