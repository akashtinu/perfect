import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-box">
          <h2 className="footer-logo">JBN Cakes</h2>
          <p className="footer-text">
            Handcrafted premium cakes &amp; desserts made with love for every
            celebration.
          </p>

          <div className="footer-socials">
            <h3>Follow Us:</h3>
            <a
              href="https://www.instagram.com/jbnca_kes/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#cakes">Cakes & Brownies</a></li>
           
            <li><a href="#about">About</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-box">
          <h3>Contact Info</h3>
          <p>
            <FontAwesomeIcon icon={faInstagram} />
            &nbsp;jbnca_kes
          </p>
          <p>
            <FontAwesomeIcon icon={faLocationDot} />
            &nbsp;Church Road, Kanyakumari, Tamil Nadu, India
          </p>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1815.549850257165!2d77.55056406077665!3d8.08667681411912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ed309b69af33%3A0x2780474ca734c98e!2s10%2F65%2F1%2C%20Vadakku%20Theruve%2C%20Kanniyakumari%2C%20Tamil%20Nadu%20629702!5e0!3m2!1sen!2sin!4v1769277136235!5m2!1sen!2sin"
              title="JBN Cakes Location"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        © {new Date().getFullYear()} JBN Cakes. All rights reserved. Powered by{" "}
        <span style={{ color: "rgb(253, 1, 211)", fontSize: "16px" }}>Akash</span>
      </div>
    </footer>
  );
}

export default Footer;
