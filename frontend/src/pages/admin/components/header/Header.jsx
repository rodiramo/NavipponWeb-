import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import { images, stables } from "../../../../constants";
import { useState, useEffect } from "react";
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
  HeartPulse,
  MessagesSquare,
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

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Container */}
      <Box
        sx={{
          width: isMenuOpen ? 250 : 70,
          backgroundColor: theme.palette.secondary.dark,
          color: "white",
          transition: "width 0.3s ease-in-out",
          height: "100vh",
          borderRadius: "0rem 2rem 2rem 0rem",
          zIndex: 1000,
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          justifyContent: "space-between",
        }}
      >
        <Link>
          {" "}
          <img
            src={images.Logo}
            alt="Logo"
            style={{
              width: isMenuOpen ? "70px" : "40px",
              transition: "width 0.3s ease-in-out",
              cursor: "pointer",
            }}
          />
        </Link>{" "}
        <Box sx={{ width: "100%" }}>
          {/* Sidebar Toggle Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              padding: 1,
              marginRight: "-20px",
            }}
          >
            <IconButton
              onClick={() => setIsMenuOpen((prev) => !prev)} // ✅ Toggles menu
              sx={{
                background: theme.palette.primary.main,
                color: "white",
                marginRight: "-18px",
                alignSelf: isMenuOpen ? "flex-end" : "center",
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                },
              }}
            >
              {isMenuOpen ? (
                <AiOutlineArrowLeft size={24} />
              ) : (
                <AiOutlineArrowRight size={24} />
              )}
            </IconButton>
          </Box>
          {/* User Profile */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
            {user?.avatar ? (
              <img
                src={`${stables.UPLOAD_FOLDER_BASE_URL}${user.avatar}`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-white" />
            )}
            {isMenuOpen && (
              <Box ml={2}>
                <Typography variant="h6">{user?.name}</Typography>
                <Typography variant="body2">
                  {user?.admin ? "Admin" : ""}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ margin: "1rem 0", width: "100%" }} />
          {/* Navigation Items */}
          <Box>
            <Tooltip title={!isMenuOpen ? "Dashboard" : ""} placement="right">
              <NavItem
                title="Dashboard"
                link="/admin"
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                icon={<SquareKanban size={24} />}
                isMenuOpen={isMenuOpen}
              />
            </Tooltip>

            <Tooltip
              title={!isMenuOpen ? "Experiencias" : ""}
              placement="right"
            >
              <NavItem
                title="Experiencias"
                link="/admin/experiences/manage"
                name="experiences"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                icon={<Compass size={24} />}
                isMenuOpen={isMenuOpen}
              />
            </Tooltip>

            <Tooltip
              title={!isMenuOpen ? "Publicaciones" : ""}
              placement="right"
            >
              <NavItem
                title="Publicaciones"
                link="/admin/posts/manage"
                name="posts"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                icon={<Newspaper size={24} />}
                isMenuOpen={isMenuOpen}
              />
            </Tooltip>

            <Tooltip title={!isMenuOpen ? "Comentarios" : ""} placement="right">
              <NavItem
                title="Comentarios"
                link="/admin/comments"
                name="comments"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                icon={<MessagesSquare size={24} />}
                isMenuOpen={isMenuOpen}
              />
            </Tooltip>

            <Tooltip title={!isMenuOpen ? "Reseñas" : ""} placement="right">
              <NavItem
                title="Reseñas"
                link="/admin/reviews"
                name="reviews"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                icon={<Star size={24} />}
                isMenuOpen={isMenuOpen}
              />
            </Tooltip>

            <Tooltip title={!isMenuOpen ? "Usuarios" : ""} placement="right">
              <NavItem
                title="Usuarios"
                link="/admin/users/manage"
                name="users"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                icon={<UsersRound size={24} />}
                isMenuOpen={isMenuOpen}
              />
            </Tooltip>
          </Box>
        </Box>
        <Divider sx={{ margin: "1rem 0", width: "100%" }} />
        {/* Footer Section with "Inicio" Button at the Bottom */}
        <Box sx={{ width: "100%", marginTop: "auto", paddingBottom: "1rem" }}>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "30rem",
              padding: "10px",
              marginBottom: "1rem",
              transition: "background-color 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <Tooltip
              title={!isMenuOpen ? "Crear Experiencia" : ""}
              placement="right"
            >
              <NavLink
                to="/admin/experiences/manage/create"
                className="flex flex-col items-center text-white text-center no-underline"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CirclePlus size={28} />
                {isMenuOpen && (
                  <Box
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    Crear Experiencia
                  </Box>
                )}
              </NavLink>
            </Tooltip>
          </Box>

          {/* Volver al Inicio Button */}
          <Tooltip title={!isMenuOpen ? "Inicio" : ""} placement="right">
            <NavItem
              title="Volver al Inicio"
              link="/"
              name="inicio"
              activeNavName={activeNavName}
              setActiveNavName={setActiveNavName}
              icon={<House size={24} />}
              isMenuOpen={isMenuOpen}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;