import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/header/Header";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/index/users";
import useUser from "../../hooks/useUser";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { jwt, user } = useUser(); // Also get user if available
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // Track if auth has been checked

  const {
    data: profileData,
    isLoading: profileIsLoading,
    error: profileError,
    isSuccess: profileSuccess,
  } = useQuery({
    queryFn: () => getUserProfile({ token: jwt }),
    queryKey: ["profile"],
    enabled: !!jwt, // Only run when JWT exists
    retry: 1, // Don't retry too many times
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
  });

  // Handle authentication and authorization checks
  useEffect(() => {
    // Don't do anything if we're still loading the profile
    if (profileIsLoading) return;

    // If we have JWT but profile query failed
    if (jwt && profileError) {
      console.error("Profile fetch failed:", profileError);
      navigate("/");
      toast.error("Error al verificar permisos de administrador");
      setAuthChecked(true);
      return;
    }

    // If we have JWT and profile data
    if (jwt && profileSuccess && profileData) {
      if (!profileData.admin) {
        navigate("/");
        toast.error(
          "No tienes permiso para acceder al panel de administración"
        );
      }
      setAuthChecked(true);
      return;
    }

    // If no JWT and we've given enough time for it to load
    if (!jwt && authChecked) {
      navigate("/login");
      toast.error(
        "Debes estar logueado para acceder al panel de administración"
      );
      return;
    }

    // Set a timeout to check auth state after a brief delay (for page reloads)
    if (!jwt && !authChecked) {
      const timeoutId = setTimeout(() => {
        if (!jwt) {
          navigate("/login");
          toast.error(
            "Debes estar logueado para acceder al panel de administración"
          );
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
    authChecked,
  ]);

  // Show loading state while checking authentication
  if (!authChecked || profileIsLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl text-slate-700 font-medium">
            Verificando permisos...
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Cargando panel de administración
          </p>
        </div>
      </div>
    );
  }

  // If we reach here, user is authenticated and authorized
  return (
    <div className="flex flex-col h-screen lg:flex-row">
      {/* Pass setIsMenuOpen to allow Header to toggle it */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main
        style={{
          marginLeft: isMenuOpen ? "15rem" : "5rem",
          transition: "margin-left 0.3s ease-in-out",
        }}
        className="flex-1 lg:p-6"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
