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

  // Handle authentication checks
  useEffect(() => {
    console.log("UserLayout Debug - Authentication State:", {
      jwt: !!jwt,
      profileIsLoading,
      profileError: profileError?.message || profileError,
      profileSuccess,
      profileData: !!profileData,
      currentPath: location.pathname,
      authChecked,
      timestamp: new Date().toISOString(),
    });

    // Don't do anything if we're still loading the profile
    if (profileIsLoading) return;

    // If we have JWT but profile query failed (invalid/expired token)
    if (jwt && profileError) {
      console.error("Profile fetch failed:", profileError);
      // Save current page before redirecting
      sessionStorage.setItem("lastUserPage", location.pathname);
      // Clear invalid token data
      localStorage.removeItem("account");
      sessionStorage.removeItem("account");
      navigate("/login", { replace: true });
      toast.error(
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
      );
      setAuthChecked(true);
      return;
    }

    // If we have JWT and profile data (successful authentication)
    if (jwt && profileSuccess && profileData) {
      setAuthChecked(true);

      // Handle redirect to saved page after successful login
      const lastUserPage = sessionStorage.getItem("lastUserPage");
      const cameFromLogin = sessionStorage.getItem("cameFromLogin") === "true";

      if (lastUserPage && lastUserPage !== location.pathname && cameFromLogin) {
        console.log("Redirecting to saved page:", lastUserPage);
        sessionStorage.removeItem("lastUserPage");
        sessionStorage.removeItem("cameFromLogin");
        navigate(lastUserPage, { replace: true });
        return;
      }

      // Clear flags if we're not redirecting
      if (cameFromLogin) {
        sessionStorage.removeItem("lastUserPage");
        sessionStorage.removeItem("cameFromLogin");
      }

      return;
    }

    // If no JWT and we've given enough time for it to load
    if (!jwt && authChecked) {
      console.log("No JWT found, redirecting to login");
      sessionStorage.setItem("lastUserPage", location.pathname);
      navigate("/login", { replace: true });
      toast.error("Debes estar logueado para acceder a esta página");
      return;
    }

    // Set a timeout to check auth state after a brief delay (for page reloads/hydration)
    if (!jwt && !authChecked) {
      const timeoutId = setTimeout(() => {
        if (!jwt) {
          console.log("Timeout reached - no JWT found, redirecting to login");
          sessionStorage.setItem("lastUserPage", location.pathname);
          navigate("/login", { replace: true });
          toast.error("Debes estar logueado para acceder a esta página");
        }
        setAuthChecked(true);
      }, 1500); // Wait 1.5 seconds for JWT to load from storage

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
  ]);

  // Determine if we should hide the navigation
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
            padding: 2,
          }}
        >
          <Box sx={{ textAlign: "center", maxWidth: 400 }}>
            <CircularProgress
              size={48}
              thickness={4}
              sx={{ mb: 3, color: theme.palette.primary.main }}
            />
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              Verificando sesión...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: "0.875rem", md: "1rem" },
              }}
            >
              Cargando tu perfil de usuario
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  // Exclude UserLayout wrapper for Itinerary Detail Page (it has its own layout)
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
          position: "relative",
        }}
      >
        {/* Desktop SideNav - Hidden on mobile and specific pages */}
        {!hideSideNav && (
          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              position: "fixed",
              left: 0,
              top: 100,
              height: "calc(100vh - 100px)",
              zIndex: 1000,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
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
            marginLeft: { xs: 0, lg: !hideSideNav ? "250px" : 0 },
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
            py: { xs: 1, md: 2 },
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 120px)",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "1400px", // Max content width
              mx: "auto", // Center content
              flex: 1,
            }}
          >
            <Outlet />
          </Box>
        </Box>

        {/* Mobile Bottom Navigation */}
        {!hideSideNav && (
          <Box
            sx={{
              display: { xs: "block", lg: "none" },
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1200,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
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
