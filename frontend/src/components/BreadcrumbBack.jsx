// BreadcrumbBack.jsx
import { IconButton, Box, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../css/Items/ActivityDetail.css";

const BreadcrumbBack = ({ color }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: "auto", md: "7rem" }, // Auto on mobile, fixed on desktop
        bottom: { xs: "2rem", md: "auto" }, // Bottom positioning on mobile
        left: { xs: 16, md: 16 },
        opacity: "0.95",
        zIndex: 10,
        backgroundColor: {
          xs: "rgba(255, 255, 255, 0.15)", // More transparent on mobile
          sm: "rgba(255, 255, 255, 0.2)",
          md: palette.primary.main,
        },
        backdropFilter: {
          xs: "blur(20px)", // Strong blur on mobile
          sm: "blur(15px)",
          md: "blur(8px)",
        },
        WebkitBackdropFilter: {
          xs: "blur(20px)", // Safari support
          sm: "blur(15px)",
          md: "blur(8px)",
        },
        borderRadius: {
          xs: "20px", // More pill-shaped on mobile
          sm: "25px",
          md: "30px",
        },
        padding: {
          xs: "4px 8px", // Less padding, more width than height on mobile
          sm: "6px 10px",
          md: "8px",
        },
        border: {
          xs: `1.5px solid ${palette.primary.main}`, // Subtle border on mobile
          md: `1.5px solid ${palette.primary.main}`,
        },
        boxShadow: {
          xs: "0 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow on mobile
          md: "0 2px 8px rgba(0, 0, 0, 0.15)",
        },
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: { xs: "scale(1.05)", md: "scale(1.02)" },
          backgroundColor: {
            xs: "rgba(255, 255, 255, 0.25)",
            md: palette.primary.dark,
          },
        },
      }}
    >
      <IconButton
        sx={{
          color: color || {
            xs: palette.text.primary, // Dark text on mobile for better contrast
            md: palette.primary.contrastText,
          },
          padding: {
            xs: "6px", // Smaller padding on mobile
            sm: "8px",
            md: "8px",
          },
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
        onClick={() => navigate(-1)}
        aria-label="go back"
      >
        <ArrowBackIcon
          sx={{
            fontSize: {
              xs: "20px", // Smaller icon on mobile
              sm: "22px",
              md: "24px",
            },
          }}
        />
      </IconButton>
    </Box>
  );
};

BreadcrumbBack.propTypes = {
  color: PropTypes.string,
};

BreadcrumbBack.defaultProps = {
  color: "",
};

export default BreadcrumbBack;
