import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { MdFavoriteBorder, MdOutlineAdminPanelSettings } from "react-icons/md";
import { BiTrip } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsSun, BsMoon } from "react-icons/bs"; // Import sun and moon icons
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

  const [profileAnchor, setProfileAnchor] = useState(null);
  const { user, logout } = useUser();
  const [navIsVisible, setNavIsVisible] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  const navVisibilityHandler = () => setNavIsVisible((prev) => !prev);
  const logoutHandler = () => logout();

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="w-full" style={{ position: "fixed", zIndex: 1000 }}>
      <header
        className="w-full px-5 py-8 flex flex-col md:flex-row justify-between items-center"
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <div
          className="flex items-center mb-4 md:mb-0 w-full"
          style={{
            justifyContent: "space-between",
          }}
        >
          <Link to="/" className="flex items-center">
            <img
              src={mode === "dark" ? images.LogoWhite : images.LogoBlack}
              alt="Logo"
              className="h-20"
            />
            <h1 className="font-bold pl-2" style={{ fontSize: "1.75rem" }}>
              Navippon
            </h1>
          </Link>{" "}
          <div style={{ display: "flex", alignItems: "center" }}>
            {user ? (
              <div className=" items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold z-50">
                <div className="relative group" ref={profileRef}>
                  <div className="flex flex-col items-center">
                    <IconButton
                      onClick={(e) => setProfileAnchor(e.currentTarget)}
                    >
                      {user.avatar ? (
                        <img
                          src={
                            user.avatar
                              ? `${stables.UPLOAD_FOLDER_BASE_URL}${user.avatar}`
                              : images.DefaultAvatar
                          }
                          alt="Profile"
                          className=" rounded-full object-cover"
                          style={{
                            width: "60px",
                            height: "60px",
                            border: `1px solid ${theme.palette.primary.main}`,
                          }}
                        />
                      ) : (
                        <FaRegUserCircle className="text-3xl" />
                      )}
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
                        Panel de Usuario
                      </MenuItem>
                      <MenuItem onClick={logoutHandler}>
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
                </div>
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
            <div className="lg:hidden z-50 ml-4">
              {navIsVisible ? (
                <AiOutlineClose
                  className="w-6 h-6"
                  onClick={navVisibilityHandler}
                />
              ) : (
                <AiOutlineMenu
                  className="w-6 h-6"
                  onClick={navVisibilityHandler}
                />
              )}
            </div>
          </div>
        </div>
        <div
          className={`md:flex flex-col md:flex-row gap-x-5 mt-8 md:mt-0 md:w-3/4 ${
            navIsVisible ? "block" : "hidden"
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
          <IconButton onClick={() => dispatch(toggleMode())}>
            {mode === "dark" ? <BsSun size={24} /> : <BsMoon size={24} />}
          </IconButton>
        </div>
      </header>
    </section>
  );
};

export default Header;
