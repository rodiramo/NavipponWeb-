import { Outlet, useNavigate } from "react-router-dom";
import SideNav from "./components/header/SideNav";
import { useQuery } from "@tanstack/react-query";
import { Button, Collapse, Box, Typography, useTheme } from "@mui/material";
import MainLayout from "../../components/MainLayout.jsx";
import { getUserProfile } from "../../services/index/users";
import useUser from "../../hooks/useUser";
import { toast } from "react-hot-toast";

import { useEffect } from "react";

const UserLayout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, jwt } = useUser();

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      toast.error("Debes estar logueado para acceder a esta página");
    }
  }, [jwt, navigate]);

  const { isLoading: profileIsLoading } = useQuery({
    queryFn: () => getUserProfile({ token: jwt }),
    queryKey: ["profile"],
    enabled: !!jwt,
    onSuccess: (data) => {
      if (!data) {
        navigate("/login");
        toast.error("Debes iniciar sesión para acceder a esta página");
      }
    },
    onError: (err) => {
      console.log(err);
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

  return (
    <MainLayout>
      <Box
        className="flex flex-col lg:flex-row h-full min-h-screen"
        backgroundColor={theme.palette.background.bg}
        paddingTop={15}
      >
        {/* Main Content */} {/* Sidebar - Always on the Right Side */}
        <SideNav className="w-full lg:w-[300px]  lg:fixed lg:left-0 lg:top-0 lg:h-full border-l border-gray-200 bg-white shadow-md" />
        <main className="flex-1 px-5 overflow-auto">
          <Outlet />
        </main>
      </Box>
    </MainLayout>
  );
};

export default UserLayout;
