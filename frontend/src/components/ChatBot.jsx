import React, { useState } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import ChatWithBot from "../pages/user/screens/chat/ChatWithBot";
import "../css/ChatBot.css";
import { useTheme } from "@mui/material";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot-button"
        onClick={toggleChatbot}
        aria-label="Abrir Chat"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <IoChatbubbleEllipsesOutline size={30} />
      </button>

      {isOpen && <ChatWithBot onClose={toggleChatbot} />}
    </div>
  );
};

export default ChatBot;
