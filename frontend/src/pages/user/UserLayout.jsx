import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SideNav from "./components/header/SideNav";
import MobileNav from "./components/header/MobileNav";
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
    console.log("UserLayout Debug - Full State:", {
      jwt: !!jwt,
      profileIsLoading,
      profileError: profileError?.message || profileError,
      profileSuccess,
      profileData: !!profileData,
      currentPath: location.pathname,
      authChecked,
      redirected,
      timestamp: new Date().toISOString(),
    });

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

        // if (
        // lastUserPage &&
        //  lastUserPage !== location.pathname &&
        //  !cameFromLogin
        // ) {
        // sessionStorage.removeItem("lastUserPage");
        // navigate(lastUserPage, { replace: true });
        // setRedirected(true);
        // } else {
        // Clear the flags since we're not redirecting
        //  sessionStorage.removeItem("lastUserPage");
        // sessionStorage.removeItem("cameFromLogin");
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
    return <Outlet />;
  }

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          paddingTop: { xs: 15, lg: 15 },
          paddingBottom: { xs: 10, lg: 0 },
        }}
      >
        {/* Desktop SideNav - Hidden on mobile */}
        {!hideSideNav && (
          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              position: "fixed",
              left: 0,
              top: 100,
              height: "100vh",
            }}
          >
            <SideNav />
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: "100%",
            marginLeft: { xs: 0, lg: !hideSideNav ? "250px" : 0 }, // No margin on mobile
            px: { xs: 2, sm: 3, lg: 5 }, // Responsive padding
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Outlet />
        </Box>

        {/* Mobile Bottom Navigation */}
        {!hideSideNav && (
          <Box
            sx={{
              display: { xs: "block", lg: "none" }, // Show only on mobile
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
          >
            <MobileNav />
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default UserLayout;
