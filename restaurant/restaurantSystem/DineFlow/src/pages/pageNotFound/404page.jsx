import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="nf-wrapper">
      <div className="nf-card">
        <div className="nf-code">404</div>

        <h1 className="nf-title">This page doesn’t exist</h1>
        <p className="nf-description">
          The page you’re trying to access might have been removed,
          renamed, or is temporarily unavailable.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn primary">
            Go Home
          </Link>
          <Link to="/menu" className="nf-btn secondary">
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
}