import React from "react";
import { Box, Typography, Chip, useTheme, useMediaQuery } from "@mui/material";
import { Image, Eye } from "lucide-react";
import "../../../css/Items/ActivityDetail.css";

// Responsive Sample Image Indicator Component
const SampleImageIndicator = ({
  imageUrl,
  imageAlt,
  isDefaultImage = false,
  category = "",
  indicatorType = "watermark", // "corner", "watermark", "overlay"
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  // Responsive Corner Badge Indicator
  const CornerIndicator = () => (
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? "60px" : "16px",
        right: isMobile ? "12px" : "16px",
        zIndex: 2,
      }}
    >
      <Chip
        icon={<Image size={isMobile ? 12 : 14} />}
        label="Imagen de muestra"
        size="small"
        sx={{
          backgroundColor: theme.palette.secondary.medium,
          color: "white",
          fontSize: isMobile ? "0.65rem" : "0.7rem",
          fontWeight: 600,
          height: isMobile ? "22px" : "26px",
          "& .MuiChip-icon": {
            color: "white",
          },
          "& .MuiChip-label": {
            paddingX: isMobile ? 0.75 : 1,
          },
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );

  // Responsive Watermark Style Indicator (Good for hero images)
  const WatermarkIndicator = () => (
    <div
      style={{
        position: "absolute",
        background: theme.palette.secondary.medium,
        borderRadius: isMobile ? "20px" : "30px",
        bottom: "70px",
        left: "100px",
        padding: isMobile ? "6px 10px" : "8px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "flex-start",
        gap: isMobile ? "6px" : "8px",
        backdropFilter: "blur(4px)",
        zIndex: 2,
        maxWidth: isMobile ? "none" : "300px",
      }}
    >
      <Eye size={isMobile ? 14 : 16} color={theme.palette.primary.white} />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          fontSize: isMobile ? "0.7rem" : "0.8rem",
          textAlign: isMobile ? "center" : "left",
          color: "white",
        }}
      >
        {isMobile ? "Imagen de muestra" : `Imagen de muestra - ${category}`}
      </Typography>
    </div>
  );

  // Responsive Overlay Style Indicator (Most prominent)
  const OverlayIndicator = () => (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        width: isMobile ? "90%" : "auto",
        maxWidth: isMobile ? "280px" : "none",
      }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: isMobile ? "8px" : "12px",
          padding: isMobile ? "12px 16px" : "16px 20px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: isMobile ? 1 : 1.5,
          border: `1px solid ${theme.palette.warning.main}40`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <Image size={isMobile ? 18 : 20} color={theme.palette.warning.main} />
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.warning.main,
            fontWeight: 600,
            fontSize: isMobile ? "0.8rem" : "0.9rem",
            lineHeight: 1.2,
          }}
        >
          {isMobile ? "Imagen de muestra" : "Esta es una imagen de muestra"}
        </Typography>
      </Box>
    </div>
  );

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="cover-image"
        style={{
          ...(isDefaultImage && {
            filter: "brightness(0.95)", // Slightly dim default images
          }),
        }}
      />

      {/* Show indicator only for default images */}
      {isDefaultImage && (
        <>
          {indicatorType === "corner" && <CornerIndicator />}
          {indicatorType === "watermark" && <WatermarkIndicator />}
          {indicatorType === "overlay" && <OverlayIndicator />}
        </>
      )}
    </div>
  );
};

// Responsive Hero Component
const Hero = ({
  imageUrl,
  imageAlt,
  isDefaultImage = false,
  category = "",
  indicatorType = "watermark",
}) => {
  return (
    <SampleImageIndicator
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      isDefaultImage={isDefaultImage}
      category={category}
      indicatorType={indicatorType}
    />
  );
};

// CSS styles for responsive image
const responsiveStyles = `
  /* Responsive cover image styles */
  .cover-image {
    width: 100%;
    height: auto;
    min-height: 500px;
    object-fit: cover;
    object-position: center;
  }

  /* Mobile specific adjustments */
  @media (max-width: 768px) {
    .cover-image {
     min-height: 50vh;
      max-height: 70vh;
    }
  }

  /* Tablet specific adjustments */
  @media (min-width: 769px) and (max-width: 1024px) {
    .cover-image {
      min-height: 50vh;
      max-height: 70vh;
    }
  }

  /* Desktop specific adjustments */
  @media (min-width: 1025px) {
    .cover-image {
      min-height: 50vh;
      max-height: 70vh;
    }
  }
`;

// Inject styles (only in browser environment)
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = responsiveStyles;
  document.head.appendChild(styleSheet);
}

export default Hero;
