import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/header/Header"; // Asegúrate de que la ruta de importación sea correcta
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/index/users";
import useUser from "../../hooks/useUser"; // Usar el hook useUser
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const UserLayout = () => {
  const navigate = useNavigate();
  const { user, jwt } = useUser(); // Obtener el usuario y el token del contexto

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      toast.error("Debes estar logueado para acceder a esta página");
    }
  }, [jwt, navigate]);

  const {
    //data: profileData,
    isLoading: profileIsLoading,
    //error: profileError,
  } = useQuery({
    queryFn: () => {
      return getUserProfile({ token: jwt });
    },
    queryKey: ["profile"],
    enabled: !!jwt, // Solo habilitar la consulta si jwt está presente
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
    <div className="flex flex-col h-screen lg:flex-row">
      <Header className="w-full lg:w-[300px] lg:h-full" />
      <main className="bg-[#F9F9F9] flex-1 p-4 lg:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;