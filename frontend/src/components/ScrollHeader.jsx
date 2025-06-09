import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Slide from "@mui/material/Slide";

const ScrollHeader = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  useEffect(() => {
    // When the header is hovered, keep it visible.
    if (isHeaderHovered) {
      setShowHeader(true);
    }
  }, [isHeaderHovered]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      // If the mouse is in the top 50px, show header.
      // Otherwise, hide it only if the header is not hovered.
      if (event.clientY < 50) {
        setShowHeader(true);
      } else if (!isHeaderHovered) {
        setShowHeader(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHeaderHovered]);

  return (
    <Slide
      direction="down"
      in={showHeader}
      mountOnEnter
      unmountOnExit
      TransitionProps={{
        timeout: { enter: 500, exit: 300 },
        easing: "ease-in-out",
      }}
    >
      <div
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <Header />
      </div>
    </Slide>
  );
};

export default ScrollHeader;
