import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { MapPin } from "lucide-react";
import { stables, images } from "../../../../../constants";

// Enhanced Drag Preview Component
const ExperienceDragPreview = ({ experience, category }) => {
  const theme = useTheme();

  if (!experience) return null;

  const getCategoryColor = (cat) => {
    if (cat === "Hoteles") return theme.palette.secondary.medium;
    if (cat === "Atractivos") return theme.palette.secondary.medium;
    if (cat === "Restaurantes") return theme.palette.secondary.medium;
    return theme.palette.primary.main;
  };

  return (
    <Box
      sx={{
        width: 280,
        background: `linear-gradient(135deg, ${theme.palette.background.paper}98, ${theme.palette.background.paper}95)`,
        backdropFilter: "blur(20px)",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        border: `2px solid ${getCategoryColor(category)}80`,
        transform: "rotate(3deg)",
        animation: "dragFloat 0.6s ease-in-out infinite alternate",
        "@keyframes dragFloat": {
          "0%": { transform: "rotate(3deg) translateY(0px)" },
          "100%": { transform: "rotate(3deg) translateY(-4px)" },
        },
      }}
    >
      {/* Image Header */}
      <Box
        sx={{
          position: "relative",
          height: 120,
          background: `linear-gradient(135deg, ${getCategoryColor(
            category
          )}40, ${getCategoryColor(category)}60)`,
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${
              experience.photo
                ? stables.UPLOAD_FOLDER_BASE_URL + experience.photo
                : images.sampleFavoriteImage
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${getCategoryColor(
                category
              )}60, ${getCategoryColor(category)}40)`,
              backdropFilter: "blur(1px)",
            },
          }}
        />

        {/* Dragging Indicator */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 1s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)", opacity: 1 },
              "50%": { transform: "scale(1.1)", opacity: 0.8 },
            },
          }}
        ></Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.9rem",
          }}
        >
          {experience.title || "Experiencia sin título"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <MapPin size={12} color={theme.palette.text.secondary} />
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {experience.prefecture || "Ubicación desconocida"}
          </Typography>
        </Box>

        {/* Drag Instructions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${getCategoryColor(
              category
            )}15, ${getCategoryColor(category)}25)`,
            borderRadius: 2,
            py: 1,
            border: `1px solid ${getCategoryColor(category)}40`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: getCategoryColor(category),
              fontSize: "0.75rem",
              textAlign: "center",
              animation: "glow 2s ease-in-out infinite alternate",
              "@keyframes glow": {
                "0%": { opacity: 0.8 },
                "100%": { opacity: 1 },
              },
            }}
          >
            Arrastrando a itinerario
          </Typography>
        </Box>
      </Box>

      {/* Floating Elements for Extra Visual Flair */}
      <Box
        sx={{
          position: "absolute",
          top: -5,
          left: -5,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: getCategoryColor(category),
          animation: "float1 2s ease-in-out infinite",
          "@keyframes float1": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(3px, -3px) scale(1.2)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: -8,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: getCategoryColor(category),
          opacity: 0.7,
          animation: "float2 2.5s ease-in-out infinite",
          "@keyframes float2": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(-4px, 4px) scale(1.3)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          left: -3,
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: getCategoryColor(category),
          opacity: 0.5,
          animation: "float3 3s ease-in-out infinite",
          "@keyframes float3": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(2px, -2px) scale(1.5)" },
          },
        }}
      />
    </Box>
  );
};

export default ExperienceDragPreview;
