import React from "react";
import "../../style/homePage/home.css";
import Feedback from "./Feedback";
import TodaysMenu from "./TodaysMenu";
import OurPassion from "./OurPassion";
import Hero from "./Hero";

const Home = () => {


  return (
    <>
      <Hero/>
      <OurPassion/>
      <TodaysMenu/>
      <Feedback/>
    </>
  );
};

export default Home;
