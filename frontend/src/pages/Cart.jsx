import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faTrash, faMinus, faPlus, faArrowRight, faMapMarkerAlt, faPhone } from "@fortawesome/free-solid-svg-icons";
import { getProductImage } from "../utils/imageMapper";
import "./Cart.css";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, placeOrder, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to place an order!");
      navigate("/login");
      return;
    }

    if (!address || !phone) {
      setError("Please provide a delivery address and contact phone number!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await placeOrder(address, phone, notes);
      alert("🎉 Order placed successfully! You can track your order in your Customer Dashboard.");
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page py-5">
      <div className="container mt-5">
        <h2 className="fw-bold mb-4">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <FontAwesomeIcon icon={faShoppingBag} size="3x" className="text-muted mb-3" />
            <h4>Your cart is empty</h4>
            <p className="text-muted">Explore our delicious selection of cakes and brownies!</p>
            <Link to="/products" className="btn btn-pink-primary mt-2">
              Browse Cakes & Pastries
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items List */}
            <div className="col-lg-7">
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h5 className="mb-0 fw-bold">Cart Items ({cartItems.length})</h5>
                  <button className="btn btn-sm btn-link text-danger text-decoration-none" onClick={clearCart}>
                    Clear All
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row d-flex align-items-center gap-3 py-3 border-bottom">
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      className="cart-item-img rounded"
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <span className="text-pink fw-bold">₹{item.numericPrice || item.price}</span>
                    </div>

                    <div className="qty-controls d-flex align-items-center border rounded">
                      <button className="btn btn-sm" onClick={() => updateQuantity(item.id, -1)}>
                        <FontAwesomeIcon icon={faMinus} size="xs" />
                      </button>
                      <span className="px-2 fw-bold">{item.quantity}</span>
                      <button className="btn btn-sm" onClick={() => updateQuantity(item.id, 1)}>
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                      </button>
                    </div>

                    <div className="text-end" style={{ minWidth: "80px" }}>
                      <span className="fw-bold">₹{(item.numericPrice || item.price) * item.quantity}</span>
                      <button className="btn btn-sm text-muted d-block ms-auto" onClick={() => removeFromCart(item.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Delivery Form */}
            <div className="col-lg-5">
              <div className="bg-white p-4 rounded shadow-sm">
                <h5 className="fw-bold mb-3">Order Checkout</h5>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <form onSubmit={handleCheckout}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Delivery Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Full delivery address with landmark"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Contact Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Mobile number for delivery updates"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Order Notes / Custom Message (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Write 'Happy Birthday Sam' on cake"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="border-top pt-3 mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Subtotal</span>
                      <span className="fw-bold">₹{cartTotal}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Delivery Fee</span>
                      <span className="text-success fw-bold">FREE</span>
                    </div>
                    <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-pink">₹{cartTotal}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-pink-primary w-100 py-3 mt-4"
                    disabled={loading}
                  >
                    {loading ? "Confirming Order..." : (
                      <>
                        Place Order Now (₹{cartTotal}) <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
