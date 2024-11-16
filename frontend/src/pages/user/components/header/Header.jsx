import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import { images, stables } from "../../../../constants";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useUser from "../../../../hooks/useUser";
import { createUserPost } from "../../../../services/index/userPosts";
import { createUserExperience } from "../../../../services/index/userExperiences";
import { FaRegUserCircle } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const { user, jwt } = useUser();
  const queryClient = useQueryClient();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeNavName, setActiveNavName] = useState("dashboard");
  const windowSize = useWindowSize();

  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } =
    useMutation({
      mutationFn: ({ token }) => {
        return createUserPost({
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["userPosts"]);
        toast.success("¡Publicación creada, edítala ahora!");
        navigate(`/user/posts/manage/edit/${data.slug}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const { mutate: mutateCreateExperience, isLoading: isLoadingCreateExperience } =
    useMutation({
      mutationFn: ({ token }) => {
        return createUserExperience({
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["userExperiences"]);
        toast.success("¡Experiencia creada, edítala ahora!");
        navigate(`/user/experiences/manage/edit/${data.slug}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const isMobile = () => windowSize.width < 1024;

  const toggleMenuHandler = () => {
    if (isMobile()) {
      setIsMenuActive((prevState) => !prevState);
    }
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

  const handleCreateNewExperience = () => {
    if (jwt) {
      mutateCreateExperience({ token: jwt });
    } else {
      toast.error("Debes estar logueado para crear una nueva experiencia");
    }
  };

  return (
    <header className="flex h-fit w-full items-center justify-center p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-center lg:justify-center lg:p-0 bg-[#0A0330] text-white">
      {/* avatar */}
      <div className="flex items-center mt-4 p-4 justify-center gap-x-3">
        {user?.avatar ? (
          <img
            src={`${stables.UPLOAD_FOLDER_BASE_URL}${user.avatar}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <FaRegUserCircle className="w-24 h-24 text-white" />
        )}
      </div>
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
        <div className="fixed inset-0 z-50 lg:static lg:h-full lg:w-full">
          {/* underlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={toggleMenuHandler}
          />
          {/* sidebar */}
          <div className="fixed top-0 bottom-0 left-0 z-50 w-3/4 overflow-y-auto bg-[#0A0330] p-4 lg:static lg:h-full lg:w-full lg:p-6">
            <div className="flex justify-between items-center">
              <h4 className="mt-10 font-bold text-[#C7C7C7]">MENÚ PRINCIPAL</h4>
              <AiOutlineClose className="w-6 h-6 cursor-pointer lg:hidden" onClick={toggleMenuHandler} />
            </div>
            {/* menu items */}
            <div className="mt-6 flex flex-col gap-y-[0.563rem]">
              <NavItem
                title="Dashboard"
                link="/user"
                icon={<MdDashboard className="text-xl text-white" />}
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
                onClick={isMobile() ? toggleMenuHandler : undefined}
              />
              <NavItemCollapse
                title="Posts"
                icon={<MdDashboard className="text-xl text-white" />}
                name="posts"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
                onClick={isMobile() ? toggleMenuHandler : undefined}
              >
                <Link to="/user/posts/manage" className="hover:text-[#FF4A5A]" onClick={isMobile() ? toggleMenuHandler : undefined}>Administrar tus publicaciones</Link>
                <button
                  disabled={isLoadingCreatePost}
                  className="text-start disabled:opacity-60 disabled:cursor-not-allowed hover:text-[#FF4A5A]"
                  onClick={handleCreateNewPost}
                >
                  Crear nuevo post
                </button>
              </NavItemCollapse>

              <NavItemCollapse
                title="Experiencias"
                icon={<MdDashboard className="text-xl text-white" />}
                name="experiences"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
                onClick={isMobile() ? toggleMenuHandler : undefined}
              >
                <Link to="/user/experiences/manage" className="hover:text-[#FF4A5A]" onClick={isMobile() ? toggleMenuHandler : undefined}>Administrar tus experiencias</Link>
                <button
                  disabled={isLoadingCreateExperience}
                  className="text-start disabled:opacity-60 disabled:cursor-not-allowed hover:text-[#FF4A5A]"
                  onClick={handleCreateNewExperience}
                >
                  Crear nueva experiencia
                </button>
              </NavItemCollapse>

              <NavItemCollapse
                title="Favoritos"
                icon={<FaRegUserCircle className="text-xl text-white" />}
                name="favorites"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
                className="hover:text-[#FF4A5A]"
                onClick={isMobile() ? toggleMenuHandler : undefined}
              >
                <Link to="/user/favorites/manage" className="hover:text-[#FF4A5A]" onClick={isMobile() ? toggleMenuHandler : undefined}>Administrar Favoritos</Link>
              </NavItemCollapse>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;