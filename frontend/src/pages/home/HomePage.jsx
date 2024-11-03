import React from "react";

import MainLayout from "../../components/MainLayout";
import Articles from "./container/Articles";
import CTA from "./container/CTA";
import Hero from "./container/Hero";
import InfoPill from './container/InfoPill';
import CategoryCarousel from './container/CategoryCarrusel';

const HomePage = () => {
  return (
    <MainLayout>
      <Hero />
      <InfoPill />
      <CategoryCarousel />
      <CTA />
      <Articles />
 
    </MainLayout>
  );
};

export default HomePage;
