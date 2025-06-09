import React from "react";
import { NavLink } from "react-router-dom";
import { Box, useTheme } from "@mui/material";

const NavItem = ({
  link,
  title,
  icon,
  name,
  activeNavName,
  setActiveNavName,
  isMenuOpen,
}) => {
  const theme = useTheme();
  const isActive = name === activeNavName;

  return (
    <NavLink
      to={link}
      className="flex items-center gap-x-2 py-2 px-3 rounded-md transition-all duration-300"
      onClick={() => setActiveNavName(name)}
      style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: isActive ? theme.palette.primary.main : "white",
        backgroundColor:
          isActive && isMenuOpen ? "rgba(97, 97, 177, 0.5)" : "transparent",
        borderRadius: "8px",

        padding: "10px",
      }}
    >
      {/* ✅ Icon with active color */}
      <Box
        component="span"
        sx={{
          color: isActive ? theme.palette.primary.main : "white",
          transition: "color 0.3s ease-in-out",
          "&:hover": {
            color: theme.palette.primary.main,
          },
        }}
      >
        {icon}
      </Box>

      {/* ✅ Show text only if menu is open */}
      {isMenuOpen && (
        <Box
          component="span"
          sx={{
            "&:hover": {
              color: theme.palette.primary.main,
            },
            color: isActive ? "white" : "inherit",
            fontWeight: isActive ? "bold" : "normal",
            transition: "color 0.3s ease-in-out",
          }}
        >
          {title}
        </Box>
      )}
    </NavLink>
  );
};

export default NavItem;
