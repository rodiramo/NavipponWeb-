// Improved ItineraryHeader.jsx - Better styling and layout
import React from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Button,
  useTheme,
  Container,
  Avatar,
  AvatarGroup,
  Tooltip,
} from "@mui/material";
import {
  Save,
  Edit,
  CalendarDays,
  Wallet,
  MessagesSquare,
  ArrowLeft,
  Users,
  Crown,
} from "lucide-react";
import Travelers from "./Travelers";

const ItineraryHeader = ({
  name,
  setName,
  isEditingName,
  setIsEditingName,
  handleSaveName,
  creator,
  isInvited,
  myRole,
  travelDays,
  totalBudget,
  travelers,
  friendsList,
  onAddTraveler,
  onUpdateTraveler,
  onRemoveTraveler,
  onNotesClick,
  onBackClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.background.nav,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ py: { xs: 3, md: 4 } }}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              onClick={onBackClick}
              startIcon={<ArrowLeft size={18} />}
              sx={{
                borderColor: "rgba(255,255,255,0.3)",
                color: "white",
                borderRadius: "25px",
                textTransform: "none",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.5)",
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              Volver
            </Button>
          </Box>

          {/* Main Header Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: { xs: "flex-start", lg: "center" },
              justifyContent: "space-between",
              gap: { xs: 3, lg: 2 },
            }}
          >
            {/* Left Section - Title and Creator Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Title Section */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                {isEditingName ? (
                  <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveName();
                      }
                      if (e.key === "Escape") {
                        setIsEditingName(false);
                      }
                    }}
                    autoFocus
                    variant="outlined"
                    placeholder="Nombre del itinerario..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(20px)",
                        borderRadius: 30,
                        border: "none",
                        fontSize: { xs: "1rem", md: "1.5rem" },
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,1)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255,255,255,1)",
                        },
                        "& fieldset": {
                          border: "none",
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "10px 15px",
                        "&::placeholder": {
                          color: theme.palette.text.secondary,
                          opacity: 0.7,
                          fontStyle: "italic",
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      cursor: "pointer",
                      fontSize: { xs: "1.75rem", md: "2.5rem" },
                      lineHeight: 1.2,
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                    onClick={() => setIsEditingName(true)}
                  >
                    {name || "Nuevo Itinerario"}
                  </Typography>
                )}

                <Tooltip title={isEditingName ? "Guardar" : "Editar nombre"}>
                  <IconButton
                    onClick={
                      isEditingName
                        ? handleSaveName
                        : () => setIsEditingName(true)
                    }
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      width: 48,
                      height: 48,
                      color: isEditingName
                        ? theme.palette.success.dark
                        : "white",
                      background: isEditingName
                        ? `linear-gradient(135deg, ${theme.palette.success.light})`
                        : "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        color: isEditingName ? "white" : "white",
                        background: isEditingName
                          ? `linear-gradient(135deg, ${theme.palette.success.main})`
                          : "rgba(255,255,255,0.25)",
                      },
                    }}
                  >
                    {isEditingName ? <Save size={22} /> : <Edit size={22} />}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Creator and Role Info */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {creator && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Crown size={16} color="gold" />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 500,
                      }}
                    >
                      Creado por: {creator.name}
                    </Typography>
                  </Box>
                )}

                {isInvited && (
                  <Chip
                    label={`Tu rol: ${myRole}`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 500,
                      backdropFilter: "blur(10px)",
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Center Section - Stats */}
            <Box
              sx={{
                display: "flex",
                gap: 2,

                order: { xs: 3, lg: 2 },
              }}
            >
              <Chip
                icon={
                  <CalendarDays
                    size={18}
                    color={theme.palette.secondary.medium}
                  />
                }
                label={`${travelDays} ${travelDays === 1 ? "Día" : "Días"}`}
                sx={{
                  borderRadius: "30px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  height: 40,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "& .MuiChip-icon": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />

              <Chip
                icon={<Wallet size={18} color={theme.palette.success.main} />}
                label={`€${totalBudget.toLocaleString()}`}
                sx={{
                  borderRadius: "30px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  height: 40,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "& .MuiChip-icon": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            </Box>

            {/* Right Section - Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                order: { xs: 2, lg: 3 },
              }}
            >
              {/* Travelers Section */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Travelers
                  travelers={travelers}
                  friendsList={friendsList}
                  onAddTraveler={onAddTraveler}
                  onUpdateTraveler={onUpdateTraveler}
                  onRemoveTraveler={onRemoveTraveler}
                />
              </Box>

              {/* Notes Button */}
              <Tooltip title="Notas del viaje">
                <IconButton
                  onClick={onNotesClick}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <MessagesSquare size={24} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ItineraryHeader;
