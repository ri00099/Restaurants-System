import React, { useEffect, useRef } from "react";
import "../../style/homePage/Feedback.css";

const feedbacks = [
  { text: "Amazing food! The butter chicken was out of this world!", author: "Rohan S." },
  { text: "Super fast delivery and packaging was perfect.", author: "Priya M." },
  { text: "Loved the ambience — perfect spot for family dinners!", author: "Aman K." },
  { text: "Pizza was fresh, cheesy and delicious!", author: "Neha G." },
  { text: "Affordable and tasty. Great overall experience.", author: "Varun P." },
  { text: "Brownie dessert was heavenly!", author: "Kavya R." },
  { text: "Friendly staff and great service.", author: "Mehul T." },
  { text: "One of the best restaurants in the area.", author: "Sneha L." },
  { text: "Fresh ingredients and balanced flavors.", author: "Akash B." },
  { text: "Loved the biryani — perfect spice levels!", author: "Sara K." },
];

export default function CustomerFeedback() {
  const trackRef = useRef(null);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.innerHTML += trackRef.current.innerHTML; // duplicate for infinite loop
    }
  }, []);

  return (
    <section className="cf-wrapper">
      <h2 className="cf-title">What People Are Saying</h2>

      <div className="cf-slider">
        <div className="cf-track" ref={trackRef}>
          {feedbacks.map((f, index) => (
            <div className="cf-card" key={index}>
              <p className="cf-text">“{f.text}”</p>
              <p className="cf-author">– {f.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}