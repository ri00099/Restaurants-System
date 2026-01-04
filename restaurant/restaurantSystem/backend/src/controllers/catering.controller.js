const { sendContactEmail } = require("../utils/email.service");

exports.submitCateringRequest = async (req, res) => {
  try {
    const { name, email, date, guests, message } = req.body;

    // Validation
    if (!name || !email || !date || !guests) {
      return res.status(400).json({
        success: false,
        message: "Name, email, event date, and guest count are required"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate guest count
    if (guests < 1) {
      return res.status(400).json({
        success: false,
        message: "Guest count must be at least 1"
      });
    }

    // Format the message for email
    const subject = `Catering Request - ${guests} guests on ${date}`;
    const fullMessage = `
CATERING BOOKING REQUEST

Name: ${name}
Email: ${email}
Event Date: ${date}
Number of Guests: ${guests}

Additional Notes:
${message || 'No additional notes provided'}

---
Please respond to this catering request at your earliest convenience.
    `;

    console.log("📧 Attempting to send catering request email from:", email);
    const emailSent = await sendContactEmail(name, email, subject, fullMessage);
    console.log("📧 Catering email send result:", emailSent);

    if (emailSent) {
      res.json({
        success: true,
        message: "Catering request received! We'll contact you shortly to discuss details."
      });
    } else {
      console.error("❌ Catering email failed to send");
      res.status(500).json({
        success: false,
        message: "Failed to send catering request. Please try again or call us directly."
      });
    }

  } catch (error) {
    console.error("Catering submission error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later or contact us by phone."
    });
  }
};
