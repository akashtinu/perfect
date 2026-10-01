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
    const styleMap = {
      PENDING:          { background: "#ffc107", color: "#212529", label: "⏳ Pending" },
      PREPARING:        { background: "#0dcaf0", color: "#212529", label: "🍰 Preparing" },
      READY_FOR_PICKUP: { background: "#0d6efd", color: "#fff",    label: "✅ Ready for Pickup" },
      OUT_FOR_DELIVERY: { background: "#6f42c1", color: "#fff",    label: "🚚 Out for Delivery" },
      DELIVERED:        { background: "#198754", color: "#fff",    label: "✔ Delivered" },
      COMPLETED:        { background: "#198754", color: "#fff",    label: "✔ Completed" },
      PICKED_UP:        { background: "#198754", color: "#fff",    label: "✔ Picked Up" },
      CANCELLED:        { background: "#dc3545", color: "#fff",    label: "✖ Cancelled" },
    };
    const s = styleMap[status] || { background: "#6c757d", color: "#fff", label: status || "UNKNOWN" };
    return (
      <span style={{
        background: s.background,
        color: s.color,
        padding: "4px 12px",
        borderRadius: "999px",
        fontSize: "0.78rem",
        fontWeight: 700,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}>
        {s.label}
      </span>
    );
  };

  const renderStatusTracker = (status) => {
    const steps = [
      { key: "PENDING",          icon: faClock,        label: "Order Placed",     desc: "We received your order!" },
      { key: "PREPARING",        icon: faBirthdayCake, label: "Preparing",        desc: "Baking your cake 🎂" },
      { key: "READY_FOR_PICKUP", icon: faStore,        label: "Ready for Pickup", desc: "Come pick it up!" },
      { key: "PICKED_UP",        icon: faCheckCircle,  label: "Picked Up",        desc: "Enjoy your cake! 🎉" },
    ];
    const ORDER = ["PENDING", "PREPARING", "READY_FOR_PICKUP", "PICKED_UP", "DELIVERED", "COMPLETED"];

    if (status === "CANCELLED") {
      return (
        <div style={{
          background: "#fff5f5",
          border: "1.5px solid #fca5a5",
          borderRadius: 16,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}>
          <FontAwesomeIcon icon={faTimesCircle} style={{ color: "#dc3545", fontSize: 22 }} />
          <div>
            <div style={{ fontWeight: 700, color: "#dc3545" }}>Order Cancelled</div>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>This order has been cancelled.</div>
          </div>
        </div>
      );
    }

    const currentIdx = ORDER.indexOf(status);

    return (
      <div style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        border: "1.5px solid #e2e8f0",
        borderRadius: 20,
        padding: "20px 24px",
        marginTop: 14,
      }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", marginBottom: 18, textTransform: "uppercase", letterSpacing: 1 }}>
          📦 Order Progress
        </div>

        {/* Stepper Row */}
        <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
          {steps.map((step, i) => {
            const stepIdx = ORDER.indexOf(step.key);
            const isDone    = stepIdx < currentIdx;
            const isCurrent = stepIdx === currentIdx;
            const isPending = stepIdx > currentIdx;
            const isLast    = i === steps.length - 1;

            /* circle colours */
            const circleBg    = isDone ? "#e6005c" : isCurrent ? "#e6005c" : "#e2e8f0";
            const circleColor = isDone || isCurrent ? "#fff" : "#94a3b8";
            const labelColor  = isDone || isCurrent ? "#0f172a" : "#94a3b8";
            const descColor   = isDone || isCurrent ? "#64748b" : "#cbd5e1";

            return (
              <React.Fragment key={step.key}>
                {/* Step node */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto", zIndex: 2, minWidth: 72 }}>

                  {/* Pulse wrapper for active step */}
                  <div style={{ position: "relative", marginBottom: 10 }}>
                    {isCurrent && (
                      <span style={{
                        position: "absolute",
                        inset: -6,
                        borderRadius: "50%",
                        border: "3px solid #e6005c",
                        opacity: 0.4,
                        animation: "trackerPulse 1.4s ease-in-out infinite",
                      }} />
                    )}
                    {isCurrent && (
                      <span style={{
                        position: "absolute",
                        inset: -12,
                        borderRadius: "50%",
                        border: "2px solid #e6005c",
                        opacity: 0.15,
                        animation: "trackerPulse 1.4s ease-in-out infinite 0.3s",
                      }} />
                    )}
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: circleBg,
                      color: circleColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 800,
                      boxShadow: isCurrent
                        ? "0 0 0 4px rgba(230,0,92,0.18), 0 6px 18px rgba(230,0,92,0.3)"
                        : isDone
                        ? "0 4px 12px rgba(230,0,92,0.2)"
                        : "0 2px 6px rgba(0,0,0,0.06)",
                      transition: "all 0.4s ease",
                      position: "relative",
                      zIndex: 1,
                    }}>
                      {isDone
                        ? <FontAwesomeIcon icon={faCheckCircle} />
                        : <FontAwesomeIcon icon={step.icon} />
                      }
                    </div>
                  </div>

                  {/* Step label */}
                  <div style={{
                    fontSize: "0.72rem",
                    fontWeight: isCurrent || isDone ? 800 : 600,
                    color: labelColor,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    transition: "color 0.3s",
                  }}>
                    {step.label}
                  </div>

                  {/* Step desc */}
                  <div style={{
                    fontSize: "0.65rem",
                    color: descColor,
                    textAlign: "center",
                    marginTop: 2,
                    whiteSpace: "nowrap",
                  }}>
                    {isCurrent ? <span style={{ color: "#e6005c", fontWeight: 700 }}>← Now</span> : step.desc}
                  </div>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div style={{
                    flex: 1,
                    height: 4,
                    background: isDone ? "#e6005c" : "#e2e8f0",
                    borderRadius: 4,
                    marginTop: 22,
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 0.5s",
                  }}>
                    {/* Animated shimmer on completed lines */}
                    {isDone && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                        animation: "trackerShimmer 1.8s linear infinite",
                      }} />
                    )}
                    {/* Animated fill on the CURRENT connecting line (between done and current) */}
                    {isCurrent === false && isPending === false && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "#e6005c",
                        animation: "trackerFill 0.8s ease forwards",
                      }} />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* CSS Keyframes injected inline */}
        <style>{`
          @keyframes trackerPulse {
            0%   { transform: scale(1);   opacity: 0.5; }
            50%  { transform: scale(1.35); opacity: 0.15; }
            100% { transform: scale(1);   opacity: 0.5; }
          }
          @keyframes trackerShimmer {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          @keyframes trackerFill {
            from { transform: scaleX(0); transform-origin: left; }
            to   { transform: scaleX(1); transform-origin: left; }
          }
        `}</style>
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
