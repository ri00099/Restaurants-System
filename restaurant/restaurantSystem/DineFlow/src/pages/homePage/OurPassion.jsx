import React from 'react'
import '../../style/homePage/OurPassion.css'
import { useNavigate } from 'react-router-dom'

const OurPassion = () => {
    const navigate = useNavigate();
    const handleRedirect = () => {
      navigate("/contact");
      window.scrollTo(0, 0);
    };
  return (
    <>
    <section className="about-section">
        <h2 className="page-title">Our Passion for Perfect Dining</h2>
        <p className="about-text">
          At FoodFlow, we blend exceptional cuisine with seamless dining efficiency.
          Our mission is to create an unforgettable experience—from kitchen precision 
          to customer satisfaction. Every dish is crafted with passion and presented with care.
        </p>
        <button className="about-btn" onClick={handleRedirect}>Learn More</button>
      </section>
    </>
  )
}

export default OurPassion