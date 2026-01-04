// const express = require("express");
// const { 
//   createFinalOrder, 
//   getOrderById, 
//   getAllOrders,
//   getUserOrders,
//   updateOrderStatus 
// } = require("../controllers/order.controller");

// const verifyToken = require("../middleware/auth.middleware");
// const router = express.Router();

// // Routes
// router.post("/final-order", verifyToken, createFinalOrder);
// //router.post("/final-order", createFinalOrder);
// router.get("/all-orders", getAllOrders);
// router.get("/user-orders", verifyToken, getUserOrders);
// router.patch("/:orderId/status", updateOrderStatus);
// router.get("/:orderId", getOrderById);  // Keep this last to avoid conflicts

// module.exports = router;

const express = require("express");
const { 
  createFinalOrder, 
  getOrderById, 
  getAllOrders,
  getUserOrders,
  updateOrderStatus 
} = require("../controllers/order.controller");

const verifyToken = require("../middleware/auth.middleware");
const verifyAdmin = require("../middleware/admin.middleware"); // Assuming Admin = Kitchen Staff
const { orderValidation, statusUpdateValidation } = require("../middleware/validators");
const validateRequest = require("../middleware/validate.middleware");

const router = express.Router();

router.post("/final-order", verifyToken, orderValidation, validateRequest, createFinalOrder);

router.get("/all-orders", verifyToken, verifyAdmin, getAllOrders); // (Staff/Admin needs to see all orders)
router.get("/user-orders", verifyToken, getUserOrders);
router.get("/my-orders", verifyToken, getUserOrders); // Alias for user-orders

router.patch("/:orderId/status", verifyToken, verifyAdmin, statusUpdateValidation, validateRequest, updateOrderStatus);

// 5. Single Order Details (Open to logged in users)
router.get("/:orderId", verifyToken, getOrderById);

module.exports = router;