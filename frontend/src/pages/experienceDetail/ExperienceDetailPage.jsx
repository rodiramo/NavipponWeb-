import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
import useUser from "../../hooks/useUser"; // Usar el hook useUser

const ExperienceDetailPage = () => {
  const { slug } = useParams();
  const { user, jwt } = useUser(); // Obtener el usuario y el token del contexto
  const [breadCrumbsData, setbreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleExperience({ slug }),
    queryKey: ["experience", slug],
    onSuccess: (data) => {
      setbreadCrumbsData([
        { name: "Home", link: "/" },
        { name: "Experience", link: "/experience" },
        { name: "Detalle", link: `/experience/${data.slug}` },
      ]);
      setBody(parseJsonToHtml(data?.body));
    },
  });

  const { data: ExperiencesData } = useQuery({
    queryFn: () => getAllExperiences(),
    queryKey: ["experiences"],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              src={
                data?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo
                  : images.sampleExperienceImage
              }
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
            <h2 className="text-xl font-medium mt-4 text-dark-hard md:text-[26px]">
              {data?.title}
            </h2>
            <div className="w-full">
              {!isLoading && !isError && (
                <Editor content={body} editable={false} />
              )}
            </div>
            <ReviewsContainer
              reviews={data?.reviews}
              className="mt-10"
              logginedUserId={user?._id}
              experienceSlug={slug}
              jwt={jwt} // Pasar el token JWT al componente ReviewsContainer
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