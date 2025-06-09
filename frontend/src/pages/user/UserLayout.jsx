import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SideNav from "./components/header/SideNav";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, useTheme } from "@mui/material";
import MainLayout from "../../components/MainLayout.jsx";
import { getUserProfile } from "../../services/index/users";
import useUser from "../../hooks/useUser";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { jwt } = useUser();
  const [redirected, setRedirected] = useState(false); // Prevent infinite redirects

  useEffect(() => {
    if (!jwt) {
      sessionStorage.setItem("lastUserPage", location.pathname);
      navigate("/login");
      toast.error("Debes estar logueado para acceder a esta página");
    }
  }, [jwt, navigate, location.pathname]);

  useEffect(() => {
    if (jwt && !redirected) {
      const lastUserPage = sessionStorage.getItem("lastUserPage");
      if (lastUserPage) {
        sessionStorage.removeItem("lastUserPage");
        navigate(lastUserPage, { replace: true });
        setRedirected(true);
      }
    }
  }, [jwt, navigate, redirected]);
  const hideSideNav =
    location.pathname === "/user/itineraries/manage/create" ||
    location.pathname.startsWith("/user/itineraries/manage/view/");

  const { isLoading: profileIsLoading } = useQuery({
    queryFn: () => getUserProfile({ token: jwt }),
    queryKey: ["profile"],
    enabled: !!jwt,
    onError: () => {
      navigate("/login");
      toast.error("Debes iniciar sesión para acceder a esta página");
    },
  });

  if (profileIsLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h3 className="text-2xl text-slate-700">Cargando...</h3>
      </div>
    );
  }
  // Exclude UserLayout for Itinerary Detail Page
  if (location.pathname.startsWith("/user/itineraries/manage/view/")) {
    return <Outlet />; // Just render the page without layout
  }
  return (
    <MainLayout>
      <Box
        className="flex lg:flex-row h-full min-h-screen"
        backgroundColor={theme.palette.background.bg}
        paddingTop={15}
      >
        {!hideSideNav && (
          <SideNav className="w-full lg:fixed lg:left-0 lg:top-0 lg:h-full border-l border-gray-200 bg-white shadow-md" />
        )}
        <main
          className="flex-1 px-5 overflow-auto"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Outlet />
        </main>
      </Box>
    </MainLayout>
  );
};

export default UserLayout;
