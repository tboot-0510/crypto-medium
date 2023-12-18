import React from "react";
import Header from "../components/header/Header";
import Hero from "../components/hero/Hero";
import { useSelector } from "react-redux";

const UnAuthentictedHome = () => {
  const { user } = useSelector((state) => ({
    user: state.user.informations.email,
  }));
  console.log("unat", user);
  return (
    <>
      <Header />
      <Hero />
    </>
  );
};

export default UnAuthentictedHome;
