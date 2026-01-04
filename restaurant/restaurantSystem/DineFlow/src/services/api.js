import axios from 'axios';

// 1. Create the connection - Use environment variable for production
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`,
});

// 2. Security Guard (Attach Token)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// AUTH (OTP BASED)
// Step 1: Send Email to get OTP
export const requestOtp = (userData) => API.post('/auth/request-otp', userData); // { email, name, phone }
// Step 2: Send OTP to get Token
export const verifyOtp = (data) => API.post('/auth/verify-otp', data); // { email, otp }

// --- MENU ---
export const getMenu = () => API.get('/menu/all');

// --- ORDERS ---
export const placeFinalOrder = (orderData) => API.post('/orders/final-order', orderData);
export const getUserOrders = () => API.get('/orders/user-orders');

// --- PAYMENT ---
export const createPaymentOrder = (data) => API.post('/payment/create-order', data);
export const verifyPayment = (data) => API.post('/payment/verify-payment', data);

// --- RESERVATION ---
export const bookTable = (bookingData) => API.post('/reservations/book', bookingData);
export const getTableStatus = (date, timeSlot) => API.get(`/reservations/status?date=${date}&timeSlot=${timeSlot}`);

export default API;