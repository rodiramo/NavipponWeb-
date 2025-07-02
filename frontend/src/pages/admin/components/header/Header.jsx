import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import { images, stables } from "../../../../constants";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../../../../themeSlice";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import {
  SquareKanban,
  House,
  Compass,
  Newspaper,
  Star,
  UsersRound,
  CirclePlus,
  MessagesSquare,
  Upload,
  Sun,
  Moon,
} from "lucide-react";
import {
  useTheme,
  IconButton,
  Box,
  Divider,
  Typography,
  Tooltip,
} from "@mui/material";

import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useUser from "../../../../hooks/useUser";
import { createPost } from "../../../../services/index/posts";
import { createExperience } from "../../../../services/index/experiences";

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  const { user, jwt } = useUser();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const dispatch = useDispatch();

  // Get theme mode from Redux
  const themeMode = useSelector((state) => state.theme.mode);
  const isDarkMode = themeMode === "dark";

  const [activeNavName, setActiveNavName] = useState("dashboard");
  const windowSize = useWindowSize();

  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } =
    useMutation({
      mutationFn: ({ token }) => {
        return createPost({
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"]);
        toast.success("¡Publicación creada, edítala ahora!");
        navigate(`/admin/posts/manage/edit/${data.slug}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const {
    mutate: mutateCreateExperience,
    isLoading: isLoadingCreateExperience,
  } = useMutation({
    mutationFn: ({ newExperienceData, token }) => {
      return createExperience({
        experienceData: newExperienceData,
        token,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["experiences"]);
      toast.success("¡Experiencia creada con éxito!");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleCreateNewExperience = () => {
    if (!jwt) {
      toast.error("Debes estar logueado para crear una nueva experiencia");
      return;
    }
    navigate("/admin/experiences/manage/create");
  };

  const handleCreateNewPost = () => {
    if (jwt) {
      mutateCreatePost({ token: jwt });
    } else {
      toast.error("Debes estar logueado para crear una nueva publicación");
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleMode());
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Container */}
      <Box
        sx={{
          width: isMenuOpen ? 250 : 70,
          backgroundColor:
            theme.palette.background.nav || theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: "width 0.3s ease-in-out",
          height: "100vh", // ✅ Keep fixed height
          borderRadius: "0rem 2rem 2rem 0rem",

          position: "fixed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          boxShadow: theme.shadows[4],
          overflow: "hidden", // ✅ Important: hide overflow on main container
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0, // ✅ Prevent shrinking
            }}
          >
            <Link to="/">
              <img
                src={images.Logo}
                alt="Logo"
                style={{
                  width: isMenuOpen ? "70px" : "40px",
                  transition: "width 0.3s ease-in-out",
                  cursor: "pointer",
                }}
              />
            </Link>
          </Box>
          <Divider
            sx={{
              margin: { sm: "0.75rem", md: "1rem", lg: "1rem" },
              width: "100%",
            }}
          />

          {/* User Profile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 6,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isMenuOpen ? "flex-start" : "center",
                width: "100%",
              }}
            >
              {user?.avatar ? (
                <img
                  src={`${stables.UPLOAD_FOLDER_BASE_URL}${user.avatar}`}
                  alt="Profile"
                  style={{
                    width: isMenuOpen ? "60px" : "40px",
                    height: isMenuOpen ? "60px" : "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid ${theme.palette.primary.main}`,
                    transition: "all 0.3s ease",
                  }}
                />
              ) : (
                <FaUserCircle
                  style={{
                    width: isMenuOpen ? "60px" : "40px",
                    height: isMenuOpen ? "60px" : "40px",
                    color: theme.palette.primary.main,
                    transition: "all 0.3s ease",
                  }}
                />
              )}
              {isMenuOpen && (
                <Box sx={{ ml: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {user?.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                    }}
                  >
                    {user?.admin ? "Administrador" : "Usuario"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>{" "}
        <Box
          sx={{
            width: "100%",
            flex: 1, // ✅ Take remaining space
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // ✅ Hide overflow on container
            minHeight: 0, // ✅ Allow flex item to shrink below content size
          }}
        >
          <Box
            sx={{
              width: "100%",
              overflowY: "auto", // ✅ Enable scrolling
              overflowX: "hidden",
              flex: 1,
              paddingRight: "4px", // ✅ Space for scrollbar
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: `${theme.palette.primary.main}60`,
                borderRadius: "2px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Divider
              sx={{
                margin: { sm: "2rem", md: "4rem", lg: "1rem" },
                width: "100%",
              }}
            />

            {/* Navigation Items */}
            <Box>
              <Tooltip title={!isMenuOpen ? "Dashboard" : ""} placement="right">
                <span>
                  <NavItem
                    title="Dashboard"
                    link="/admin"
                    name="dashboard"
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                    icon={<SquareKanban size={24} />}
                    isMenuOpen={isMenuOpen}
                  />
                </span>
              </Tooltip>

              <Tooltip title={!isMenuOpen ? "Importar" : ""} placement="right">
                <span>
                  <NavItem
                    title="Importar"
                    link="/admin/import"
                    name="import"
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                    icon={<Upload size={24} />}
                    isMenuOpen={isMenuOpen}
                  />
                </span>
              </Tooltip>

              <Tooltip
                title={!isMenuOpen ? "Experiencias" : ""}
                placement="right"
              >
                <span>
                  <NavItem
                    title="Experiencias"
                    link="/admin/experiences/manage"
                    name="experiences"
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                    icon={<Compass size={24} />}
                    isMenuOpen={isMenuOpen}
                  />
                </span>
              </Tooltip>

              <Tooltip
                title={!isMenuOpen ? "Publicaciones" : ""}
                placement="right"
              >
                <span>
                  <NavItem
                    title="Publicaciones"
                    link="/admin/posts/manage"
                    name="posts"
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                    icon={<Newspaper size={24} />}
                    isMenuOpen={isMenuOpen}
                  />
                </span>
              </Tooltip>

              <Tooltip
                title={!isMenuOpen ? "Comentarios" : ""}
                placement="right"
              >
                <span>
                  <NavItem
                    title="Comentarios"
                    link="/admin/comments"
                    name="comments"
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                    icon={<MessagesSquare size={24} />}
                    isMenuOpen={isMenuOpen}
                  />
                </span>
              </Tooltip>

              <Tooltip title={!isMenuOpen ? "Reseñas" : ""} placement="right">
                <span>
                  <NavItem
                    title="Reseñas"
                    link="/admin/reviews"
                    name="reviews"
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                    icon={<Star size={24} />}
                    isMenuOpen={isMenuOpen}
                  />
                </span>
              </Tooltip>

              <Tooltip title={!isMenuOpen ? "Usuarios" : ""} placement="right">
                <span>
                  <NavItem
                    title="Usuarios"
                    link="/admin/users/manage"
                    name="users"
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                    icon={<UsersRound size={24} />}
                    isMenuOpen={isMenuOpen}
                  />
                </span>
              </Tooltip>
            </Box>
          </Box>{" "}
        </Box>
        {/* Footer Section */}
        <Box
          sx={{
            width: "100%",
            flexShrink: 0, // ✅ Prevent shrinking
            paddingTop: "1rem",
          }}
        >
          <Box sx={{ padding: "10px" }}>
            {isMenuOpen && (
              <Tooltip
                title={isDarkMode ? "Modo claro" : "Modo oscuro"}
                placement="left"
              >
                <IconButton
                  onClick={handleThemeToggle}
                  sx={{
                    background: `${theme.palette.primary.main}20`,
                    color: theme.palette.primary.main,
                    margin: "auto",
                    display: "block",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      transform: "rotate(180deg)",
                    },
                  }}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </IconButton>
              </Tooltip>
            )}{" "}
          </Box>{" "}
          {/* Compact Theme Toggle for Collapsed Menu */}
          {!isMenuOpen && (
            <Tooltip
              title={isDarkMode ? "Modo claro" : "Modo oscuro"}
              placement="right"
            >
              <IconButton
                onClick={handleThemeToggle}
                sx={{
                  background: `${theme.palette.primary.main}20`,
                  color: theme.palette.primary.main,
                  mb: 2,
                  width: 40,
                  height: 40,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    transform: "rotate(180deg)",
                  },
                }}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
            </Tooltip>
          )}
          {/* Create Experience Button */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "30rem",
              padding: "12px",
              marginBottom: "1rem",
              transition: "all 0.3s ease-in-out",
              boxShadow: theme.shadows[3],
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark})`,
              },
            }}
          >
            <Tooltip
              title={!isMenuOpen ? "Crear Experiencia" : ""}
              placement="right"
            >
              <span>
                <NavLink
                  to="/admin/experiences/manage/create"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <CirclePlus size={28} />
                  {isMenuOpen && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "600",
                        marginTop: "8px",
                        textAlign: "center",
                      }}
                    >
                      Crear Experiencia
                    </Typography>
                  )}
                </NavLink>
              </span>
            </Tooltip>
          </Box>
          {/* Back to Home Button */}
          <Tooltip title={!isMenuOpen ? "Inicio" : ""} placement="right">
            <span>
              <NavItem
                title="Volver al Inicio"
                link="/"
                name="inicio"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                icon={<House size={24} />}
                isMenuOpen={isMenuOpen}
              />
            </span>
          </Tooltip>
        </Box>{" "}
        <IconButton
          onClick={() => setIsMenuOpen((prev) => !prev)}
          sx={{
            background: theme.palette.primary.main,
            color: "white",
            position: "fixed", // ✅ Fixed positioning
            left: isMenuOpen ? 230 : 50, // ✅ Adjust based on sidebar state
            top: 80, // ✅ Fixed position from top
            zIndex: 1100, // ✅ Higher than sidebar
            width: 40,
            height: 40,
            boxShadow: theme.shadows[6],
            transition: "all 0.3s ease-in-out", // ✅ Smooth transition
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "scale(1.1)",
            },
          }}
        >
          {isMenuOpen ? (
            <AiOutlineArrowLeft size={20} />
          ) : (
            <AiOutlineArrowRight size={20} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
