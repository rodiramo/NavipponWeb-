import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { PiUsersFour } from "react-icons/pi";
import { MdDashboard } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import {
  useTheme,
  IconButton,
  Box,
  Divider,
  ListItemText,
  Typography,
  Tooltip,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useUser from "../../../../hooks/useUser";
import { createUserPost } from "../../../../services/index/userPosts";
import { createUserExperience } from "../../../../services/index/userExperiences";
import { createItinerary } from "../../../../services/index/itinerary";
import { images, stables } from "../../../../constants";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const windowSize = useWindowSize();
  const { user, jwt } = useUser();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavName, setActiveNavName] = useState("dashboard");

  useEffect(() => {
    if (windowSize.width >= 1024) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }, [windowSize.width]);

  // ✅ Mutation for creating a new post
  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } =
    useMutation({
      mutationFn: ({ token }) => createUserPost({ token }),
      onSuccess: (data) => {
        queryClient.invalidateQueries(["userPosts"]);
        toast.success("¡Publicación creada, edítala ahora!");
        navigate(`/user/posts/manage/edit/${data.slug}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  // ✅ Mutation for creating a new experience
  const {
    mutate: mutateCreateExperience,
    isLoading: isLoadingCreateExperience,
  } = useMutation({
    mutationFn: ({ token }) => createUserExperience({ token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userExperiences"]);
      toast.success("¡Experiencia creada, edítala ahora!");
      navigate(`/user/experiences/manage/edit/${data.slug}`);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  // ✅ Mutation for creating a new itinerary
  const { mutate: mutateCreateItinerary, isLoading: isLoadingCreateItinerary } =
    useMutation({
      mutationFn: ({ token }) =>
        createItinerary({
          itineraryData: {
            title: "Nuevo Itinerario",
            startDate: new Date(),
            endDate: new Date(),
            days: [],
            totalBudget: 0,
          },
          token,
        }),
      onSuccess: (data) => {
        queryClient.invalidateQueries(["userItineraries"]);
        toast.success("¡Itinerario creado, edítalo ahora!");
        navigate(`/user/itineraries/manage/edit/${data._id}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  // ✅ Handlers for creating posts, experiences, and itineraries
  const handleCreateNewPost = () => {
    if (jwt) {
      mutateCreatePost({ token: jwt });
    } else {
      toast.error("Debes estar logueado para crear una nueva publicación");
    }
  };

  const handleCreateNewExperience = () => {
    if (jwt) {
      mutateCreateExperience({ token: jwt });
    } else {
      toast.error("Debes estar logueado para crear una nueva experiencia");
    }
  };

  const handleCreateNewItinerary = () => {
    if (jwt) {
      mutateCreateItinerary({ token: jwt });
    } else {
      toast.error("Debes estar logueado para crear un nuevo itinerario");
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
          alignItems: isMenuOpen ? "flex-start" : "center",
          padding: "1rem",
        }}
      >
        {/* Logo */}
        <Link to="/">
          <img src={images.Logo} alt="logo" className="w-16 lg:hidden" />
        </Link>
        {/* Sidebar Toggle Button */}
        <IconButton
          onClick={() => setIsMenuOpen((prev) => !prev)}
          sx={{
            background: theme.palette.primary.main,
            color: "white",
            alignSelf: isMenuOpen ? "flex-end" : "center",
            transition: "transform 0.3s ease-in-out",
            "&:hover": { backgroundColor: theme.palette.primary.light },
          }}
        >
          {isMenuOpen ? (
            <AiOutlineArrowLeft size={24} />
          ) : (
            <AiOutlineArrowRight size={24} />
          )}
        </IconButton>

        {/* User Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
          {user?.avatar ? (
            <img
              src={`${stables.UPLOAD_FOLDER_BASE_URL}${user.avatar}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
              size={isMenuOpen ? 60 : 40}
            />
          ) : (
            <FaRegUserCircle className="w-24 h-24 text-white" />
          )}{" "}
          {isMenuOpen && (
            <Box ml={2}>
              <Typography variant="h6">Usuario</Typography>
              <Typography variant="body2">Perfil</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ margin: "1rem 0", width: "100%" }} />

        {/* Navigation Items */}
        <Tooltip title={!isMenuOpen ? "Dashboard" : ""} placement="right">
          <PiUsersFour size={24} />
          {isMenuOpen && (
            <NavItem
              title="Dashboard"
              link="/user"
              name="dashboard"
              activeNavName={activeNavName}
              setActiveNavName={setActiveNavName}
              sx={{ marginLeft: 2 }}
            />
          )}
        </Tooltip>

        <Tooltip title={!isMenuOpen ? "Experiencias" : ""} placement="right">
          <PiUsersFour size={24} />
          {isMenuOpen && (
            <NavItemCollapse
              name="experiences"
              title="Experiencias"
              activeNavName={activeNavName}
              setActiveNavName={setActiveNavName}
            >
              <Link to="/user/experiences/manage">
                Administrar experiencias
              </Link>
              <button
                disabled={isLoadingCreateExperience}
                onClick={handleCreateNewExperience}
              >
                Crear nueva experiencia
              </button>
            </NavItemCollapse>
          )}{" "}
        </Tooltip>

        <Tooltip title={!isMenuOpen ? "Publicaciones" : ""} placement="right">
          <NavItemCollapse
            title="Publicaciones"
            icon={<MdDashboard />}
            name="posts"
            activeNavName={activeNavName}
            setActiveNavName={setActiveNavName}
          >
            <Link to="/user/posts/manage">Administrar publicaciones</Link>
            <button
              disabled={isLoadingCreatePost}
              onClick={handleCreateNewPost}
            >
              Crear nueva publicación
            </button>
          </NavItemCollapse>
        </Tooltip>

        <NavItemCollapse
          title="Favoritos"
          icon={<FaRegUserCircle className="text-xl text-white" />}
          name="favorites"
          activeNavName={activeNavName}
          setActiveNavName={setActiveNavName}
          className="hover:text-[#FF4A5A]"
        >
          <Link to="/user/favorites/manage" className="hover:text-[#FF4A5A]">
            Administrar Favoritos
          </Link>
        </NavItemCollapse>

        <NavItemCollapse
          title="Itinerarios"
          icon={<MdDashboard className="text-xl text-white" />}
          name="itineraries"
          activeNavName={activeNavName}
          setActiveNavName={setActiveNavName}
          className="hover:text-[#FF4A5A]"
        >
          <Link to="/user/itineraries/manage" className="hover:text-[#FF4A5A]">
            Administrar tus itinerarios
          </Link>
          <button
            disabled={isLoadingCreateItinerary}
            className="text-start disabled:opacity-60 disabled:cursor-not-allowed hover:text-[#FF4A5A]"
            onClick={handleCreateNewItinerary}
          >
            Crear nuevo itinerario
          </button>
        </NavItemCollapse>

        <NavItemCollapse
          title="Comentarios"
          icon={<FaRegUserCircle className="text-xl text-white" />}
          name="comments"
          activeNavName={activeNavName}
          setActiveNavName={setActiveNavName}
          className="hover:text-[#FF4A5A]"
        >
          <Link to="/user/comments/manage" className="hover:text-[#FF4A5A]">
            Administrar Comentarios
          </Link>
        </NavItemCollapse>
        <NavItemCollapse
          title="Reseñas"
          icon={<FaRegUserCircle className="text-xl text-white" />}
          name="reviews"
          activeNavName={activeNavName}
          setActiveNavName={setActiveNavName}
          className="hover:text-[#FF4A5A]"
        >
          <Link to="/user/reviews/manage" className="hover:text-[#FF4A5A]">
            Administrar Reseñas
          </Link>
        </NavItemCollapse>
        <NavItem
          title="Volver a inicio"
          link="/"
          icon={<MdDashboard className="text-xl text-white" />}
          name="home"
          activeNavName={activeNavName}
          setActiveNavName={setActiveNavName}
          className="hover:text-[#FF4A5A]"
        />
      </Box>
    </Box>
  );
};

export default Header;
