import { useEffect } from "react";
import { createPortal } from "react-dom";
import "../../../style/MenuPage/QuickViewModal.css";
import CategoryBadge from "./CategoryBadge";
import { FaClock } from "react-icons/fa";
import { MdStarRate } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";

export default function QuickViewModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qv-image">
          <img 
            src={item.image} 
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          <button className="qv-close" onClick={onClose}>
            ✕
          </button>
          <div className="qv-badge">
            <CategoryBadge category={item.category} />
          </div>
        </div>

        <div className="qv-content">
          <div className="qv-header">
            <h2>{item.name}</h2>
            <span className="qv-price">₹{item.price}</span>
          </div>

          <p className="qv-desc">{item.description}</p>

          <div className="qv-stats" style={{ marginTop: '15px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {item.rating && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaStar size={14} color="#ffc107" /> 
                <strong>{item.rating}</strong>
              </span>
            )}
            {item.prepTime && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaClock size={14} color="#666" /> 
                <strong>{item.prepTime}</strong>
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '14px' }}>🔥</span>
              <strong>{item.calories || '250-350'} cal</strong>
            </span>
          </div>

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="qv-section" style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Ingredients</h4>
              <div className="qv-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {item.ingredients.map((ing, i) => (
                  <span key={i} style={{ 
                    background: '#f0f0f0', 
                    padding: '5px 12px', 
                    borderRadius: '20px', 
                    fontSize: '13px',
                    color: '#333'
                  }}>{ing}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
              <strong style={{ color: '#333' }}>🍽️ Perfect for:</strong> {item.category || 'Any meal'}
            </p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
              <strong style={{ color: '#333' }}>👨‍🍳 Chef's Note:</strong> Freshly prepared with authentic spices and quality ingredients.
            </p>
          </div>

          <button
            className="qv-add"
            onClick={() => {
              onAddToCart(item);
              onClose();
            }}
          >
            Add to Cart – ₹{item.price}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
