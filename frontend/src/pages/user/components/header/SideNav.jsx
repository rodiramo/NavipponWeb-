import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LucideHome,
  LucideUser,
  LucideClipboardList,
  LucideCalendarDays,
  LucideStar,
  Bell,
  LucideLogOut,
  LucideArrowLeft,
  MessagesSquare,
  LucideArrowRight,
} from "lucide-react";
import { useTheme } from "@mui/material";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import useUser from "../../../../hooks/useUser";
import { stables, images } from "../../../../constants";

const SideNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const theme = useTheme();
  const { user, logout } = useUser();

  return (
    <Box
      sx={{
        width: isMenuOpen ? "250px" : "70px",
        height: "100vh",
        backdropFilter: "blur(10px)",
        backgroundColor: theme.palette.primary.white,
        borderRadius: "20px",
        border: "1px solid rgba(104, 185, 220, 0.42)",
        transition: "width 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Toggle Button */}
      <Box sx={{ alignSelf: "flex-end", marginBottom: "10px" }}>
        <IconButton
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          sx={{
            background: theme.palette.primary.main,
            color: theme.palette.primary.white,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
        >
          {isMenuOpen ? (
            <LucideArrowLeft size={20} />
          ) : (
            <LucideArrowRight size={20} />
          )}
        </IconButton>
      </Box>

      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: isMenuOpen ? "row" : "column",
          gap: "10px",
        }}
      >
        <img
          src={
            user?.avatar
              ? stables.UPLOAD_FOLDER_BASE_URL + user?.avatar
              : images.userImage
          }
          alt="Profile"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        {isMenuOpen && (
          <Box>
            <Typography variant="h6" sx={{}}>
              {user?.name || "Usuario"}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px" }}>
              {user?.admin ? "Admin" : "Usuario"}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider
        sx={{ margin: "1rem 0", width: "80%", backgroundColor: "white" }}
      />

      {/* Menu Items */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <NavItem
          title="Dashboard"
          link="/user/dashboard"
          icon={<LucideHome size={22} color={theme.palette.primary.main} />}
          isMenuOpen={isMenuOpen}
        />
        <NavItem
          title="Mi Perfil"
          link="/user/profile"
          icon={<LucideUser size={22} color={theme.palette.primary.main} />}
          isMenuOpen={isMenuOpen}
        />{" "}
        <NavItem
          title="Notificaciones"
          link="/user/notifications"
          icon={<Bell size={22} color={theme.palette.primary.main} />}
          isMenuOpen={isMenuOpen}
        />
        <NavItem
          title="Mis Publicaciónes"
          link="/user/posts/manage"
          icon={
            <LucideClipboardList size={22} color={theme.palette.primary.main} />
          }
          isMenuOpen={isMenuOpen}
        />
        <NavItem
          title="Mis Itinerarios"
          link="/user/itineraries/manage"
          icon={
            <LucideCalendarDays size={22} color={theme.palette.primary.main} />
          }
          isMenuOpen={isMenuOpen}
        />
        <NavItem
          title="Mis Favoritos"
          link="/user/favorites/manage"
          icon={<LucideStar size={22} color={theme.palette.primary.main} />}
          isMenuOpen={isMenuOpen}
        />{" "}
      </Box>

      <Divider
        sx={{ margin: "1rem 0", width: "80%", backgroundColor: "white" }}
      />
      <Button
        onClick={logout}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 15px",
          borderRadius: "10px",
          transition: "background 0.3s ease-in-out",
          width: "100%",
          justifyContent: isMenuOpen ? "flex-start" : "center",
          backgroundColor: "transparent",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        <LucideLogOut size={22} />
        {isMenuOpen && "Cerrar Sesión"}
      </Button>
    </Box>
  );
};

const NavItem = ({ title, link, icon, isMenuOpen }) => {
  return (
    <Tooltip title={!isMenuOpen ? title : ""} placement="right">
      <Link
        to={link}
        style={{
          textDecoration: "none",

          display: "flex",
          alignItems: "center",
          gap: "15px",
          padding: "10px",
          borderRadius: "10px",
          transition: "background 0.3s ease-in-out",
          width: "100%",
          justifyContent: isMenuOpen ? "flex-start" : "center",
        }}
      >
        {icon}
        {isMenuOpen && (
          <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
            {title}
          </Typography>
        )}
      </Link>
    </Tooltip>
  );
};

export default SideNav;
