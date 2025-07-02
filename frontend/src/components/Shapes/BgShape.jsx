import { useTheme, useMediaQuery } from "@mui/material";
import "../../css/HomePage/Home.css";

const BgShape = () => {
  const { palette } = useTheme();
  const theme = useTheme();

  // Responsive breakpoints
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 960px
  const isTablet = useMediaQuery(theme.breakpoints.down("lg")); // < 1280px

  // Dynamic height based on screen size
  const getResponsiveHeight = () => {
    if (isSmallMobile) return "25px"; // Very small screens
    if (isMobile) return "35px"; // Mobile screens
    if (isTablet) return "40px"; // Tablet screens
    return "50px"; // Desktop screens
  };

  const height = getResponsiveHeight();

  return (
    <div
      className="bg-shape"
      style={{
        background: palette.background.default,
        position: "relative",
        zIndex: 1,
        height: height,
        width: "100%",
        marginTop: `-${height}`, // Negative margin matches height
        transition: "height 0.3s ease", // Smooth transition on resize
      }}
    />
  );
};

export default BgShape;
