import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faHistory,
  faClock,
  faCheckCircle,
  faTruck,
  faTimesCircle,
  faBoxOpen,
  faArrowRight,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";

function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'history'
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const activeRes = await api.getMyActiveOrders();
      const historyRes = await api.getMyOrderHistory();
      setActiveOrders(activeRes || []);
      setOrderHistory(historyRes || []);
    } catch (err) {
      console.warn("Failed to fetch customer orders from API", err);
      // Fallback local storage orders if backend not reachable
      const savedOrders = JSON.parse(localStorage.getItem("jbn_demo_orders") || "[]");
      setActiveOrders(savedOrders.filter((o) => ["PENDING", "PREPARING", "OUT_FOR_DELIVERY"].includes(o.status)));
      setOrderHistory(savedOrders.filter((o) => ["DELIVERED", "CANCELLED"].includes(o.status)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.updateOrderStatus(orderId, "CANCELLED");
      setActionMessage(`Order #${orderId} has been cancelled successfully.`);
      fetchOrders();
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to cancel order");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="badge bg-warning text-dark"><FontAwesomeIcon icon={faClock} className="me-1" /> Order Received</span>;
      case "PREPARING":
        return <span className="badge bg-info text-dark"><FontAwesomeIcon icon={faBoxOpen} className="me-1" /> Baking & Preparing</span>;
      case "OUT_FOR_DELIVERY":
        return <span className="badge bg-primary"><FontAwesomeIcon icon={faTruck} className="me-1" /> Out for Delivery</span>;
      case "DELIVERED":
        return <span className="badge bg-success"><FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Delivered</span>;
      case "CANCELLED":
        return <span className="badge bg-danger"><FontAwesomeIcon icon={faTimesCircle} className="me-1" /> Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const renderStatusTracker = (status) => {
    const steps = ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
    if (status === "CANCELLED") return null;

    const currentIndex = steps.indexOf(status);

    return (
      <div className="status-tracker mt-3">
        <div className="tracker-steps">
          {steps.map((step, idx) => (
            <div key={step} className={`tracker-step ${idx <= currentIndex ? "completed" : ""}`}>
              <div className="step-circle">{idx + 1}</div>
              <div className="step-label">{step.replace(/_/g, " ")}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Dashboard Header Banner */}
        <div className="dashboard-banner mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="badge bg-light text-pink mb-2">Customer Portal</span>
              <h2>Hello, {user?.name || "Valued Customer"}! 👋</h2>
              <p className="mb-0 text-white-50">
                Track your active cake orders and view past sweet memories in your order history.
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link to="/products" className="btn btn-light btn-sm font-weight-bold">
                Order More Cakes <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
              </Link>
            </div>
          </div>
        </div>

        {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

        {/* Navigation Tabs */}
        <div className="dashboard-tabs mb-4">
          <button
            className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
            Current Orders
            <span className="tab-count-badge ms-2">{activeOrders.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Order History
            <span className="tab-count-badge ms-2">{orderHistory.length}</span>
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-pink" role="status"></div>
            <p className="mt-2 text-muted">Loading your orders...</p>
          </div>
        ) : activeTab === "active" ? (
          <div className="orders-section">
            {activeOrders.length === 0 ? (
              <div className="empty-state text-center py-5">
                <FontAwesomeIcon icon={faBoxOpen} size="3x" className="text-muted mb-3" />
                <h4>No Current Orders</h4>
                <p className="text-muted">You don't have any active orders right now. Craving something sweet?</p>
                <Link to="/products" className="btn btn-pink-primary">
                  Explore Cakes Catalog
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {activeOrders.map((order) => (
                  <div className="col-12" key={order.id}>
                    <div className="order-card">
                      <div className="order-card-header d-flex flex-wrap justify-content-between align-items-center">
                        <div>
                          <span className="order-id">Order #{order.id}</span>
                          <span className="text-muted ms-3 small">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>

                      <div className="order-card-body">
                        {renderStatusTracker(order.status)}

                        <div className="items-list mt-3">
                          <h6>Items Ordered:</h6>
                          <div className="row g-2">
                            {order.items?.map((item, idx) => (
                              <div className="col-md-6" key={idx}>
                                <div className="item-row d-flex justify-content-between align-items-center p-2 rounded background-soft">
                                  <div>
                                    <strong>{item.product?.name || "Cake Item"}</strong>
                                    <span className="text-muted ms-2">x{item.quantity}</span>
                                  </div>
                                  <span className="fw-bold">₹{item.pricePerUnit * item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="order-details-grid mt-3 pt-3 border-top d-flex flex-wrap justify-content-between align-items-center">
                          <div>
                            <small className="text-muted d-block">Delivery Address:</small>
                            <span>{order.deliveryAddress}</span>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block">Total Amount:</small>
                            <span className="fs-5 fw-bold text-pink">₹{order.totalAmount}</span>
                          </div>
                        </div>

                        {order.status === "PENDING" && (
                          <div className="mt-3 text-end">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              <FontAwesomeIcon icon={faBan} className="me-1" /> Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="orders-section">
            {orderHistory.length === 0 ? (
              <div className="empty-state text-center py-5">
                <FontAwesomeIcon icon={faHistory} size="3x" className="text-muted mb-3" />
                <h4>No Order History</h4>
                <p className="text-muted">You haven't completed any previous orders yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle shadow-sm bg-white rounded">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-bold">#{order.id}</td>
                        <td className="small text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          {order.items?.map((item) => `${item.product?.name} (x${item.quantity})`).join(", ")}
                        </td>
                        <td className="fw-bold">₹{order.totalAmount}</td>
                        <td>{getStatusBadge(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
