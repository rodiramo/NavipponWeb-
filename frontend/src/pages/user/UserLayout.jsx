import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SideNav from "./components/header/SideNav";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
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
  const [authChecked, setAuthChecked] = useState(false);
  const [redirected, setRedirected] = useState(false);

  const {
    data: profileData,
    isLoading: profileIsLoading,
    error: profileError,
    isSuccess: profileSuccess,
  } = useQuery({
    queryFn: () => getUserProfile({ token: jwt }),
    queryKey: ["profile"],
    enabled: !!jwt,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
  });

  // Handle authentication checks with delay for page reloads
  useEffect(() => {
    // Don't do anything if we're still loading the profile
    if (profileIsLoading) return;

    // If we have JWT but profile query failed
    if (jwt && profileError) {
      console.error("Profile fetch failed:", profileError);
      sessionStorage.setItem("lastUserPage", location.pathname);
      navigate("/login");
      toast.error(
        "Error al verificar la sesión. Por favor, inicia sesión nuevamente."
      );
      setAuthChecked(true);
      return;
    }

    // If we have JWT and profile data (successful authentication)
    if (jwt && profileSuccess && profileData) {
      setAuthChecked(true);

      // Handle redirect to saved page after login
      if (!redirected) {
        const lastUserPage = sessionStorage.getItem("lastUserPage");
        const cameFromLogin = sessionStorage.getItem("cameFromLogin");

        // Only redirect if:
        // 1. There's a saved page
        // 2. It's different from current page
        // 3. User didn't just come from login page (fresh login should go to home)
        if (
          lastUserPage &&
          lastUserPage !== location.pathname &&
          !cameFromLogin
        ) {
          sessionStorage.removeItem("lastUserPage");
          navigate(lastUserPage, { replace: true });
          setRedirected(true);
        } else {
          // Clear the flags since we're not redirecting
          sessionStorage.removeItem("lastUserPage");
          sessionStorage.removeItem("cameFromLogin");
        }
      }
      return;
    }

    // If no JWT and we've given enough time for it to load
    if (!jwt && authChecked) {
      sessionStorage.setItem("lastUserPage", location.pathname);
      navigate("/login");
      toast.error("Debes estar logueado para acceder a esta página");
      return;
    }

    // Set a timeout to check auth state after a brief delay (for page reloads)
    if (!jwt && !authChecked) {
      const timeoutId = setTimeout(() => {
        if (!jwt) {
          sessionStorage.setItem("lastUserPage", location.pathname);
          navigate("/login");
          toast.error("Debes estar logueado para acceder a esta página");
        }
        setAuthChecked(true);
      }, 1000); // Wait 1 second for JWT to load from storage

      return () => clearTimeout(timeoutId);
    }
  }, [
    jwt,
    profileData,
    profileError,
    profileSuccess,
    profileIsLoading,
    navigate,
    location.pathname,
    authChecked,
    redirected,
  ]);

  const hideSideNav =
    location.pathname === "/user/itineraries/manage/create" ||
    location.pathname.startsWith("/user/itineraries/manage/view/");

  // Show loading state while checking authentication
  if (!authChecked || profileIsLoading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress
              size={40}
              thickness={4}
              sx={{ mb: 2, color: theme.palette.primary.main }}
            />
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Verificando sesión...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mt: 1,
              }}
            >
              Cargando tu perfil de usuario
            </Typography>
          </Box>
        </Box>
      </MainLayout>
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
        sx={{
          backgroundColor: theme.palette.background.default,
          paddingTop: 15,
        }}
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
