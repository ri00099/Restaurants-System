const Feedback = require('../models/feedback');
const { sendContactEmail } = require("../utils/email.service");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // ---------------- VALIDATION ----------------
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // ---------------- SAVE TO DB ----------------
    const feedback = new Feedback({
      name,
      email,
      subject,
      message
    });

    await feedback.save();

    console.log("✅ Feedback saved to DB");

    // ---------------- SEND EMAIL ----------------
    console.log("📧 Attempting to send contact email from:", email);
    const emailSent = await sendContactEmail(
      name,
      email,
      subject,
      message
    );

    console.log("📧 Email send result:", emailSent);

    if (!emailSent) {
      console.warn("⚠️ Email failed, but feedback saved");
    }

    return res.status(201).json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon."
    });

  } catch (error) {
    console.error("❌ Contact submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

// Handle online order inquiry form submission
exports.submitOnlineOrderInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Send email to restaurant
    const { sendOnlineOrderInquiry } = require("../utils/email.service");
    console.log("📧 Attempting to send online order inquiry from:", name);
    const emailSent = await sendOnlineOrderInquiry(name, email, phone, message);
    console.log("📧 Email send result:", emailSent);

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: "Online order inquiry sent successfully! We'll contact you soon."
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send inquiry. Please try again."
      });
    }
  } catch (error) {
    console.error("Error in submitOnlineOrderInquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};


//  GET all feedback messages (Admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });

  } catch (error) {
    console.error("❌ Fetch feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback messages"
    });
  }
};
