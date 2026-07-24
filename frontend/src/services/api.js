import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  withCredentials: true,        // sends HttpOnly refresh token cookie automatically
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request interceptor: attach access token ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: handle 401 → refresh ────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data.data.accessToken;
        sessionStorage.setItem('access_token', newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        sessionStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth API calls ─────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) =>
    api.post('/auth/register', data),

  login: (data) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  refresh: () => api.post('/auth/refresh'),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }),

  verifyEmail: (token) =>
    api.get(`/auth/verify-email?token=${token}`),

  getProfile: () => api.get('/users/me'),
};

// ── Users API calls ────────────────────────────────────────────────────────────
export const usersApi = {
  getAllUsers: () => api.get('/users'),
  getMySessions: () => api.get('/users/sessions'),
  getMyAuditLogs: (page = 0, size = 10) => api.get(`/users/audit-logs?page=${page}&size=${size}`),
};

// ── Warehouse API calls ────────────────────────────────────────────────────────
export const warehouseApi = {
  getAllWarehouses: () => api.get('/warehouses'),
  getWarehouseById: (id) => api.get(`/warehouses/${id}`),
  createWarehouse: (data) => api.post('/warehouses', data),
  updateWarehouse: (id, data) => api.put(`/warehouses/${id}`, data),
  deleteWarehouse: (id) => api.delete(`/warehouses/${id}`),
  getAvailable: () => api.get('/warehouses/available'),
};

// ── Supplier API calls ─────────────────────────────────────────────────────────
export const supplierApi = {
  getAllSuppliers: () => api.get('/suppliers'),
  getSupplierById: (id) => api.get(`/suppliers/${id}`),
  createSupplier: (data) => api.post('/suppliers', data),
  updateSupplier: (id, data) => api.put(`/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/suppliers/${id}`),

  getAllPurchaseOrders: () => api.get('/suppliers/purchase-orders'),
  getPurchaseOrderById: (id) => api.get(`/suppliers/purchase-orders/${id}`),
  createPurchaseOrder: (data) => api.post('/suppliers/purchase-orders', data),
  updateOrderStatus: (id, status) => api.patch(`/suppliers/purchase-orders/${id}/status?status=${status}`),
  getOrdersBySupplier: (supplierId) => api.get(`/suppliers/${supplierId}/purchase-orders`),
};

// ── Products API calls ─────────────────────────────────────────────────────────
export const productsApi = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
};

// ── Inventory API calls ────────────────────────────────────────────────────────
export const inventoryApi = {
  getInventoryByProduct: (productId) => api.get(`/inventory/product/${productId}`),
  getInventoryByWarehouse: (warehouseId) => api.get(`/inventory/warehouse/${warehouseId}`),
  getItem: (productId, warehouseId) => api.get(`/inventory/item?productId=${productId}&warehouseId=${warehouseId}`),
  getLowStock: () => api.get('/inventory/low-stock'),
  getAuditLog: (productId) => api.get(`/inventory/audit/${productId}`),
  initialize: (data) => api.post('/inventory/initialize', data),
  adjustStock: (id, data) => api.post(`/inventory/${id}/adjust`, data),
  reserveStock: (id, data) => api.post(`/inventory/${id}/reserve`, data),
};
