import React, { useEffect, useState } from "react";

import ExperienceCard from "../../../components/ExperienceCard";
import { useQuery } from "@tanstack/react-query";
import { getAllExperiences } from "../../../services/index/experiences";
import { toast } from "react-hot-toast";
import ExperienceCardSkeleton from "../../../components/ExperienceCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import { Link } from "react-router-dom";
import { getUserFavorites } from "../../../services/index/favorites";
import { useTheme } from "@mui/material";
import useUser from "../../../hooks/useUser"; // Import the useUser hook

const Experiences = ({ onFavoriteToggle }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const theme = useTheme();

  // Get user and token directly from the hook instead of props
  const { user, jwt: token } = useUser();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && token) {
        try {
          const favorites = await getUserFavorites({ userId: user._id, token });
          setFavorites(favorites.map((fav) => fav.experienceId._id));
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      }
    };

    fetchFavorites();
  }, [user, token, onFavoriteToggle]);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllExperiences("", 1, 6),
    queryKey: ["experiences"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  // Debug logging to help identify the issue
  console.log("Experiences component - Auth state:", {
    user: !!user,
    userId: user?._id,
    token: !!token,
    userObject: user,
  });

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-br">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.main}08 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Experiencias destacadas</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r bg-clip-text">
              Descubre experiencias{" "}
            </span>
            <span
              className="bg-clip-text"
              style={{
                color: theme.palette.primary.main,
              }}
            >
              únicas
            </span>
          </h2>

          {/* Description */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl leading-relaxed">
              Desde la tranquilidad de un{" "}
              <span
                className="font-semibold"
                style={{ color: theme.palette.primary.main }}
              >
                onsen
              </span>{" "}
              tradicional hasta la energía vibrante de{" "}
              <span
                className="font-semibold"
                style={{ color: theme.palette.secondary.medium }}
              >
                Tokio
              </span>
              , aquí encontrarás experiencias inolvidables que harán de tu viaje
              a Japón algo extraordinario.
            </p>
          </div>
        </div>

        {/* Experience Cards Grid */}
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
                <ExperienceCardSkeleton className="w-full" />
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full flex justify-center">
              <ErrorMessage message="Error al cargar las experiencias" />
            </div>
          ) : data?.data && Array.isArray(data.data) && data.data.length > 0 ? (
            data.data.slice(0, 3).map((experience, index) => (
              <div
                key={experience._id}
                className="transform transition-all duration-500 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: isLoaded
                    ? "fadeInUp 0.8s ease-out forwards"
                    : "none",
                }}
              >
                <ExperienceCard
                  experience={experience}
                  className="w-full h-full"
                  user={user}
                  token={token}
                  favorites={favorites}
                  onFavoriteToggle={onFavoriteToggle}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No experiences found</p>
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
          {/* Login message - Fixed logic */}
          {(!user || !token) && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Debes iniciar sesión para agregar a favoritos</span>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Link
            to="/experience"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold hover:shadow-xl active:scale-95 relative overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              boxShadow: `0 8px 32px ${theme.palette.primary.main}30`,
            }}
          >
            <span className="text-lg relative z-10">
              Ver todas las experiencias
            </span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:rotate-12">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </Link>
        </div>
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

export default Experiences;
