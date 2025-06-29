import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import ExperienceCard from "../../../components/ExperienceCard";

const CarouselExperiences = ({
  className,
  header,
  experiences,
  currentExperience,
  user,
  token,
  onFavoriteToggle,
}) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredExperiences, setFilteredExperiences] = useState([]);

  useEffect(() => {
    if (experiences && experiences.length > 0 && currentExperience) {
      console.log("All Experiences:", experiences);
      console.log("Current Experience:", currentExperience);

      let filtered = experiences
        .filter((exp) => exp._id !== currentExperience._id) // Exclude current experience
        .map((exp) => {
          // 🔹 Determine why this experience is related
          const badges = [];
          if (exp.categories === currentExperience.categories)
            badges.push("Mismo Tipo");
          if (exp.budget === currentExperience.budget)
            badges.push("Mismo Presupuesto");
          if (exp.season?.some((s) => currentExperience.season?.includes(s)))
            badges.push("Misma Temporada");
          if (exp.region === currentExperience.region) {
            badges.push("Misma Región");
          }
          return { ...exp, badges }; // 🔹 Store badges in experience object
        });

      console.log("Filtered Experiences:", filtered);

      if (filtered.length === 0) {
        filtered = experiences
          .filter((exp) => exp._id !== currentExperience._id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 15);
      }

      setFilteredExperiences(filtered.slice(0, 15));
    }
  }, [experiences, currentExperience]);

  const experiencesPerPage = 3;
  const totalPages = Math.ceil(filteredExperiences.length / experiencesPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * experiencesPerPage;
  const selectedExperiences = filteredExperiences.slice(
    startIndex,
    startIndex + experiencesPerPage
  );

  // Default empty function if onFavoriteToggle is not provided
  const handleFavoriteToggle = onFavoriteToggle || (() => {});

  return (
    <Box className={`w-full rounded-lg p-4 ${className}`}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: theme.palette.primary.main,
          mb: 3,
          fontSize: "1.5rem",
        }}
      >
        {header}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          },
          marginBottom: 3,
        }}
      >
        {selectedExperiences.map((item) => (
          <Box key={item._id} sx={{ position: "relative" }}>
            {/* Relationship Badges - displayed above the card */}
            {item.badges && item.badges.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -8,
                  left: 8,
                  right: 8,
                  zIndex: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  justifyContent: "center",
                }}
              >
                {item.badges.slice(0, 2).map((badge, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {badge}
                  </Box>
                ))}
              </Box>
            )}

            {/* Use the consistent ExperienceCard component */}
            <ExperienceCard
              experience={item}
              user={user}
              token={token}
              className="w-full h-full"
              onFavoriteToggle={handleFavoriteToggle}
            />
          </Box>
        ))}
      </Box>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.white,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              "&.Mui-disabled": {
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.grey[500],
              },
            }}
          >
            <CircleArrowLeft size={24} />
          </IconButton>

          {/* Page indicator */}
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {currentPage + 1} de {totalPages}
          </Typography>

          <IconButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.white,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              "&.Mui-disabled": {
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.grey[500],
              },
            }}
          >
            <CircleArrowRight size={24} />
          </IconButton>
        </Box>
      )}

      {/* Show message if no related experiences found */}
      {filteredExperiences.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="body1">
            No se encontraron experiencias relacionadas
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CarouselExperiences;
