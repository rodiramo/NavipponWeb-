import React from "react";
import { Box, Typography, Chip, Tooltip } from "@mui/material";
import { Image, Eye } from "lucide-react";

// Enhanced Image Display Component with Sample Indicators
const ImageWithSampleIndicator = ({
  src,
  alt,
  isSample = false,
  category = "",
  style = {},
  theme,
  indicatorType = "overlay", // "overlay", "corner", "watermark", "border"
}) => {
  const baseImageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "30rem",
    objectFit: "cover",
    ...style,
  };

  // Overlay Indicator (Semi-transparent overlay)
  const OverlayIndicator = () => (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
        borderRadius: "30rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.9,
        transition: "opacity 0.3s ease",
        "&:hover": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "30rem",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: `1px solid ${theme.palette.primary.main}40`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Image size={18} color={theme.palette.primary.main} />
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            fontSize: "0.8rem",
          }}
        >
          Imagen de muestra
        </Typography>
      </Box>
    </Box>
  );

  // Corner Badge Indicator
  const CornerIndicator = () => (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 2,
      }}
    >
      <Tooltip title={`Imagen de muestra para ${category}`} arrow>
        <Chip
          icon={<Image size={14} />}
          label="Muestra"
          size="small"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.medium,
            fontSize: "0.7rem",
            fontWeight: 600,
            height: "24px",
            "& .MuiChip-icon": {
              color: theme.palette.secondary.medium,
            },
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        />
      </Tooltip>
    </Box>
  );

  // Watermark Style Indicator
  const WatermarkIndicator = () => (
    <Box
      sx={{
        position: "absolute",
        bottom: 12,
        left: 12,
        right: 12,
        background:
          "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
        borderRadius: "30rem",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Eye size={14} color="white" />
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.secondary.medium,
          fontWeight: 500,
          fontSize: "0.75rem",
        }}
      >
        Vista previa - {category}
      </Typography>
    </Box>
  );

  // Border with Badge Indicator
  const BorderIndicator = () => (
    <>
      {/* Top border badge */}
      <Box
        sx={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            background: theme.palette.secondary.main,
            color: theme.palette.secondary.medium,
            padding: "4px 12px",
            borderRadius: "30rem",
            fontSize: "0.7rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <Image size={12} />
          Imagen de muestra
        </Box>
      </Box>
    </>
  );

  if (!isSample) {
    return (
      <Box sx={{ position: "relative" }}>
        <img src={src} alt={alt} style={baseImageStyle} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        ...(indicatorType === "border" && {
          border: `2px dashed ${theme.palette.secondary.main}`,
          borderRadius: "14px",
          padding: "2px",
        }),
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          ...baseImageStyle,
          ...(indicatorType === "border" && {
            opacity: 0.9,
          }),
        }}
      />

      {indicatorType === "overlay" && <OverlayIndicator />}
      {indicatorType === "corner" && <CornerIndicator />}
      {indicatorType === "watermark" && <WatermarkIndicator />}
      {indicatorType === "border" && <BorderIndicator />}
    </Box>
  );
};

// Usage Examples Component
const SampleImageExamples = ({ theme }) => {
  const sampleImageUrl =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Indicadores de Imagen de Muestra
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 3,
          mt: 2,
        }}
      >
        {/* Overlay Style */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            1. Overlay con mensaje
          </Typography>
          <ImageWithSampleIndicator
            src={sampleImageUrl}
            alt="Hotel de muestra"
            isSample={true}
            category="Hoteles"
            theme={theme}
            indicatorType="overlay"
            style={{ height: "200px" }}
          />
        </Box>

        {/* Corner Badge */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            2. Badge en esquina
          </Typography>
          <ImageWithSampleIndicator
            src={sampleImageUrl}
            alt="Restaurante de muestra"
            isSample={true}
            category="Restaurantes"
            theme={theme}
            indicatorType="corner"
            style={{ height: "200px" }}
          />
        </Box>

        {/* Watermark */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            3. Marca de agua
          </Typography>
          <ImageWithSampleIndicator
            src={sampleImageUrl}
            alt="Atractivo de muestra"
            isSample={true}
            category="Atractivos"
            theme={theme}
            indicatorType="watermark"
            style={{ height: "200px" }}
          />
        </Box>

        {/* Border with Badge */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            4. Borde con badge
          </Typography>
          <ImageWithSampleIndicator
            src={sampleImageUrl}
            alt="Experiencia de muestra"
            isSample={true}
            category="Experiencias"
            theme={theme}
            indicatorType="border"
            style={{ height: "200px" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { ImageWithSampleIndicator, SampleImageExamples };
