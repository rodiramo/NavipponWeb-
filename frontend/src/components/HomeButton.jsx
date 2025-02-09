import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useTheme } from "@mui/material";
const HomeButton = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Tooltip title="Volver a inicio">
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          backgroundColor: theme.palette.primary.main,
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
          color: "white",
        }}
      >
        <HomeOutlinedIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default HomeButton;
