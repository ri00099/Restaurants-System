import "./OurStory.css";
import kitchenVedio from "../../../assets/kitchenVedio.mp4";
import kitchenStart from "../../../assets/kitchenStart.mp4";
import kitchenGrow from "../../../assets/kitchenGrow.mp4";
import { useNavigate } from "react-router-dom";
export default function OurStory() {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/menu");
    window.scrollTo(0, 0);
  };
  return (
    <div className="story-page">
      {/* HERO */}
      {/* HERO */}
      <section className="story-hero">
        {/* Background image */}
        <div className="story-hero-bg"></div>

        {/* Overlay */}
        <div className="story-hero-overlay"></div>

        {/* Content */}
        <div className="story-hero-content">
          <h1 className="story-title">Our Story</h1>
          <p className="story-subtitle">
            A journey of passion, flavor, and the art of serving happiness.
          </p>
        </div>
      </section>

      {/* ORIGIN */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-text">
            <h2>Where It All Began</h2>
            <p>
              Our journey started with a simple dream — bringing people together
              through delicious food crafted with love. What began as a small
              kitchen with big aspirations soon grew into a space filled with
              irresistible aromas, shared laughter, and countless happy faces
              gathered around the table.
            </p>
            <p>
              From the very beginning, our focus was never just on serving
              meals, but on creating experiences. Every dish we prepare carries
              a story — inspired by traditional flavors, refined with modern
              techniques, and perfected through passion and patience. We believe
              food has the power to connect hearts, spark conversations, and
              turn moments into memories that last far beyond the last bite.
            </p>
            <p>
              Every recipe, flavor, and every detail is thoughtfully crafted
              using fresh ingredients and time-honored method. We pour care into
              every step from sourcing quality produce to presenting each plate
              with pride.For us, cooking is an art, and hospitality is a promise
              we honor every single day.
            </p>

            <p>
              At our table, everyone is family. Whether you’re celebrating a
              special occasion or simply sharing a quiet meal, we strive to make
              you feel welcomed, valued, and at home. Because great food isn’t
              just about taste — it’s about warmth, comfort, and the joy of
              togetherness.
            </p>
          </div>
          <div className="story-image">
            <video
              src={kitchenStart}
              autoPlay
              loop
              muted
              playsInline
              className="story-video"
            ></video>
          </div>
        </div>
      </section>

      {/* GROWTH */}
      <section className="story-section gray-bg">
        <div className="story-container ">
          <div className="story-image">
            <video
              src={kitchenGrow}
              autoPlay
              loop
              muted
              playsInline
              className="story-video"
            ></video>
          </div>
          <div className="story-text">
            <h2>Growing With Purpose</h2>
            <p>
              As more people connected with our food, we grew — not just in size, but in dedication and purpose. With every new guest and every returning smile, our commitment deepened to deliver flavors that feel familiar yet exciting. We embraced modern techniques, refined our recipes, and elevated every detail of the dining experience, while carefully preserving the soul of what makes our food special.
            </p>
            <p>
              Innovation became a way to enhance, not replace, tradition. By thoughtfully blending time-honored cooking methods with contemporary ideas, we discovered new ways to surprise and delight our guests. From improved presentation to thoughtfully curated menus, every change was driven by one goal — serving joy on every plate.
            </p>

            <p>
              Today, we proudly stand at the intersection of tradition and innovation. Each dish tells a story of where we come from and where we are headed, crafted to leave a lasting impression. For every guest who walks through our doors, we aim to create something truly unforgettable — a meal that lingers in memory, long after the table is cleared.
            </p>
          </div>
        </div>
      </section>

      {/* TODAY */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-text">
            <h2>Today, and Beyond</h2>
            <p>
              With the help of Graphura’s seamless restaurant automation, we’ve transformed the way we operate — serving faster, smarter, and more efficiently than ever before. From streamlined order management to smoother workflows, technology now supports every step behind the scenes, allowing our team to focus on what truly matters: creating exceptional food and meaningful guest experiences.
            </p>
            <p>
              What makes this transformation special is that we never lost the human touch that defines our kitchen. Automation helps us reduce delays, minimize errors, and respond better to our guests’ needs, while the warmth, care, and personal attention remain at the heart of everything we do. It’s the perfect balance of innovation and hospitality.
            </p>
            <p>
              Today, Graphura empowers us to deliver consistency, speed, and quality — without compromising the soul of our service. The result is a dining experience that feels effortless, welcoming, and memorable, every single time.
            </p>
          </div>
          <div className="story-image">
            <video
              src={kitchenVedio}
              autoPlay
              loop
              muted
              playsInline
              className="story-video"
            ></video>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="story-cta">
        <h2>Be Part of Our Journey</h2>
        <p>Every visit adds a new chapter. We can't wait to serve you.</p>
        <button className="cta-btn" onClick={handleRedirect}>
          Explore Menu
        </button>
      </section>
    </div>
  );
}
