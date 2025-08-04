import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BgShape from "../../components/Shapes/BgShape.jsx";
import MainLayout from "../../components/MainLayout";
import Articles from "./container/Articles";
import CTA from "./container/CTA";
import Hero from "./container/Hero";
import InfoPill from "./container/InfoPill";
import CategoryCard from "./container/CategoryCard";
import RegionCarousel from "./container/RegionCarousel";
import Experiences from "./container/Experiences";
import useUser from "../../hooks/useUser";
import { OnboardingGuide } from "../../components/OnboardingGuide.jsx";

const HomePage = () => {
  const { user } = useUser();

  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (location.state?.showGuide) {
      console.log("🟢 First-time login detected, showing guide");
      setShowOnboarding(true);

      // Clear the navigation state to prevent guide from showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Check if user is new or hasn't seen onboarding (existing logic)
  useEffect(() => {
    if (user && !localStorage.getItem("onboardingCompleted")) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        console.log("🟢 User hasn't seen onboarding, showing guide");
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    // Mark onboarding as completed
    localStorage.setItem("onboardingCompleted", "true");
  };

  return (
    <MainLayout>
      <Hero />
      <BgShape />

      <InfoPill />

      <CTA />
      <CategoryCard />
      <RegionCarousel />
      <Experiences />
      <Articles />

      {/* Onboarding Guide Modal */}
      <OnboardingGuide
        open={showOnboarding}
        onClose={handleOnboardingClose}
        user={user}
      />

      <OnboardingGuide
        open={showHelp}
        onClose={() => setShowHelp(false)}
        user={user}
      />
    </MainLayout>
  );
};

export default HomePage;
