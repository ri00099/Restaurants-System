import React from "react";
import "./AboutUs.css";
import { ArrowRight, Rocket, ChartCandlestick, CalendarCheck, Handshake } from "lucide-react";
import { useNavigate } from "react-router-dom";


const About = () => {
const scrollToOursTeam = () => {
    const element = document.getElementById("our-team-scroll");
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/reservation");
    window.scrollTo(0, 0);
  };
  const team = [
    {
      name: "Aarav Khanna",
      role: "Head Chef",
      img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&auto=format&fit=crop&q=60",
    },
    {
      name: "Priya Sharma",
      role: "Sous Chef",
      img: "https://plus.unsplash.com/premium_photo-1661778091956-15dbe6e47442?w=900&auto=format&fit=crop&q=60",
    },
    {
      name: "Rohan Gupta",
      role: "Restaurant Manager",
      img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=60",
    },
    {
      name: "Simran Kaur",
      role: "Customer Experience Lead",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60",
    },
  ];

  const cards = [
    {
      title: "Fresh Products",
      text: "We use only the freshest, high-quality ingredients to ensure every dish bursts with natural flavor.",
      icon: <CalendarCheck strokeWidth={1.75} />,
    },
    {
      title: "Skilled Chefs",
      text: "Our chefs bring passion and years of culinary experience to craft dishes that delight every palate.",
      icon: <ChartCandlestick strokeWidth={1.75} />,
    },
    {
      title: "Best Bar",
      text: "Enjoy a premium selection of cocktails, wines, and spirits crafted by expert bartenders.",
      icon: <Rocket />,
    },
    {
      title: "Vegan Cuisine",
      text: "Discover delicious and wholesome vegan dishes made using fresh produce and global flavors.",
      icon: <Handshake strokeWidth={1.75} />,
    },
  ];

  return (
    <div className="about-page">


      {/* HERO */}
      <header className="hero-about">
        {/* Blurred background */}
        <div className="hero-about-bg"></div>

        {/* Dark overlay */}
        <div className="hero-about-overlay"></div>

        <div className="hero-about2">
          <p className="purpose-heading">About Us</p>

          <p className="purpose-subtext">
            At our restaurant, we believe great food brings people together.
          </p>
          <p className="purpose-subtext">
            Every dish we serve is crafted with fresh ingredients, authentic flavors,
            and a passion for excellence.
          </p>
          <p className="purpose-subtext">
            We're here to serve food that feels like home — made with love, care, and quality.
          </p>

          <div className="buttons">
            <button className="btn-ligh" onClick={scrollToOursTeam}>
              Meet our team
            </button>
            <button className="btn-primar" onClick={handleRedirect}>
              Book your table
            </button>
          </div>
        </div>
      </header>

      {/* MISSION */}
      <section className="mission">
        <div className="container">
          <h2 className="purpose-heading">We Invite You to Our Restaurant</h2>
          <p className="purpose-subtext">
            Experience delicious food, a cozy atmosphere, and genuine hospitality.
            Whether you're here for a quick meal or a celebration, we make every moment memorable.
          </p>

          <div className="video-box-normal">
            <iframe
              src="https://www.youtube.com/embed/xPPLbEFbCAo?autoplay=1&mute=1&loop=1&playlist=xPPLbEFbCAo&controls=0"
              title="Restaurant Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* PURPOSE */}
      <section className="purpose-section">
        <h2 className="purpose-heading">What Drives Us</h2>
        <p className="purpose-subtext">
          The principles that shape our work and define our mission.
        </p>

        <div className="purpose-grid">
          {cards.map((item, index) => (
            <div className="purpose-card" key={index}>
              <div className="purpose-icon">{item.icon}</div>
              <h3 className="purpose-title">{item.title}</h3>
              <p className="purpose-text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section" id="our-team-scroll">
        <h2 className="team-heading">Meet Our Team</h2>
        <p className="team-subtext">
          The people who work together to give you the best dining experience.
        </p>

        <div className="team-grid">
          {team.map((m, idx) => (
            <div className="team-card" key={idx}>
              <div className="team-img-wrapper">
                <img src={m.img} alt={m.name} className="team-img" />
              </div>
              <h3 className="team-name">{m.name}</h3>
              <p className="team-role">{m.role}</p>
              <div className="team-line"></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-wrapper">
          <h2 className="cta-title">Your Table Awaits.</h2>
          <p className="cta-text">
            Step into a dining experience where flavors, ambiance, and service come together beautifully.
          </p>

          <button className="cta-button" onClick={handleRedirect}>
            Book your table now <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;