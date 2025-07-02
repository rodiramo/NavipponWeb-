import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { Clock } from "lucide-react";

// Enhanced Schedule Display Component
const ScheduleDisplay = ({ schedule, theme }) => {
  // Function to parse and format the schedule string
  const parseSchedule = (scheduleString) => {
    if (!scheduleString) return [];

    // Split by day names (Spanish)
    const dayPattern =
      /(lunes|martes|miércoles|jueves|viernes|sábado|domingo):\s*/gi;
    const parts = scheduleString.split(dayPattern).filter(Boolean);

    const schedule = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1]) {
        const day = parts[i].trim();
        const hours = parts[i + 1]
          .split(/(?=lunes|martes|miércoles|jueves|viernes|sábado|domingo)/i)[0]
          .trim();

        schedule.push({
          day: day.charAt(0).toUpperCase() + day.slice(1), // Capitalize first letter
          hours: hours,
        });
      }
    }

    return schedule;
  };

  // Check if today matches any day
  const getTodayStatus = () => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    return dayNames[today];
  };

  const scheduleItems = parseSchedule(schedule);
  const todayName = getTodayStatus();

  if (scheduleItems.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 1.5,
          px: 2,
          backgroundColor: `${theme.palette.primary.main}05`,
          borderRadius: 2,
          border: `1px solid ${theme.palette.primary.main}15`,
          mb: 1,
        }}
      >
        <Box
          sx={{
            color: theme.palette.primary.main,
            mr: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Clock size={18} />
        </Box>
        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
          {schedule}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 1.5,
        px: 2,
        backgroundColor: `${theme.palette.primary.main}05`,
        borderRadius: 2,
        border: `1px solid ${theme.palette.primary.main}15`,
        mb: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: `${theme.palette.primary.main}10`,
          transform: "translateX(2px)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            color: theme.palette.primary.main,
            mr: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Clock size={18} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          Horarios de Atención
        </Typography>
      </Box>

      {/* Schedule Items */}
      <Box sx={{ pl: 4 }}>
        {scheduleItems.map((item, index) => {
          const isToday = item.day.toLowerCase() === todayName;
          const isClosed = item.hours.toLowerCase().includes("cerrado");

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.5,
                px: 1,
                mb: 0.5,
                borderRadius: 1,
                backgroundColor: isToday
                  ? `${theme.palette.secondary.medium}15`
                  : "transparent",
                border: isToday
                  ? `1px solid ${theme.palette.secondary.medium}30`
                  : "1px solid transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isToday
                    ? `${theme.palette.secondary.medium}20`
                    : `${theme.palette.grey[50]}`,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? 600 : 400,
                    color: isToday
                      ? theme.palette.secondary.medium
                      : theme.palette.text.primary,
                    minWidth: "80px",
                  }}
                >
                  {item.day}:
                </Typography>
                {isToday && (
                  <Chip
                    label="Hoy"
                    size="small"
                    sx={{
                      height: "20px",
                      fontSize: "0.7rem",
                      backgroundColor: theme.palette.secondary.medium,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: isClosed
                    ? theme.palette.error.main
                    : theme.palette.text.secondary,
                  fontWeight: isClosed ? 500 : 400,
                  backgroundColor: isClosed
                    ? `${theme.palette.error.main}10`
                    : "transparent",
                  px: isClosed ? 1 : 0,
                  py: isClosed ? 0.25 : 0,
                  borderRadius: isClosed ? 0.5 : 0,
                  fontSize: "0.875rem",
                }}
              >
                {item.hours}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Current Status */}
      <Box
        sx={{
          mt: 2,
          pt: 1.5,
          borderTop: `1px solid ${theme.palette.primary.main}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {(() => {
          const todaySchedule = scheduleItems.find(
            (item) => item.day.toLowerCase() === todayName
          );

          if (!todaySchedule) {
            return (
              <Chip
                label="Horario no disponible"
                size="small"
                sx={{
                  backgroundColor: theme.palette.grey[200],
                  color: theme.palette.text.secondary,
                  fontSize: "0.75rem",
                }}
              />
            );
          }

          const isClosed = todaySchedule.hours
            .toLowerCase()
            .includes("cerrado");

          return (
            <Chip
              label={
                isClosed ? `Cerrado hoy` : `Abierto: ${todaySchedule.hours}`
              }
              size="small"
              sx={{
                backgroundColor: isClosed
                  ? theme.palette.error.light
                  : theme.palette.success.light,
                color: isClosed
                  ? theme.palette.error.dark
                  : theme.palette.success.dark,
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            />
          );
        })()}
      </Box>
    </Box>
  );
};

export default ScheduleDisplay;
