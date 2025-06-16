// DateChangeDialog.jsx
// Place this in: ./components/DateChangeDialog.jsx (same folder as your other itinerary components)

import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Divider,
  TextField,
  useTheme,
  Fade,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Calendar, CalendarCheck } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es"; // Spanish locale for dayjs

// Configure dayjs plugins and locale
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

const DateChangeDialog = ({
  open,
  onClose,
  currentStartDate,
  boardCount,
  onConfirm,
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(dayjs(currentStartDate));

  const handleConfirm = () => {
    if (selectedDate) {
      // Convert to local midnight to avoid timezone issues
      const localDate = selectedDate.startOf("day").toDate();

      // Alternative approach: Create date without timezone conversion
      const year = selectedDate.year();
      const month = selectedDate.month();
      const day = selectedDate.date();
      const dateWithoutTimezone = new Date(year, month, day);

      console.log("Selected date (dayjs):", selectedDate.format("YYYY-MM-DD"));
      console.log("Local date:", localDate);
      console.log("Date without timezone:", dateWithoutTimezone);

      // Use the dateWithoutTimezone to avoid timezone conversion issues
      onConfirm(dateWithoutTimezone);
      onClose();
    }
  };

  const endDate = selectedDate
    ? selectedDate.add(boardCount - 1, "day").toDate() // Fixed: should be boardCount - 1
    : new Date();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.paper}85)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          p: 4,
          textAlign: "center",
          position: "relative",
        }}
      >
        <Calendar
          size={48}
          color="white"
          style={{
            margin: "0 auto",
            marginBottom: 16,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "white",
            mb: 1,
          }}
        >
          Cambiar fechas del itinerario
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Selecciona la nueva fecha de inicio para tu viaje
        </Typography>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Box sx={{ mb: 3 }}>
            <DatePicker
              label="Fecha de inicio"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  },
                },
              }}
              minDate={dayjs()} // Can't select past dates
              // Add timezone handling
              timezone="system" // Use system timezone
            />
          </Box>
        </LocalizationProvider>

        {/* Date Range Preview */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background: `${theme.palette.info.main}10`,
            border: `1px solid ${theme.palette.info.main}30`,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.info.dark,
            }}
          >
            Vista previa del itinerario:
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {Array.from({ length: Math.min(boardCount, 5) }).map((_, index) => {
              const date = selectedDate
                ? selectedDate.add(index, "day").toDate()
                : new Date();

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Chip
                    label={`Día ${index + 1}`}
                    size="small"
                    sx={{
                      minWidth: 60,
                      background: theme.palette.primary.main,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="body2">
                    {date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              );
            })}
            {boardCount > 5 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontStyle: "italic", mt: 1 }}
              >
                ... y {boardCount - 5} días más
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2, opacity: 0.3 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <CalendarCheck size={18} color={theme.palette.success.main} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Fin del viaje:{" "}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {endDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 30,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            flex: 1,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedDate}
          sx={{
            borderRadius: 30,
            textTransform: "none",
            px: 4,
            py: 1.5,
            fontWeight: 700,
            flex: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
            },
          }}
        >
          Actualizar Fechas
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateChangeDialog;
