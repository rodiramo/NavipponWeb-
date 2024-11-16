import React, { useState } from "react";

import MainLayout from "../../components/MainLayout";
import Articles from "./container/Articles";
import CTA from "./container/CTA";
import Hero from "./container/Hero";
import InfoPill from './container/InfoPill';
import CategoryCarousel from './container/CategoryCarrusel';
import Experiences from "./container/Experiences";
import useUser from "../../hooks/useUser";  

const HomePage = () => {
  const { user, jwt: token } = useUser(); 
  const [reload, setReload] = useState(false); 

  console.log("HomePage - user:", user);
  console.log("HomePage - token:", token);

  const handleReload = () => {
    setReload(!reload);  
  };

  return (
    <MainLayout>
      <Hero />
      <InfoPill />
      <CategoryCarousel />
      <CTA />
      <Experiences user={user} token={token} onFavoriteToggle={handleReload} />  
      <Articles />
    </MainLayout>
  );
};

export default HomePage;