import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

import { Link } from "react-router-dom";
import "../style/Footer.css";
import logo from "../assets/Graphura logo Black.png";

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/Graphura.in?rdid=mznlALZZfcc0M1j1&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19nKAMTopZ%2F#", label: "Facebook", color: "#1877F2" },
    { icon: Twitter, href: "https://x.com/Graphura", label: "Twitter", color: "#1DA1F2" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/graphura.in/",
      label: "Instagram",
      gradient: true
    },
    { icon: Linkedin, href: "https://www.linkedin.com/company/graphura-india-private-limited/", label: "LinkedIn", color: "#0A66C2" },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="Graphura Logo" />
            </div>

            <p className="footer-description semi-bold">
              Modernizing restaurant operations with digital solutions.
            </p>

            <div className="footer-social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`footer-social-link ${social.gradient ? "insta-gradient" : ""}`}
                  style={!social.gradient ? { background: social.color } : {}}
                  aria-label={social.label}
                >
                  <social.icon className="footer-social-icon" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-links">
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/about" className="footer-link">About Us</Link></li>
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/blogs" className="footer-link">Blogs</Link></li>
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/our-story" className="footer-link">Our Story</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-links">
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/ordering" className="footer-link">Online Ordering</Link></li>
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/reservation" className="footer-link">Table Booking</Link></li>
              <li onClick={() => window.scrollTo(0, 0)}><Link to="/catering" className="footer-link">Catering</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section footer-contact">
            <h3 className="footer-heading">Contact Us</h3>

            <ul className="contact-list">
              <li>
                <span className="contact-label">Address:</span>
                <p>Graphura India Pvt. Ltd., Near RSF, Pataudi, Gurgaon, Haryana 122503</p>
              </li>

              <li>
                <span className="contact-label">Phone:</span>
                <a href="tel:+917378021327">+91 73780 21327</a>
              </li>

              <li>
                <span className="contact-label">Email:</span>
                <a href="mailto:support@graphura.in">support@graphura.in</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2025 Graphura India Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}