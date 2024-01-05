import React from "react";
import Header from "../components/header/Header";
import Hero from "../components/hero/Hero";

const UnAuthentictedHome = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <Hero />
    </div>
  );
};

export default UnAuthentictedHome;
