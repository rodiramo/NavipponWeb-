import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-hot-toast";
import BreadCrumbs from "../../components/BreadCrumbs";
import ReviewsContainer from "../../components/reviews/ReviewsContainer";
import MainLayout from "../../components/MainLayout";
import SocialShareButtons from "../../components/SocialShareButtons";
import { images, stables } from "../../constants";
import SuggestedExperiences from "./container/SuggestedExperiences";
import { useQuery } from "@tanstack/react-query";
import { getAllExperiences, getSingleExperience } from "../../services/index/experiences";
import ExperienceDetailSkeleton from "./components/ExperienceDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import parseJsonToHtml from "../../utils/parseJsonToHtml";
import Editor from "../../components/editor/Editor";
import useUser from "../../hooks/useUser";
import { addFavorite as addFavoriteService, removeFavorite as removeFavoriteService, getUserFavorites } from "../../services/index/favorites";

const ExperienceDetailPage = () => {
  const { slug } = useParams();
  const { user, jwt } = useUser();
  const [breadCrumbsData, setbreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleExperience({ slug }),
    queryKey: ["experience", slug],
    onSuccess: async (data) => {
      setbreadCrumbsData([
        { name: "Home", link: "/" },
        { name: "Experience", link: "/experience" },
        { name: "Detalle", link: `/experience/${data.slug}` },
      ]);
      setBody(parseJsonToHtml(data?.body));
      if (user && jwt) {
        const favorites = await getUserFavorites({ userId: user._id, token: jwt });
        const isFav = favorites.some(fav => fav.experienceId && fav.experienceId._id === data._id);
        setIsFavorite(isFav);
      }
    },
  });

  const { data: ExperiencesData } = useQuery({
    queryFn: () => getAllExperiences(),
    queryKey: ["experiences"],
  });

  useEffect(() => {
    if (data && user && jwt) {
      getUserFavorites({ userId: user._id, token: jwt })
        .then(favorites => {
          const isFav = favorites.some(fav => fav.experienceId && fav.experienceId._id === data._id);
          setIsFavorite(isFav);
        })
        .catch(error => console.error("Error fetching user favorites:", error));
    }
  }, [user, jwt, data]);

  const handleFavoriteClick = async () => {
    if (!user || !jwt) {
      toast.error("Debes iniciar sesión para agregar a favoritos");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteService({ userId: user._id, experienceId: data._id, token: jwt });
        setIsFavorite(false);
        toast.success("Se eliminó de favoritos");
      } else {
        await addFavoriteService({ userId: user._id, experienceId: data._id, token: jwt });
        setIsFavorite(true);
        toast.success("Se agregó a favoritos");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <ExperienceDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <BreadCrumbs data={breadCrumbsData} />
            <img
              className="rounded-xl w-full"
              src={data?.photo ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo : images.sampleExperienceImage}
              alt={data?.title}
            />
            <div className="mt-4 flex gap-2">
              {Array.isArray(data?.categories) && data.categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/experience?category=${category.name}`}
                  className="text-primary text-sm inline-block md:text-base"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <h2 className="text-xl font-medium text-dark-hard md:text-[26px]">
                {data?.title}
              </h2> 
              <button
                onClick={handleFavoriteClick}
                className="bg-[#FF4A5A] p-2 rounded-full focus:outline-none"
              >
                {isFavorite ? (
                  <AiFillHeart className="text-white text-2xl" />
                ) : (
                  <AiOutlineHeart className="text-white text-2xl" /> 
                )}
              </button>
            </div>
            <p className="text-lg font-medium mt-2 text-dark-hard">
              {data?.region} ({data?.prefecture})
            </p>
            <p className="text-lg font-medium mt-2 text-dark-hard">
              Precio: {data?.price ? `${data.price} €` : "No disponible"}
            </p>
            <div className="w-full mt-4">
              <Editor content={body} editable={false} />
            </div>
            <ReviewsContainer
              reviews={data?.reviews}
              className="mt-10"
              logginedUserId={user?._id}
              experienceSlug={slug}
              jwt={jwt}  
            />
          </article>
          <div>
            <SuggestedExperiences
              header="Últimas experiencias"
              experiences={ExperiencesData?.data}
              tags={data?.tags}
              className="mt-8 lg:mt-0 lg:max-w-xs"
            />
            <div className="mt-7">
              <h2 className="font-medium text-dark-hard mb-4 md:text-xl">
                Compartir con:
              </h2>
              <SocialShareButtons
                url={encodeURI(window.location.href)}
                title={encodeURIComponent(data?.title)}
              />
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ExperienceDetailPage;