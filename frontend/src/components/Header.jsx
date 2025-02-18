import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaRegUserCircle, FaRegUser } from "react-icons/fa";
import { MdFavoriteBorder, MdOutlineAdminPanelSettings } from "react-icons/md";
import { BiTrip } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { BsSun, BsMoon } from "react-icons/bs"; // Theme toggle icons
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { images, stables } from "../constants";
import useUser from "../hooks/useUser";
import { toggleMode } from "../themeSlice";

const navItemsInfo = [
  { name: "Inicio", type: "link", href: "/" },
  { name: "Nosotros", type: "link", href: "/about" },
  { name: "Explora", type: "link", href: "/experience" },
  { name: "Blog", type: "link", href: "/blog" },
  { name: "Contacto", type: "link", href: "/contacto" },
];

const NavItem = ({ item, theme, location }) => {
  return (
    <li className="relative group mb-3">
      <Link
        to={item.href}
        className="px-4 py-2"
        style={{
          color:
            location.pathname === item.href
              ? theme.palette.primary.main
              : theme.palette.text.primary,
        }}
      >
        {item.name}
      </Link>
    </li>
  );
};

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
    window.matchMedia("(max-width: 800px)").matches
  );
  const profileRef = useRef(null);

  // Toggle burger menu
  const toggleNav = () => setNavIsVisible((prev) => !prev);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.matchMedia("(max-width: 800px)").matches;
      setIsMobile(isNowMobile);
      if (!isNowMobile) {
        setNavIsVisible(false); // Close menu when resizing above 800px
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when clicking outside
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
    <section className="w-full" style={{ position: "fixed", zIndex: 1000 }}>
      <header
        className="w-full px-5 py-4 flex flex-col md:flex-row justify-between items-center"
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
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={mode === "dark" ? images.LogoWhite : images.LogoBlack}
              alt="Logo"
              className="h-16"
            />
            <h1 className="font-bold pl-2" style={{ fontSize: "1.75rem" }}>
              Navippon
            </h1>
          </Link>

          {/* User Profile, Theme Toggle, & Burger Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Theme Toggle Button */}
            <IconButton onClick={() => dispatch(toggleMode())}>
              {mode === "dark" ? <BsSun size={24} /> : <BsMoon size={24} />}
            </IconButton>

            {/* User Profile */}
            {user ? (
              <div className="flex items-center">
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
                      width: "50px",
                      height: "50px",
                      border: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                </IconButton>
                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={() => setProfileAnchor(null)}
                  PaperProps={{
                    sx: {
                      bgcolor: "white",
                      borderRadius: "0.5rem",
                      boxShadow: theme.shadows[5],
                      mt: 1,
                      minWidth: "150px",
                    },
                  }}
                >
                  {user.admin && (
                    <MenuItem component={Link} to="/admin">
                      <MdOutlineAdminPanelSettings
                        style={{
                          marginRight: "1rem",
                          color: theme.palette.primary.main,
                        }}
                      />
                      <Typography>Admin Panel</Typography>
                    </MenuItem>
                  )}
                  <MenuItem component={Link} to={`/profile`}>
                    <FaRegUser
                      style={{
                        marginRight: "1rem",
                        color: theme.palette.primary.main,
                      }}
                    />
                    <Typography>Mi Perfil</Typography>
                  </MenuItem>
                  <MenuItem component={Link} to="/trips">
                    <BiTrip
                      style={{
                        marginRight: "1rem",
                        color: theme.palette.primary.main,
                      }}
                    />
                    <Typography>Mis Viajes</Typography>
                  </MenuItem>
                  <MenuItem component={Link} to="/user">
                    <ManageAccountsOutlinedIcon
                      style={{
                        marginRight: "1rem",
                        color: theme.palette.primary.main,
                      }}
                    />
                    <Typography>Panel de Usuario</Typography>
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <RiLogoutBoxLine
                      style={{
                        marginRight: "1rem",
                        color: theme.palette.primary.main,
                      }}
                    />
                    <Typography>Cerrar Sesión</Typography>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 rounded-full"
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.white,
                }}
              >
                Ingresar
              </button>
            )}

            {/* Burger Menu Button */}
            {isMobile && (
              <IconButton onClick={toggleNav}>
                {navIsVisible ? (
                  <AiOutlineClose size={24} />
                ) : (
                  <AiOutlineMenu size={24} />
                )}
              </IconButton>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div
          className={`mt-6 md:mt-0 md:flex gap-x-5 w-full ${
            isMobile
              ? navIsVisible
                ? "flex flex-col items-center"
                : "hidden"
              : "flex"
          }`}
        >
          <ul className="flex flex-col md:flex-row gap-x-5 items-center justify-center w-full">
            {navItemsInfo.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                theme={theme}
                location={location}
              />
            ))}
          </ul>
        </div>
      </header>
    </section>
  );
};

export default Header;
