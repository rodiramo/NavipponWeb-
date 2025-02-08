import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import ExperienceCard from "../../../components/ExperienceCard";
import { useQuery } from "@tanstack/react-query";
import { getAllExperiences } from "../../../services/index/experiences";
import { toast } from "react-hot-toast";
import ExperienceCardSkeleton from "../../../components/ExperienceCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import { Link } from "react-router-dom";
import { getUserFavorites } from "../../../services/index/favorites";
import { useTheme } from "@mui/material";

const Experiences = ({ user, token, onFavoriteToggle }) => {
  const [favorites, setFavorites] = useState([]);
  const theme = useTheme();

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

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllExperiences("", 1, 6),
    queryKey: ["experiences"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <section className="flex flex-col container mx-auto px-5 py-10">
      {/* Engaging Title */}
      <h2
        className="text-3xl mb-4 font-bold"
        style={{ color: theme.palette.text.primary }}
      >
        Descubre experiencias únicas
      </h2>

      {/* Short Description */}
      <p className="text-lg  mb-6">
        Desde la tranquilidad de un <b>onsen</b> tradicional hasta la energía
        vibrante de <b>Tokio</b>, aquí encontrarás experiencias inolvidables que
        harán de tu viaje a Japón algo extraordinario. ¡Explora y sumérgete en
        la cultura nipona!
      </p>

      {/* Experience Cards */}
      <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10 mt-3">
        {isLoading ? (
          [...Array(3)].map((item, index) => (
            <ExperienceCardSkeleton
              key={index}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        ) : isError ? (
          <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
        ) : (
          data?.data
            .slice(0, 3)
            .map((experience) => (
              <ExperienceCard
                key={experience._id}
                experience={experience}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                user={user}
                token={token}
                favorites={favorites}
                onFavoriteToggle={onFavoriteToggle}
              />
            ))
        )}
      </div>

      {/* Read More Button */}
      <Link
        to="/experience"
        className="mx-auto flex items-center gap-x-2 font-bold border-2 px-6 py-3 rounded-full transition-all duration-300"
        style={{
          borderColor: theme.palette.primary.main, // Primary border color
          color: theme.palette.primary.main, // Primary text color
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.palette.primary.main;
          e.target.style.color = theme.palette.primary.contrastText;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = theme.palette.primary.main;
        }}
      >
        <span>Leer más experiencias</span>
        <FaArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
};

export default Experiences;
