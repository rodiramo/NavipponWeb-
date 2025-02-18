import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useTheme } from "@mui/material";
import ArticleCard from "../../../components/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../../services/index/posts";
import { toast } from "react-hot-toast";
import ArticleCardSkeleton from "../../../components/ArticleCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import { Link } from "react-router-dom";
import useUser from "../../../hooks/useUser";

const Articles = () => {
  const theme = useTheme();
  const { user, jwt } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts("", 1, 6),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <section className="flex flex-col container mx-auto px-5 py-10">
      <h2 className="text-3xl mb-4">Navega nuestras últimas noticias</h2>
      <div className=" flex flex-wrap md:gap-x-5 gap-y-5 pb-10 mt-3">
        {isLoading ? (
          [...Array(3)].map((item, index) => (
            <ArticleCardSkeleton
              key={index}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        ) : isError ? (
          <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
        ) : (
          data?.data
            .slice(0, 3)
            .map((post) => (
              <ArticleCard
                key={post._id}
                post={post}
                currentUser={user}
                token={jwt}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
        )}
      </div>
      <Link
        to="/blog"
        className="mx-auto flex items-center gap-x-2 font-bold border-2 px-6 py-3 rounded-full transition-all duration-300"
        style={{
          borderColor: theme.palette.primary.main, // Primary border color
          color: theme.palette.primary.main, // Primary text color
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.palette.primary.main;
          e.target.style.color = theme.palette.primary.white;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = theme.palette.primary.main;
        }}
      >
        <span>Leer más artículos</span>
        <FaArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
};

export default Articles;
