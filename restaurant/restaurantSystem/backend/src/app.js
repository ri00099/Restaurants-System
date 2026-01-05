const express = require("express");
const cors = require("cors");
// const { apiLimiter } = require('./middleware/rateLimiter.middleware');

const app = express();

// CORS configuration - allow development and production origins
const allowedOrigins = [
  "https://restaurants-system.vercel.app/",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL // Add your Vercel URL here
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost during development
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const kitchenRoutes = require('./routes/kitchen.routes');
const authRoutes = require('./routes/auth.routes');
const reservationRoutes = require('./routes/reservation.routes');
const menuRoutes = require('./routes/menu.routes');
const categoryRoutes = require('./routes/category.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const paymentRoutes = require('./routes/payment.routes');
const contactRoutes = require('./routes/contact.routes');
const cateringRoutes = require('./routes/catering.routes');

// Apply rate limiting to all API routes (DISABLED for development)
// app.use('/api/', apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/reservation", reservationRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/catering", cateringRoutes);




module.exports = app;