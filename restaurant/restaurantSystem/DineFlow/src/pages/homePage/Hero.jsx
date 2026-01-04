import React from "react";
import "../../style/homePage/Hero.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const scrollToTodaysSpecial = () => {
    const element = document.getElementById("todays-special");
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/menu");
    window.scrollTo(0, 0);
  };
  return (
    <section className="hero">
      {/* Layer 1 overlay */}
      <div className="overlay"></div>


      {/* Content */}
      <div className="hero-content">
        <h1>
          Savor the Moment,
          <br />
          Streamline Your Dine
        </h1>

        <p>
          Experience culinary excellence with your ultimate partner in modern
          restaurant management and delightful dining.
        </p>

        <div className="buttons">
          <button className="btn-ligh" onClick={handleRedirect}>
            View Menu
          </button>
          <button className="btn-primar" onClick={scrollToTodaysSpecial}>
            View Today's Special
          </button>
        </div>
      </div>



      {/* Footer text */}
    </section>
  );
};

export default Hero;
