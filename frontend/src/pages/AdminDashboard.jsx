import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faShoppingBag,
  faBirthdayCake,
  faUsers,
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faBan,
  faFilter,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders"); // 'orders', 'products', 'users'
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, activeOrders: 0, totalCustomers: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [msg, setMsg] = useState("");

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "cake",
    tag: "",
    imageUrl: "",
    available: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAllOrders().catch(() => []),
        api.getProducts().catch(() => []),
        api.getAllUsers().catch(() => []),
      ]);

      if (statsRes) setStats(statsRes);
      if (ordersRes) setOrders(ordersRes);
      if (productsRes) setProducts(productsRes);
      if (usersRes) setUsers(usersRes);
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setMsg(`Order #${orderId} status updated to ${newStatus}`);
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  // Product Modal Handlers
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category: product.category || "cake",
        tag: product.tag || "",
        imageUrl: product.imageUrl || "",
        available: product.available !== false,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "cake",
        tag: "",
        imageUrl: "",
        available: true,
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
        setMsg("Product updated successfully!");
      } else {
        await api.createProduct(productForm);
        setMsg("New product added successfully!");
      }
      setShowProductModal(false);
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(id);
      setMsg("Product deleted.");
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handleUserRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    try {
      await api.updateUserRole(userId, newRole);
      setMsg("User role updated successfully!");
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to update role");
    }
  };

  const filteredOrders = orderFilter === "ALL"
    ? orders
    : orders.filter((o) => o.status === orderFilter);

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-banner mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <span className="badge bg-light text-dark mb-2">Admin Control Center</span>
              <h2 className="text-white">JBN Cakes Management Dashboard</h2>
              <p className="text-white-50 mb-0">
                Manage orders, product catalog, customer accounts, and revenue analytics.
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <span className="badge bg-success p-2">
                <FontAwesomeIcon icon={faDatabase} className="me-1" /> TiDB Database Connected
              </span>
            </div>
          </div>
        </div>

        {msg && <div className="alert alert-success">{msg}</div>}

        {/* Analytics Stats Overview */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-icon bg-pink-light text-pink">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <h3 className="stat-value">₹{stats.totalRevenue || 0}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-icon bg-primary-light text-primary">
                <FontAwesomeIcon icon={faShoppingBag} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Orders</span>
                <h3 className="stat-value">{stats.totalOrders || orders.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-icon bg-warning-light text-warning">
                <FontAwesomeIcon icon={faBirthdayCake} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Active Orders</span>
                <h3 className="stat-value">{stats.activeOrders || 0}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-icon bg-success-light text-success">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Customers</span>
                <h3 className="stat-value">{stats.totalCustomers || users.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="dashboard-tabs mb-4">
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
            Manage Orders ({orders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <FontAwesomeIcon icon={faBirthdayCake} className="me-2" />
            Manage Products ({products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            User Roles & Settings
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-pink" role="status"></div>
            <p className="mt-2 text-muted">Loading admin portal...</p>
          </div>
        ) : activeTab === "orders" ? (
          <div className="orders-admin-section">
            {/* Filter Bar */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h5 className="mb-0">Customer Orders</h5>
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-muted" />
                <select
                  className="form-select form-select-sm w-auto"
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PREPARING">PREPARING</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="table-responsive bg-white rounded shadow-sm">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No orders match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-bold">#{order.id}</td>
                        <td>
                          <div><strong>{order.user?.name || "Guest"}</strong></div>
                          <small className="text-muted">{order.user?.email}</small>
                        </td>
                        <td>
                          <div>{order.customerPhone || "N/A"}</div>
                          <small className="text-muted">{order.deliveryAddress}</small>
                        </td>
                        <td>
                          {order.items?.map((i) => `${i.product?.name} (x${i.quantity})`).join(", ")}
                        </td>
                        <td className="fw-bold text-pink">₹{order.totalAmount}</td>
                        <td>
                          <span className={`badge bg-${
                            order.status === "DELIVERED" ? "success" :
                            order.status === "CANCELLED" ? "danger" :
                            order.status === "PENDING" ? "warning text-dark" : "info text-dark"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "products" ? (
          <div className="products-admin-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Cakes & Desserts Inventory</h5>
              <button
                className="btn btn-pink-primary btn-sm"
                onClick={() => handleOpenProductModal()}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add New Cake
              </button>
            </div>

            <div className="row g-3">
              {products.map((prod) => (
                <div className="col-md-4 col-sm-6" key={prod.id}>
                  <div className="product-admin-card h-100">
                    <img
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"}
                      alt={prod.name}
                      className="product-admin-img"
                    />
                    <div className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{prod.name}</h6>
                        <span className="fw-bold text-pink">₹{prod.price}</span>
                      </div>
                      <p className="small text-muted text-truncate-2 mb-2">{prod.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark">{prod.category}</span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleOpenProductModal(prod)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteProduct(prod.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="users-admin-section">
            <h5 className="mb-3">User Account Management</h5>
            <div className="table-responsive bg-white rounded shadow-sm">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Current Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td className="fw-bold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === "ADMIN" ? "bg-danger" : "bg-primary"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleUserRoleChange(u.id, u.role)}
                        >
                          Toggle to {u.role === "ADMIN" ? "CUSTOMER" : "ADMIN"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showProductModal && (
          <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
            <div className="modal-card p-4 bg-white rounded shadow-lg max-w-500 w-100">
              <h5 className="fw-bold mb-3">{editingProduct ? "Edit Cake Product" : "Add New Cake Product"}</h5>
              <form onSubmit={handleSaveProduct}>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Cake Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small fw-bold">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold">Category</label>
                    <select
                      className="form-select"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option value="cake">cake</option>
                      <option value="brownie">brownie</option>
                      <option value="pastry">pastry</option>
                    </select>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Badge Tag (e.g. Popular, Bestseller)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowProductModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-pink-primary">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
