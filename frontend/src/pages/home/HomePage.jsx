import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import {
  OnboardingGuide,
  QuickStartCard,
} from "../../components/OnboardingGuide.jsx";

const HomePage = () => {
  const { user, jwt: token } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  console.log("HomePage - user:", user);
  console.log("HomePage - token:", token);
  console.log("HomePage - location state:", location.state);

  // Check for first-time login guide from navigation state
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

  const handleStartItinerary = () => {
    if (user) {
      navigate("/user/itineraries/manage/create");
    } else {
      // Show login modal or redirect to login
      navigate("/login?redirect=/user/itineraries/manage/create");
    }
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    // Mark onboarding as completed
    localStorage.setItem("onboardingCompleted", "true");
  };

  return (
    <MainLayout>
      <Hero />
      <BgShape />

      {/* Add Quick Start Card after Hero for logged-in users */}
      {user && (
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
        >
          <QuickStartCard onStartItinerary={handleStartItinerary} />
        </div>
      )}

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

      {/* Help Modal (reuse OnboardingGuide or create separate help modal) */}
      <OnboardingGuide
        open={showHelp}
        onClose={() => setShowHelp(false)}
        user={user}
      />
    </MainLayout>
  );
};

export default HomePage;
