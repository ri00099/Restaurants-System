// const express = require("express");
// const { createOrder, verifyPayment } = require("../controllers/payment.controller");
// const router = express.Router();

// router.post("/create-order", createOrder);
// router.post("/verify-payment", verifyPayment);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/payment.controller");
const verifyToken = require("../middleware/auth.middleware");
const { paymentLimiter } = require("../middleware/rateLimiter.middleware");
const { paymentValidation, verifyPaymentValidation } = require("../middleware/validators");
const validateRequest = require("../middleware/validate.middleware");

router.post("/create-order", verifyToken, paymentLimiter, paymentValidation, validateRequest, createOrder);
router.post("/verify-payment", paymentLimiter, verifyPaymentValidation, validateRequest, verifyPayment);

module.exports = router;