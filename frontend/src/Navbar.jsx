import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faShoppingBag, faUser, faShieldHalved, faSignOutAlt, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { useDarkMode } from "./context/DarkModeContext";
import logo from "./assets/jbn.png";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { dark, toggle: toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top pink-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="JBN Cakes" className="navbar-logo" />
          </Link>

          <div className="d-flex align-items-center gap-2 d-lg-none">
            <Link to="/cart" className="btn btn-outline-pink btn-sm position-relative">
              <FontAwesomeIcon icon={faShoppingBag} />
              {cartCount > 0 && <span className="cart-badge-dot">{cartCount}</span>}
            </Link>
            <button
              className="navbar-toggler"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              <FontAwesomeIcon icon={open ? faXmark : faBars} />
            </button>
          </div>

          <div className={`navbar-collapse ${open ? "open" : ""}`}>
            <ul className="navbar-nav ms-auto align-items-center text-center">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={() => setOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-link" onClick={() => setOpen(false)}>
                  Cakes & Pastries
                </Link>
              </li>

              {/* Dark Mode Toggle */}
              <li className="nav-item me-lg-2 my-2 my-lg-0">
                <button
                  className="btn btn-sm text-white border-0"
                  onClick={toggleDarkMode}
                  title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={dark ? faSun : faMoon} style={{ color: dark ? "#fde047" : "#fff" }} />
                </button>
              </li>

              {/* Cart Button with Counter */}
              <li className="nav-item mx-lg-2 my-2 my-lg-0">
                <Link to="/cart" className="btn btn-cart-nav position-relative" onClick={() => setOpen(false)}>
                  <FontAwesomeIcon icon={faShoppingBag} className="me-1" /> Cart
                  {cartCount > 0 && <span className="cart-badge ms-1">{cartCount}</span>}
                </Link>
              </li>

              {/* Auth / Dashboard Links */}
              {user ? (
                <>
                  {isAdmin ? (
                    <li className="nav-item">
                      <Link to="/admin/dashboard" className="btn btn-admin-nav btn-sm me-2 my-1" onClick={() => setOpen(false)}>
                        <FontAwesomeIcon icon={faShieldHalved} className="me-1 text-danger" /> Admin Dashboard
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link to="/customer/dashboard" className="btn btn-customer-nav btn-sm me-2 my-1" onClick={() => setOpen(false)}>
                        <FontAwesomeIcon icon={faUser} className="me-1" /> My Orders
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="btn btn-sm btn-light text-dark fw-bold" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="btn btn-outline-pink btn-sm me-2 my-1" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="btn btn-pink-primary btn-sm my-1" onClick={() => setOpen(false)}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Floating Instagram */}
      <a
        href="https://www.instagram.com/jbnca_kes/"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-instagram"
      >
        <FontAwesomeIcon icon={faInstagram} bounce className="floating-instagram-icon" />
      </a>
    </>
  );
}

export default Navbar;
