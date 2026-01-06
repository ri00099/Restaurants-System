const Razorpay = require("razorpay");
const crypto = require("crypto");
const { sendPaymentSuccessEmail } = require("../utils/email.service.js");
const Payment = require("../models/payment.model.js");
const dotenv = require("dotenv");
const User = require("../models/user.model.js");
dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("❌ Razorpay keys are missing in environment variables");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    // 🔴 STRICT VALIDATION
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Always round to 2 decimals
    amount = Number(amount.toFixed(2));

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      orderId: order.id,
      amount,
      currency: "INR",
      status: "pending",
      userId: req.user?.userId || null,
    });

    res.json({ success: true, order });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

/* ================= VERIFY PAYMENT ================= */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "completed",
      },
      { new: true }
    );

    // 🔥 ONLY EMAIL LOGIC (no schema change)
    if (payment?.userId) {
      const user = await User.findById(payment.userId);
      if (user?.email) {
        await sendPaymentSuccessEmail({
          email: user.email,
          amount: payment.amount,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
