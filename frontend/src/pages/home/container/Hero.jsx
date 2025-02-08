import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Search from "../../../components/Search";
import nube from "../../../assets/nube.png";

// Background images array
const backgroundImages = [
  "/assets/bg-home1.jpg",
  "/assets/bg-home2.jpg",
  "/assets/bg-home3.jpg",
  "/assets/bg-home4.jpg",
  "/assets/bg-home5.jpg",
];

const Hero = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  // Background image auto-transition effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        setFade(true);
      }, 500);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = ({ searchKeyword }) => {
    navigate(`/experience?search=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <Box
      className="h-screen"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image Transition */}
      {backgroundImages.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1s ease-in-out",
            opacity: index === currentImage && fade ? 1 : 0,
          }}
        />
      ))}

      {/* Content Overlay */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{ color: "white", fontWeight: "bold", mb: 2 }}
        >
          Navega Japón a Tu Manera
        </Typography>

        <Search onSearchKeyword={handleSearch} />
      </Box>
    </Box>
  );
};

export default Hero;
