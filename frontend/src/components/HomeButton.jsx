import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material";
import { FiHome } from "react-icons/fi";
const HomeButton = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Tooltip title="Volver a inicio">
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: 2,
          backgroundColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
          },
          color: "white",
        }}
      >
        <FiHome fontSize={30} />
      </IconButton>
    </Tooltip>
  );
};

export default HomeButton;
