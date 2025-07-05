import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LucideHome,
  LucideUser,
  LucideClipboardList,
  LucideCalendarDays,
  Bell,
  LucideStar,
} from "lucide-react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // screens smaller than 600px

  const navigationItems = [
    {
      label: "Inicio",
      shortLabel: "Home",
      icon: <LucideHome size={20} />,
      path: "/user/dashboard",
    },
    {
      label: "Posts",
      shortLabel: "Posts",
      icon: <LucideClipboardList size={20} />,
      path: "/user/posts/manage",
    },
    {
      label: "Notificaciones",
      shortLabel: "Notifs",
      icon: <Bell size={20} />,
      path: "/user/notifications",
    },
    {
      label: "Itinerarios",
      shortLabel: "Viajes",
      icon: <LucideCalendarDays size={20} />,
      path: "/user/itineraries/manage",
    },
    {
      label: "Favoritos",
      shortLabel: "Favs",
      icon: <LucideStar size={20} />,
      path: "/user/favorites/manage",
    },
    {
      label: "Perfil",
      shortLabel: "Perfil",
      icon: <LucideUser size={20} />,
      path: "/user/profile",
    },
  ];

  // Find the current active navigation item
  const getCurrentValue = () => {
    const currentItem = navigationItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
    );
    return currentItem ? navigationItems.indexOf(currentItem) : 0;
  };

  const handleChange = (event, newValue) => {
    navigate(navigationItems[newValue].path);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        borderRadius: "20px 20px 0 0",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels={!isSmallScreen} // Hide labels on small screens
        sx={{
          height: isSmallScreen ? "60px" : "70px", // Reduce height on small screens
          backgroundColor: "transparent",
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            padding: isSmallScreen ? "4px 8px" : "8px 12px",
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
              color: theme.palette.primary.main,
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
              fontWeight: 600,
              marginTop: isSmallScreen ? "2px" : "4px",
              "&.Mui-selected": {
                fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
              },
            },
          },
        }}
      >
        {navigationItems.map((item, index) => {
          // Show tooltip on small screens for better UX
          if (isSmallScreen) {
            return (
              <Tooltip
                key={index}
                title={item.label}
                placement="top"
                arrow
                sx={{
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: theme.palette.grey[800],
                    color: theme.palette.common.white,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  },
                  "& .MuiTooltip-arrow": {
                    color: theme.palette.grey[800],
                  },
                }}
              >
                <BottomNavigationAction
                  label={item.shortLabel}
                  icon={item.icon}
                />
              </Tooltip>
            );
          }

          // Regular navigation action for larger screens
          return (
            <BottomNavigationAction
              key={index}
              label={item.label}
              icon={item.icon}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNav;
