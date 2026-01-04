import React, { useState } from "react";
import axios from "axios";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import "../../style/contactAndFeedBack/contact.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/contact",
        formData
      );

      if (response.data.success) {
        setSubmitStatus({ type: "success", message: response.data.message });
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-page">
      {/* HEADER */}
      <header className="contact-header">
        <h1>Contact & Feedback</h1>
        <p>
          We value your thoughts and inquiries. Reach out to us for feedback,
          questions, or reservations.
        </p>
      </header>

      {/* CONTENT */}
      <div className="contact-wrapper">
        {/* FORM */}
        <div className="contact-card">
          <h2>Send Us Your Feedback</h2>

          {submitStatus && (
            <div
              className={`alert alert-${submitStatus.type}`}
              style={{
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "6px",
                backgroundColor:
                  submitStatus.type === "success" ? "#d4edda" : "#f8d7da",
                color: submitStatus.type === "success" ? "#155724" : "#721c24",
                border: `1px solid ${
                  submitStatus.type === "success" ? "#c3e6cb" : "#f5c6cb"
                }`,
              }}
            >
              {submitStatus.message}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Regarding my recent visit..."
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="Share your experience or ask a question..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Submit Feedback"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-column">
          {/* MAP */}
          <div className="contact-card">
            <h2>Our Location</h2>
            <div className="map-box">
              <iframe
                title="google-map"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3518.057241886712!2d76.7756389!3d28.3255257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d41000fe8670d%3A0x7b0a08f0043a22af!2sGraphura%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1733323750000!5m2!1sen!2sin"
              />
            </div>

            <p className="address">
              Graphura India Private Limited, near RSF, Pataudi, Gurgaon,
              Haryana 122503
            </p>
          </div>

          {/* CONTACT DETAILS */}
          <div className="contact-card">
            <h2>Get in Touch</h2>
            <p>📞 +91-7378021327</p>
            <p>📧 info@graphura.in</p>
            <p>
              📍 Graphura India Private Limited, near RSF, Pataudi, Gurgaon,
              Haryana 122503
            </p>

            <div className="social-icons">
              <a
                href="https://www.facebook.com/Graphura.in?rdid=mznlALZZfcc0M1j1&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19nKAMTopZ%2F#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
              <Facebook size={24} style={{ cursor: "pointer" }} />

              </a>

              <a
                href="https://x.com/Graphura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
              <Twitter size={24} style={{ cursor: "pointer" }} />

              </a>

              <a
                href="https://www.instagram.com/graphura.in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
              <Instagram size={24} style={{ cursor: "pointer" }} />

              </a>

              <a
                href="https://www.linkedin.com/company/graphura-india-private-limited/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
              <Linkedin size={24} style={{ cursor: "pointer" }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
