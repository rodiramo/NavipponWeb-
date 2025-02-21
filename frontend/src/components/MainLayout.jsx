import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import ChatBot from "../components/ChatBot";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <ChatBot /> {/* Floating Chatbot Button */}
      <Footer />
    </div>
  );
};

export default MainLayout;
