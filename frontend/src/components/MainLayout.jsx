import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ChatBot from "../components/ChatBot";
import { OnboardingGuide } from "../components/OnboardingGuide";
import useUser from "../hooks/useUser"; // Add this import

const MainLayout = ({ children }) => {
  const [showGuide, setShowGuide] = useState(false);
  const { user } = useUser(); // Get user from your auth hook

  return (
    <div>
      <Header />
      {children}
      <ChatBot /> {/* Floating Chatbot Button */}
      <Footer onShowGuide={() => setShowGuide(true)} />
      {/* Guide Modal */}
      <OnboardingGuide
        open={showGuide}
        onClose={() => setShowGuide(false)}
        user={user}
      />
    </div>
  );
};

export default MainLayout;
