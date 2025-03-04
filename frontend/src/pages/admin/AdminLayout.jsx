import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/header/Header";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/index/users";
import useUser from "../../hooks/useUser";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { jwt } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(true); // ✅ Add state for menu

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      toast.error(
        "Debes estar logueado para acceder al panel de administración"
      );
    }
  }, [jwt, navigate]);

  const { isLoading: profileIsLoading } = useQuery({
    queryFn: () => getUserProfile({ token: jwt }),
    queryKey: ["profile"],
    enabled: !!jwt,
    onSuccess: (data) => {
      if (!data?.admin) {
        navigate("/");
        toast.error(
          "No tienes permiso para acceder al panel de administración"
        );
      }
    },
    onError: () => {
      navigate("/");
      toast.error("No tienes permiso para acceder al panel de administración");
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
    <div className="flex flex-col h-screen lg:flex-row">
      {/* ✅ Pass setIsMenuOpen to allow Header to toggle it */}
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
