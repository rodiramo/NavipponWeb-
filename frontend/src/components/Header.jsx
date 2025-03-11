import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import {
  Bolt,
  Shield,
  Plane,
  LogOut,
  UserRound,
  Moon,
  Sun,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import { images, stables } from "../constants";
import useUser from "../hooks/useUser";
import { toggleMode } from "../themeSlice";

const navItemsInfo = [
  { name: "Inicio", href: "/" },
  { name: "Explora", href: "/experience" },
  { name: "Blog", href: "/blog" },
  { name: "Nosotros", href: "/about" },
  { name: "Contacto", href: "/contacto" },
];

const NavItem = ({ item, theme, location }) => (
  <li className="relative group">
    <Link
      to={item.href}
      className="px-4 py-2 font-medium transition-colors duration-300"
      style={{
        color:
          location.pathname === item.href
            ? theme.palette.primary.main
            : "white",
      }}
    >
      {item.name}
    </Link>
  </li>
);

const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const { user, logout } = useUser();

  const [profileAnchor, setProfileAnchor] = useState(null);
  const [navIsVisible, setNavIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 1023px)").matches
  );
  const profileRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
      if (!isMobile) setNavIsVisible(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileAnchor(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="w-full fixed top-0 z-50">
      <header
        className="w-full px-5 py-4 flex items-center justify-between"
        style={{
          zIndex: 9999,
          backgroundColor: "rgb(10 23 51 / 81%)",
          color: "white",
          backdropFilter: "blur(10px) saturate(180%)",
          WebkitBackdropFilter: "blur(10px) saturate(180%)",
          borderRadius: "0 0 1rem 1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={mode === "dark" ? images.LogoWhite : images.LogoWhite}
            alt="Logo"
            className="h-16"
          />
          <h1 className="font-bold pl-2 text-xl md:text-2xl text-white">
            Navippon
          </h1>
        </Link>

        {/* Navigation (Hidden below 1000px, Visible at 1000px+) */}
        {/* Navigation (Hidden below 1024px, visible at 1024px and above) */}
        <nav className="hidden lg:flex flex-grow justify-center">
          <ul className="flex gap-6">
            {navItemsInfo.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                theme={theme}
                location={location}
              />
            ))}
          </ul>
        </nav>

        {/* Right-Side Controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <IconButton onClick={() => dispatch(toggleMode())}>
            {mode === "dark" ? (
              <Sun size={24} color="white" />
            ) : (
              <Moon size={24} color="white" />
            )}
          </IconButton>

          {/* User Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
                <img
                  src={
                    user.avatar
                      ? `${stables.UPLOAD_FOLDER_BASE_URL}${user.avatar}`
                      : images.DefaultAvatar
                  }
                  alt="Profile"
                  className="rounded-full object-cover"
                  style={{
                    width: "45px",
                    height: "45px",
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
                sx={{ mt: 1, minWidth: "160px" }}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: "rgb(10 23 51 / 81%)",
                      color: "white",
                      backdropFilter: "blur(10px) saturate(180%)",
                      WebkitBackdropFilter: "blur(10px) saturate(180%)",
                      borderRadius: "0 0 1rem 1rem",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                  },
                }}
              >
                {user.admin && (
                  <MenuItem component={Link} to="/admin">
                    <Shield
                      className="mr-3"
                      color={theme.palette.primary.main}
                    />{" "}
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem component={Link} to="/user/profile">
                  <UserRound
                    className="mr-3"
                    color={theme.palette.primary.main}
                  />{" "}
                  Mi Perfil
                </MenuItem>{" "}
                <MenuItem component={Link} to="/user/dashboard">
                  <Bolt className="mr-3" color={theme.palette.primary.main} />{" "}
                  Dashboard
                </MenuItem>
                <MenuItem component={Link} to="/user/itineraries/manage">
                  <Plane className="mr-3" color={theme.palette.primary.main} />{" "}
                  Mis Viajes
                </MenuItem>
                <MenuItem onClick={logout}>
                  <LogOut className="mr-3" color={theme.palette.primary.main} />{" "}
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: theme.palette.primary.light,
                borderRadius: "30rem",
                textTransform: "none",
                padding: "0.5rem 1rem",
                "&:hover": {
                  backgroundColor: "rgba(45, 67, 120, 0.5)",
                  color: theme.palette.primary.white,
                  borderRadius: "30rem",
                },
              }}
            >
              Ingresar
            </Button>
          )}

          {/* Burger Menu (Mobile Only) */}
          {isMobile && (
            <IconButton onClick={() => setNavIsVisible((prev) => !prev)}>
              {navIsVisible ? (
                <AiOutlineClose size={24} color="white" />
              ) : (
                <AiOutlineMenu size={24} color="white" />
              )}
            </IconButton>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobile && navIsVisible && (
        <nav
          className="absolute top-15 left-0 w-full  p-6"
          style={{
            backgroundColor: "rgb(10 23 51 / 81%)",
            color: "white",
            backdropFilter: "blur(10px) saturate(180%)",
            WebkitBackdropFilter: "blur(10px) saturate(180%)",
            borderRadius: "0 0 1rem 1rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ul className="flex flex-col gap-4 text-white text-center">
            {navItemsInfo.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                theme={theme}
                location={location}
              />
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
};

export default Header;
