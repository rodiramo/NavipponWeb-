import React, { useState } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"; // Chat Icon
import ChatWithBot from "../pages/user/screens/chat/ChatWithBot"; // Import the chatbot component
import "../css/ChatBot.css";
import { useTheme } from "@mui/material"; // Import the theme context

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme(); // Get theme colors

  // Function to toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot-button"
        onClick={toggleChatbot} // Ensure function is passed correctly
        aria-label="Abrir Chat"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <IoChatbubbleEllipsesOutline size={30} />
      </button>

      {/* Chatbot Component - Pass onClose function correctly */}
      {isOpen && <ChatWithBot onClose={toggleChatbot} />}
    </div>
  );
};

export default ChatBot;
