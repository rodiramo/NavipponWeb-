import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();
  const [currentImage, setCurrentImage] = useState(0);
  const [nextImage, setNextImage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Background image auto-transition effect with improved crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImage(nextImage);
        setNextImage((nextImage + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 1000); // 1 second transition
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [nextImage]);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Simple search handler - we know the Search component passes { searchKeyword }
  const handleSearch = ({ searchKeyword }) => {
    console.log("Hero handleSearch called with keyword:", searchKeyword);

    if (searchKeyword && searchKeyword.trim()) {
      const searchUrl = `/experience?page=1&search=${encodeURIComponent(
        searchKeyword.trim()
      )}`;
      console.log("Hero navigating to:", searchUrl);
      navigate(searchUrl);
    } else {
      console.log("No valid search keyword in Hero");
    }
  };

  return (
    <Box
      className="h-screen relative overflow-hidden"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        // Add dark background to prevent white flash
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Background Image Slideshow with improved transitions */}
      {backgroundImages.map((image, index) => {
        const isCurrent = index === currentImage;
        const isNext = index === nextImage && isTransitioning;
        const isVisible = isCurrent || isNext;

        return (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%), url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "opacity 1s ease-in-out, transform 20s ease-out",
              opacity: isVisible ? 1 : 0,
              transform: isCurrent ? "scale(1.05)" : "scale(1)",
              filter: "brightness(0.8) contrast(1.1)",
              zIndex: isCurrent ? 1 : 0,
            }}
          />
        );
      })}

      {/* Dark overlay to ensure text readability during transitions */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)",
          zIndex: 1,
        }}
      />

      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 20% 30%, ${theme.palette.primary.main}15 0%, transparent 50%), 
                     radial-gradient(circle at 80% 70%, ${theme.palette.secondary.main}15 0%, transparent 50%)`,
          animation: "pulse 4s ease-in-out infinite alternate",
          zIndex: 1,
        }}
      />

      {/* Floating Cloud Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "120px",
          height: "80px",
          backgroundImage: `url(${nube})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
          animation: "float 6s ease-in-out infinite",
          zIndex: 1,
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: "120px",
          height: "80px",
          backgroundImage: `url(${nube})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
          animation: "float 6s ease-in-out infinite",
          zIndex: 1,
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />

      {/* Content Overlay */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 3, sm: 4, md: 6 },
          transform: isLoaded ? "translateY(0)" : "translateY(30px)",
          opacity: isLoaded ? 1 : 0,
          transition: "all 1s ease-out",
        }}
      >
        {/* Main Title */}
        <Typography
          variant="h1"
          sx={{
            background: `linear-gradient(135deg, white 0%, rgba(255,255,255,0.8) 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: {
              xs: "2.5rem",
              sm: "3.5rem",
              md: "4.5rem",
              lg: "5.5rem",
            },
            fontWeight: 800,
            lineHeight: 1.1,
            mb: 3,
            animation: "fadeInUp 1s ease-out 0.7s both",
            letterSpacing: "-0.02em",
          }}
        >
          Navega Japón
          <Box
            component="span"
            sx={{
              display: "block",
              background: `white`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: {
                xs: "2rem",
                sm: "2.8rem",
                md: "3.6rem",
                lg: "4.4rem",
              },
              fontWeight: 700,
              mt: 1,
            }}
          >
            a tu manera
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            padding: "0.5rem 1rem",
            borderRadius: "30px",
            fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
            fontWeight: 400,
            maxWidth: "600px",
            lineHeight: 1.6,
            animation: "fadeInUp 1s ease-out 0.9s both",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            backdropFilter: "blur(90px)",
            backgroundColor: "rgba(17, 1, 1, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "1rem",
            transition: "all 0.3s ease",
          }}
        >
          Encuentra experiencias únicas, crea itinerarios personalizados y vive
          la aventura perfecta
        </Typography>

        {/* Search Component Container */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
            alignItems: "center",
            animation: "fadeInUp 1s ease-out 1.1s both",
            "& > *": {
              backdropFilter: "blur(90px)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "30rem",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                transform: "translateY(-2px)",
              },
            },
          }}
        >
          {/* Search Component */}
          <Search onSearchKeyword={handleSearch} />
        </Box>
      </Box>

      {/* Scroll Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          animation: "bounce 2s ease-in-out infinite",
          "@keyframes bounce": {
            "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
            "50%": { transform: "translateX(-50%) translateY(-10px)" },
          },
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 40,
            border: "2px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            pt: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 8,
              backgroundColor: "white",
              borderRadius: "2px",
              animation: "scroll 2s ease-in-out infinite",
              "@keyframes scroll": {
                "0%": { transform: "translateY(0)", opacity: 1 },
                "100%": { transform: "translateY(16px)", opacity: 0 },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
