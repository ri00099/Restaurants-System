// API Base URL Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  MENU: `${API_BASE_URL}/api/menu`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  RESERVATION: `${API_BASE_URL}/api/reservation`,
  PAYMENT: `${API_BASE_URL}/api/payment`,
  ANALYTICS: `${API_BASE_URL}/api/analytics`,
  CATEGORY: `${API_BASE_URL}/api/category`,
};
