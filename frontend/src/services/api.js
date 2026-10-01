// API service layer with JWT header injection & base URL handling
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getHeaders = () => {
  const token = localStorage.getItem("jbn_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth APIs
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
  },

  // Products APIs
  getProducts: async (category = "") => {
    try {
      const url = category
        ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/products`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    } catch (err) {
      console.warn("Backend not available, using offline product fallback", err);
      return null; // fallback will be handled in UI if needed
    }
  },

  createProduct: async (product) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create product");
    return data;
  },

  updateProduct: async (id, product) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update product");
    return data;
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return await res.json();
  },

  // Orders APIs
  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to place order");
    return data;
  },

  getMyActiveOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders/my-active`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch active orders");
    return await res.json();
  },

  getMyOrderHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/orders/my-history`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch order history");
    return await res.json();
  },

  getAllOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch all orders");
    return await res.json();
  },

  updateOrderStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update order status");
    return data;
  },

  // Admin APIs
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return await res.json();
  },

  getAllUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  },

  updateUserRole: async (id, role) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error("Failed to update user role");
    return await res.json();
  },
};
