import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faShieldHalved, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import "./Auth.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState("CUSTOMER"); // 'CUSTOMER' or 'ADMIN'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setActiveRole(role);
    if (role === "ADMIN") {
      setEmail("admin@jbncakes.com");
      setPassword("admin123");
    } else {
      setEmail("customer@jbncakes.com");
      setPassword("customer123");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header text-center">
          <span className="auth-badge">Welcome Back</span>
          <h2>Sign In to JBN Cakes</h2>
          <p>Select your account type below to log in</p>
        </div>

        {/* Dual Role Selector Tabs */}
        <div className="role-toggle-group">
          <button
            type="button"
            className={`role-toggle-btn ${activeRole === "CUSTOMER" ? "active" : ""}`}
            onClick={() => fillDemo("CUSTOMER")}
          >
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Customer Login
          </button>
          <button
            type="button"
            className={`role-toggle-btn ${activeRole === "ADMIN" ? "active" : ""}`}
            onClick={() => fillDemo("ADMIN")}
          >
            <FontAwesomeIcon icon={faShieldHalved} className="me-2" />
            Admin Portal
          </button>
        </div>

        {error && <div className="alert alert-danger py-2 px-3 small">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="email"
                className="form-control"
                placeholder={activeRole === "ADMIN" ? "admin@jbncakes.com" : "customer@jbncakes.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-pink-primary w-100 py-2.5" disabled={loading}>
            {loading ? "Signing In..." : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                Login as {activeRole === "ADMIN" ? "Administrator" : "Customer"}
              </>
            )}
          </button>
        </form>

        <div className="demo-hint text-center mt-3 p-2 rounded">
          <small className="text-muted d-block mb-1">💡 Quick Demo Credentials:</small>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => fillDemo("CUSTOMER")}>
              Fill Customer Demo
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => fillDemo("ADMIN")}>
              Fill Admin Demo
            </button>
          </div>
        </div>

        <div className="auth-footer text-center mt-4">
          <p className="mb-0 text-muted">
            Don't have an account? <Link to="/signup" className="pink-link">Sign Up Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
