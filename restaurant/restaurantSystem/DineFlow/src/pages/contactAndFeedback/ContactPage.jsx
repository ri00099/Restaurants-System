import React, { useState } from "react";
import axios from "axios";
import { Facebook, Twitter, Instagram, Linkedin, Send, Phone, Mail, MapPin } from "lucide-react";
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      // Production URL check: ensure this points to your real API
      const response = await axios.post("/api/contact", formData);
      if (response.data.success) {
        setSubmitStatus({ type: "success", message: "Message sent! We'll get back to you shortly." });
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.response?.data?.message || "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      {/* HERO SECTION */}
      <section className="contact-hero" aria-label="Page Header">
        <div className="contact-hero-overlay">
          <h1 className="hero-title">Contact & Feedback</h1>
          <p className="hero-subtitle">
            Partnering with you to modernize restaurant operations. Reach out for inquiries, feedback, or support.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="contact-wrapper">
        {/* FEEDBACK FORM */}
        <section className="contact-card shadow-sm">
          <h2 className="card-title">Send Us Your Feedback</h2>
          
          {submitStatus && (
            <div className={`alert-toast alert-${submitStatus.type}`} role="alert">
              {submitStatus.message}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" placeholder="General Inquiry" value={formData.subject} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="How can we help you?" rows="5" value={formData.message} onChange={handleChange} required />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="loader"></span> : <>Submit Message <Send size={18} /></>}
            </button>
          </form>
        </section>

        {/* INFO COLUMN */}
        <aside className="right-column">
          <section className="contact-card info-card">
            <h2 className="card-title">Our Location</h2>
            <div className="map-box">
              <iframe

title="google-map"

loading="lazy"

allowFullScreen

referrerPolicy="no-referrer-when-downgrade"

src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3518.057241886712!2d76.7756389!3d28.3255257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d41000fe8670d%3A0x7b0a08f0043a22af!2sGraphura%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1733323750000!5m2!1sen!2sin"

/>
            </div>
            <p className="address-text"><MapPin size={18} className="icon" /> Graphura India Pvt. Ltd., Near RSF, Pataudi, Gurgaon, 122503</p>
          </section>

          <section className="contact-card info-card">
            <h2 className="card-title">Get in Touch</h2>
            <div className="contact-links">
              <a href="tel:+917378021327" className="contact-link"><Phone size={20} /> +91-73780 21327</a>
              <a href="mailto:info@graphura.in" className="contact-link"><Mail size={20} /> info@graphura.in</a>
            </div>
            
            <div className="social-wrap">
              <span className="social-label">Follow Us</span>
              <div className="social-icons">
                <a href="https://www.facebook.com/Graphura.in?rdid=mznlALZZfcc0M1j1&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19nKAMTopZ%2F#" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={22} /></a>
                <a href="https://x.com/Graphura" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={22} /></a>
                <a href="https://www.instagram.com/graphura.in/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={22} /></a>
                <a href="https://www.linkedin.com/company/graphura-india-private-limited/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={22} /></a>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}