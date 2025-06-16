// DateDisplay.jsx
// Place this in: ./components/DateDisplay.jsx (same folder as your other itinerary components)

import React from "react";
import { Box, Typography, IconButton, Tooltip, useTheme } from "@mui/material";
import { Calendar, Edit } from "lucide-react";

const DateDisplay = ({
  startDate,
  endDate,
  onEditClick,
  canEdit,
  boardCount,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        borderRadius: 30,
        px: 3,
        py: 1.5,
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Calendar size={20} color="white" />
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: "white",
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {startDate && endDate ? (
            <>
              {startDate.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
              {" - "}
              {endDate.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </>
          ) : (
            ""
          )}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.7rem",
          }}
        >
          {boardCount} {boardCount === 1 ? "día" : "días"} de viaje
        </Typography>
      </Box>
      {canEdit && (
        <Tooltip title="Cambiar fechas">
          <IconButton
            onClick={onEditClick}
            size="small"
            sx={{
              color: "white",
              ml: 1,
              "&:hover": {
                background: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <Edit size={16} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default DateDisplay;
