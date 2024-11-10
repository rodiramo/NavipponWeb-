import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/header/Header";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/index/users";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const UserLayout = () => {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);

  const {
    isLoading: profileIsLoading,
  } = useQuery({
    queryFn: () => {
      return getUserProfile({ token: userState.userInfo.token });
    },
    queryKey: ["profile"],
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