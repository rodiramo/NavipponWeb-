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

// 🆕 NEW: Separate component for itinerary pages to handle DOM manipulation safely
const ItineraryWrapper = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("🔧 ItineraryWrapper: Starting navigation hiding process...");

    // 🔧 FIXED: Use requestAnimationFrame to ensure DOM is fully ready
    const hideNavigation = () => {
      requestAnimationFrame(() => {
        try {
          // Add class to body to hide any global navigation
          document.body.classList.add("itinerary-fullscreen");
          console.log("✅ Added itinerary-fullscreen class to body");

          // Hide any potential navbar elements with safety checks
          const navSelectors = [
            'nav:not([class*="itinerary"])',
            '.navbar:not([class*="itinerary"])',
            '.main-nav:not([class*="itinerary"])',
            'header:not([class*="itinerary"])',
            '.header:not([class*="itinerary"])',
            ".MuiAppBar-root",
            ".MuiToolbar-root",
          ];

          let hiddenCount = 0;
          navSelectors.forEach((selector) => {
            try {
              const elements = document.querySelectorAll(selector);
              elements.forEach((el) => {
                if (!el.closest('[class*="itinerary"]')) {
                  el.style.display = "none";
                  el.style.visibility = "hidden";
                  el.style.opacity = "0";
                  el.style.pointerEvents = "none";
                  hiddenCount++;
                }
              });
            } catch (selectorError) {
              console.warn(
                `⚠️ Could not hide elements with selector "${selector}":`,
                selectorError
              );
            }
          });

          console.log(
            `✅ Navigation hidden successfully. Hidden ${hiddenCount} elements.`
          );
          setIsReady(true);
        } catch (error) {
          console.error("❌ Failed to hide navigation:", error);
          setIsReady(true); // Continue anyway
        }
      });
    };

    // 🔧 IMPROVED: Multiple fallback timings to ensure it works
    const timeoutIds = [
      setTimeout(hideNavigation, 0), // Immediate
      setTimeout(hideNavigation, 50), // Quick fallback
      setTimeout(hideNavigation, 200), // Delayed fallback
    ];

    return () => {
      // Clear all timeouts
      timeoutIds.forEach((id) => clearTimeout(id));

      // Cleanup: restore navigation elements
      try {
        console.log("🔄 ItineraryWrapper: Cleaning up navigation hiding...");
        document.body.classList.remove("itinerary-fullscreen");

        // Restore hidden elements
        const allHiddenElements = document.querySelectorAll(
          '[style*="display: none"]'
        );
        let restoredCount = 0;
        allHiddenElements.forEach((el) => {
          if (!el.closest('[class*="itinerary"]')) {
            el.style.display = "";
            el.style.visibility = "";
            el.style.opacity = "";
            el.style.pointerEvents = "";
            restoredCount++;
          }
        });

        console.log(
          `🔄 Navigation restored. Restored ${restoredCount} elements.`
        );
      } catch (error) {
        console.warn("⚠️ Could not restore navigation:", error);
      }
    };
  }, []);

  // 🔧 Optional: Show loading state while setting up
  if (!isReady) {
    return (
      <>
        <Outlet />
        <style jsx global>{`
          /* Immediate CSS hiding while JS loads */
          nav:not([class*="itinerary"]),
          .navbar:not([class*="itinerary"]),
          .main-nav:not([class*="itinerary"]),
          header:not([class*="itinerary"]) {
            display: none !important;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Outlet />

      {/* 🔧 ENHANCED: More comprehensive CSS hiding */}
      <style jsx global>{`
        /* Hide all navigation elements on itinerary pages */
        body.itinerary-fullscreen nav:not([class*="itinerary"]),
        body.itinerary-fullscreen .navbar:not([class*="itinerary"]),
        body.itinerary-fullscreen .main-nav:not([class*="itinerary"]),
        body.itinerary-fullscreen [class*="Nav"]:not([class*="itinerary"]),
        body.itinerary-fullscreen header:not([class*="itinerary"]),
        body.itinerary-fullscreen .header:not([class*="itinerary"]) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: -1 !important;
        }

        /* Hide Material-UI navigation components */
        body.itinerary-fullscreen .MuiAppBar-root:not([class*="itinerary"]),
        body.itinerary-fullscreen .MuiToolbar-root:not([class*="itinerary"]),
        body.itinerary-fullscreen
          .MuiBottomNavigation-root:not([class*="itinerary"]) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }

        /* Ensure full viewport usage */
        body.itinerary-fullscreen {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }

        /* Hide any potential floating elements */
        body.itinerary-fullscreen .fab:not([class*="itinerary"]),
        body.itinerary-fullscreen .floating-nav:not([class*="itinerary"]),
        body.itinerary-fullscreen .overlay-nav:not([class*="itinerary"]) {
          display: none !important;
        }

        /* Reset body margins and padding for itinerary pages */
        body.itinerary-fullscreen #root,
        body.itinerary-fullscreen .app-root {
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Immediate hiding for common navigation elements */
        nav:not([class*="itinerary"]),
        .navbar:not([class*="itinerary"]),
        .main-nav:not([class*="itinerary"]) {
          display: none !important;
        }
      `}</style>
    </>
  );
};

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
    staleTime: 5 * 60 * 1000,
  });

  // 🔧 ENHANCED: Better detection of itinerary pages
  const isItineraryPage =
    location.pathname === "/user/itineraries/manage/create" ||
    location.pathname.startsWith("/user/itineraries/manage/view/") ||
    location.pathname.startsWith("/user/itineraries/manage/edit/");

  // 🔧 ENHANCED: Also hide nav for creation and editing
  const hideAllNavigation = isItineraryPage;

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
      isItineraryPage,
      hideAllNavigation,
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
      }, 1500);

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
    isItineraryPage,
    hideAllNavigation,
  ]);

  // 🔧 ENHANCED: Loading state for itinerary pages (no MainLayout wrapper)
  if (!authChecked || profileIsLoading) {
    // 🆕 NEW: For itinerary pages, show loading without MainLayout
    if (hideAllNavigation) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: theme.palette.background.default,
            padding: 2,
            // 🎨 ENHANCED: Better styling for full-screen loading
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
          }}
        >
          <Box sx={{ textAlign: "center", maxWidth: 400 }}>
            <CircularProgress
              size={48}
              thickness={4}
              sx={{
                mb: 3,
                color: theme.palette.primary.main,
                // 🎨 ADD: Subtle animation
                animation: "pulse 2s infinite",
              }}
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
              Cargando itinerario...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: "0.875rem", md: "1rem" },
              }}
            >
              Preparando tu experiencia de viaje
            </Typography>
          </Box>

          {/* 🎨 ADD: CSS animation */}
          <style jsx>{`
            @keyframes pulse {
              0% {
                opacity: 1;
              }
              50% {
                opacity: 0.7;
              }
              100% {
                opacity: 1;
              }
            }
          `}</style>
        </Box>
      );
    }

    // Regular loading state with MainLayout for other pages
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

  // 🔧 ENHANCED: Complete bypass of MainLayout for ALL itinerary pages
  if (hideAllNavigation) {
    console.log(
      "🚫 Hiding all navigation for itinerary page:",
      location.pathname
    );

    return <ItineraryWrapper />;
  }

  // 🔧 STANDARD: Regular layout with MainLayout for non-itinerary pages
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
        {/* Desktop SideNav */}
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

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: "100%",
            marginLeft: { xs: 0, lg: "250px" },
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
              maxWidth: "1400px",
              mx: "auto",
              flex: 1,
            }}
          >
            <Outlet />
          </Box>
        </Box>

        {/* Mobile Bottom Navigation */}
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
      </Box>
    </MainLayout>
  );
};

export default UserLayout;
