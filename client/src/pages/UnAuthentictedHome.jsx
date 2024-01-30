import React from "react";
import Header from "../components/header/Header";
import Hero from "../components/hero/Hero";
import Trending from "../components/trending/Trending";

const UnAuthentictedHome = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <Hero />
      <Trending />
    </div>
  );
};

export default UnAuthentictedHome;
