import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone, faMapMarkerAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "./Auth.css";

function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(formData);
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header text-center">
          <span className="auth-badge">Join JBN Cakes</span>
          <h2>Create New Account</h2>
          <p>Register as a Customer to order fresh cakes & pastries</p>
        </div>

        {error && <div className="alert alert-danger py-2 px-3 small">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group mb-3">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faPhone} className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Delivery Address</label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="City, Street"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-pink-primary w-100 py-2.5" disabled={loading}>
            {loading ? "Creating Account..." : (
              <>
                <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                Register Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer text-center mt-4">
          <p className="mb-0 text-muted">
            Already have an account? <Link to="/login" className="pink-link">Log In Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
