import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import { images } from "../../../../constants";
import { useEffect, useState } from "react";
import { AiFillDashboard, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaComments, FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useUser from "../../../../hooks/useUser";
import { createPost } from "../../../../services/index/posts";
import { createExperience } from "../../../../services/index/experiences";

const Header = () => {
  const navigate = useNavigate();
  const { jwt } = useUser();
  const queryClient = useQueryClient();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeNavName, setActiveNavName] = useState("dashboard");
  const windowSize = useWindowSize();

  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } =
    useMutation({
      mutationFn: ({ token }) => {
        return createPost({
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"]);
        toast.success("¡Publicación creada, edítala ahora!");
        navigate(`/admin/posts/manage/edit/${data.slug}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  const {
    mutate: mutateCreateExperience,
    isLoading: isLoadingCreateExperience,
  } = useMutation({
    mutationFn: ({ newExperienceData, token }) => {
      return createExperience({
        experienceData: newExperienceData, // Make sure this matches the API function's expected parameters
        token,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["experiences"]);
      toast.success("¡Experiencia creada con éxito!");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleCreateNewExperience = () => {
    if (!jwt) {
      toast.error("Debes estar logueado para crear una nueva experiencia");
      return;
    }

    navigate("/admin/experiences/manage/create");
  };

  const toggleMenuHandler = () => {
    setIsMenuActive((prevState) => !prevState);
  };

  useEffect(() => {
    if (windowSize.width < 1024) {
      setIsMenuActive(false);
    } else {
      setIsMenuActive(true);
    }
  }, [windowSize.width]);

  const handleCreateNewPost = () => {
    if (jwt) {
      mutateCreatePost({ token: jwt });
    } else {
      toast.error("Debes estar logueado para crear una nueva publicación");
    }
  };

  return (
    <header className="flex h-fit w-full items-center justify-between p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0 bg-[#0A0330] text-white">
      {/* logo */}
      <Link to="/">
        <img src={images.Logo} alt="logo" className="w-16 lg:hidden" />
      </Link>
      {/* menu burger icon */}
      <div className="cursor-pointer lg:hidden">
        {isMenuActive ? (
          <AiOutlineClose className="w-6 h-6" onClick={toggleMenuHandler} />
        ) : (
          <AiOutlineMenu className="w-6 h-6" onClick={toggleMenuHandler} />
        )}
      </div>
      {/* sidebar container */}
      {isMenuActive && (
        <div className="fixed inset-0 lg:static lg:h-full lg:w-full">
          {/* underlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={toggleMenuHandler}
          />
          {/* sidebar */}
          <div className="fixed top-0 bottom-0 left-0 z-50 w-3/4 overflow-y-auto bg-[#0A0330] p-4 lg:static lg:h-full lg:w-full lg:p-6">
            <Link to="/">
              <img src={images.Logo} alt="logo" className="w-16" />
            </Link>
            <h4 className="mt-10 font-bold text-[#C7C7C7]">MAIN MENU</h4>
            {/* menu items */}
            <div className="mt-6 flex flex-col gap-y-[0.563rem]">
              <NavItem
                title="Dashboard"
                link="/admin"
                icon={<AiFillDashboard className="text-xl text-white" />}
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
              />
              <NavItem
                title="Comentarios"
                link="/admin/comments"
                icon={<FaComments className="text-xl text-white" />}
                name="comments"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
              />

              <NavItem
                title="Reseñas"
                link="/admin/reviews"
                icon={<FaComments className="text-xl text-white" />}
                name="reviews"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
              />

              <NavItemCollapse
                title="Posts"
                icon={<MdDashboard className="text-xl text-white" />}
                name="posts"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
              >
                <Link to="/admin/posts/manage" className="hover:text-[#FF4A5A]">
                  Administrar todas las publicaciones
                </Link>
                <button
                  disabled={isLoadingCreatePost}
                  className="text-start disabled:opacity-60 disabled:cursor-not-allowed hover:text-[#FF4A5A]"
                  onClick={handleCreateNewPost}
                >
                  Crear nueva publicacion
                </button>
                <Link
                  to="/admin/categories/manage"
                  className="hover:text-[#FF4A5A]"
                >
                  Categorias
                </Link>
              </NavItemCollapse>

              <NavItemCollapse
                title="Experiencias"
                icon={<MdDashboard className="text-xl text-white" />}
                name="experiences"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
              >
                <Link
                  to="/admin/experiences/manage"
                  className="hover:text-[#FF4A5A]"
                >
                  Administrar todas las experiencias
                </Link>
                <button
                  disabled={isLoadingCreateExperience}
                  className="text-start disabled:opacity-60 disabled:cursor-not-allowed hover:text-[#FF4A5A]"
                  onClick={handleCreateNewExperience}
                >
                  Crear nueva experiencia
                </button>
              </NavItemCollapse>

              <NavItem
                title="Usuarios"
                link="/admin/users/manage"
                icon={<FaUser className="text-xl text-white" />}
                name="users"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
