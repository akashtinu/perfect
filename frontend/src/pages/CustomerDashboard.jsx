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
  faStore,
  faTimesCircle,
  faBoxOpen,
  faArrowRight,
  faBan,
  faBirthdayCake,
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
    const map = {
      PENDING: { cls: "bg-warning text-dark", label: "⏳ Pending" },
      PREPARING: { cls: "bg-info text-dark", label: "🍰 Preparing" },
      READY_FOR_PICKUP: { cls: "bg-primary", label: "✅ Ready for Pickup" },
      OUT_FOR_DELIVERY: { cls: "bg-purple text-white", label: "🚚 Out for Delivery" },
      DELIVERED: { cls: "bg-success", label: "✔ Delivered" },
      COMPLETED: { cls: "bg-success", label: "✔ Completed" },
      PICKED_UP: { cls: "bg-success", label: "✔ Picked Up" },
      CANCELLED: { cls: "bg-danger", label: "✖ Cancelled" },
    };
    const s = map[status] || { cls: "bg-secondary", label: status };
    return <span className={`badge rounded-pill ${s.cls}`}>{s.label}</span>;
  };

  const renderStatusTracker = (status) => {
    const steps = [
      { key: "PENDING", icon: faClock, label: "Order Placed" },
      { key: "PREPARING", icon: faBirthdayCake, label: "Preparing" },
      { key: "READY_FOR_PICKUP", icon: faStore, label: "Ready for Pickup" },
      { key: "PICKED_UP", icon: faCheckCircle, label: "Picked Up" },
    ];
    const ORDER = ["PENDING", "PREPARING", "READY_FOR_PICKUP", "PICKED_UP", "DELIVERED", "COMPLETED"];
    const currentIdx = ORDER.indexOf(status);
    if (status === "CANCELLED") {
      return (
        <div className="status-tracker mt-3 d-flex align-items-center gap-2 text-danger">
          <FontAwesomeIcon icon={faTimesCircle} /> Order Cancelled
        </div>
      );
    }
    return (
      <div className="status-tracker mt-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {steps.map((step, i) => {
            const done = ORDER.indexOf(step.key) <= currentIdx;
            return (
              <React.Fragment key={step.key}>
                <div className={`tracker-step d-flex flex-column align-items-center ${done ? "active" : "inactive"}`}>
                  <div className={`tracker-icon rounded-circle d-flex align-items-center justify-content-center ${done ? "bg-pink text-white" : "bg-light text-muted"}`}
                    style={{ width: 36, height: 36, fontSize: 14 }}>
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                  <small className={`mt-1 ${done ? "fw-bold text-pink" : "text-muted"}`} style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                    {step.label}
                  </small>
                </div>
                {i < steps.length - 1 && (
                  <div className={`tracker-line flex-grow-1 ${done ? "bg-pink" : "bg-light"}`}
                    style={{ height: 3, minWidth: 20, borderRadius: 2 }} />
                )}
              </React.Fragment>
            );
          })}
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
                            <small className="text-muted d-block">Fulfillment / Location:</small>
                            <span>{order.deliveryAddress || "Store Pickup"}</span>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block">Total Amount:</small>
                            <span className="fs-5 fw-bold text-pink">₹{order.totalAmount}</span>
                          </div>
                        </div>

                        {order.status === "PENDING" ? (
                          <div className="mt-3 text-end">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              <FontAwesomeIcon icon={faBan} className="me-1" /> Cancel Order
                            </button>
                          </div>
                        ) : (
                          <div className="mt-3 text-end">
                            <small className="text-muted fst-italic">
                              🔒 Order is in <strong>{order.status.replace(/_/g, " ")}</strong> state and cannot be cancelled.
                            </small>
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
