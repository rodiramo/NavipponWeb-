import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarRating from "../../../components/Stars";
import { images, stables } from "../../../constants";
import { Box, Typography, IconButton, Button, Chip } from "@mui/material";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { Star } from "lucide-react";
const CarouselExperiences = ({
  className,
  header,
  experiences,
  currentExperience,
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

  return (
    <Box className={`w-full rounded-lg p-4 ${className}`}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
      >
        {header}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          marginTop: "16px",
        }}
      >
        {selectedExperiences.map((item) => (
          <Box
            key={item._id}
            sx={{
              position: "relative",
              borderRadius: "16px",
              height: "400px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              backgroundColor: theme.palette.primary.white,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            {/* 🔹 Badges Section */}
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                left: "10px",
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
              }}
            >
              {item.badges?.map((badge, index) => (
                <Chip
                  key={index}
                  label={badge}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontSize: "0.75rem",
                    height: "24px",
                  }}
                />
              ))}
            </Box>

            {/* Image */}
            <Box sx={{ width: "100%", height: "200px", overflow: "hidden" }}>
              <img
                src={
                  item?.photo
                    ? stables.UPLOAD_FOLDER_BASE_URL + item?.photo
                    : images.sampleExperienceImage
                }
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Box
              sx={{
                padding: "0.5rem 2rem 2rem 2rem",
                backgroundColor: "white",
                textAlign: "center",
              }}
            >
              {" "}
              <Typography
                variant="p"
                sx={{
                  fontWeight: "100",
                  fontSize: "0.90rem",
                  color: theme.palette.secondary.medium,
                }}
              >
                {item.categories}
              </Typography>
              <h1
                className="text-3xl mb-2"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                  gap: 15,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {item?.title}{" "}
                <span
                  style={{
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                  }}
                  className="text-sm px-2 py-1 rounded-full"
                >
                  {item?.region}
                </span>
              </h1>{" "}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                mb={2}
              >
                <StarRating rating={item.ratings || 0} isEditable={false} />

                <Typography variant="body1" sx={{}}>
                  {item?.ratings || ""} ({item?.numReviews} Reseñas)
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.secondary.medium,
                  borderRadius: "10rem",
                  marginTop: "1rem",
                }}
                component={Link}
                to={`/experience/${item.slug}`}
              >
                Ver Detalles
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
        <IconButton onClick={handlePrevPage}>
          <CircleArrowLeft size={32} />
        </IconButton>
        <IconButton onClick={handleNextPage}>
          <CircleArrowRight size={32} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CarouselExperiences;
