import React, { useState, useEffect } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts("", 1, 6),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-br ">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, ${theme.palette.primary.main}08 0%, transparent 50%), 
                           radial-gradient(circle at 70% 70%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="text-center mb-12 sm:mb-16 transition-all duration-1000"
          style={{
            transform: isLoaded ? "translateY(0)" : "translateY(30px)",
            opacity: isLoaded ? 1 : 0,
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full  mb-6">
            <span
              className="w-2 h-2 bg-gradient-to-r  rounded-full animate-pulse"
              style={{ background: theme.palette.primary.main }}
            ></span>
            <span className="text-sm font-medium ">Blog y noticias</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Navega nuestras últimas noticias
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl  max-w-2xl mx-auto leading-relaxed">
            Mantente al día con las últimas tendencias, consejos y
            descubrimientos sobre Japón
          </p>
        </div>

        {/* Articles Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 sm:mb-16 transition-all duration-1000 delay-300"
          style={{
            transform: isLoaded ? "translateY(0)" : "translateY(50px)",
            opacity: isLoaded ? 1 : 0,
          }}
        >
          {isLoading ? (
            [...Array(3)].map((item, index) => (
              <div
                key={index}
                className="transform transition-all duration-500"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: "fadeInUp 0.8s ease-out forwards",
                }}
              >
                <ArticleCardSkeleton className="w-full" />
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <ErrorMessage message="No se pudieron obtener los detalles de los artículos" />
              </div>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            data.data.slice(0, 3).map((post, index) => (
              <div
                key={post._id}
                className="transform transition-all duration-500 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: isLoaded
                    ? "fadeInUp 0.8s ease-out forwards"
                    : "none",
                }}
              >
                <ArticleCard
                  post={post}
                  currentUser={user}
                  token={jwt}
                  className="w-full h-full"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <p className=" text-lg font-medium">
                No hay artículos disponibles en este momento
              </p>
              <p className="text-sm mt-2">
                Vuelve pronto para ver nuevas publicaciones
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div
          className="text-center transition-all duration-1000 delay-600"
          style={{
            transform: isLoaded ? "translateY(0)" : "translateY(30px)",
            opacity: isLoaded ? 1 : 0,
          }}
        >
          {/* CTA Button */}
          <Link
            to="/blog"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.white,
              boxShadow: `0 8px 32px ${theme.palette.primary.main}30`,
            }}
          >
            <span className="text-lg relative z-10">
              Ver todos los artículos
            </span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:rotate-12 relative z-10">
              <FaArrowRight className="w-3 h-3" />
            </div>

            {/* Button shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
            </div>
          </Link>
        </div>

        {/* Featured Topics 
        <div
          className="mt-16 text-center transition-all duration-1000 delay-800"
          style={{
            transform: isLoaded ? "translateY(0)" : "translateY(30px)",
            opacity: isLoaded ? 1 : 0,
          }}
        >
          <p className="text-sm mb-4 font-medium">Temas populares:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Cultura japonesa",
              "Guías de viaje",
              "Gastronomía",
              "Festivales",
              "Consejos",
            ].map((topic, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: `${theme.palette.primary.main}10`,
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.primary.main}20`,
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>*/}
      </div>

      {/* Add fadeInUp keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Articles;
