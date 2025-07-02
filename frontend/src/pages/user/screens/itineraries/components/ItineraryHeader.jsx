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
  Tooltip,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import {
  Save,
  Edit,
  CalendarDays,
  HandCoins,
  Download,
  MessagesSquare,
  ArrowLeft,
  Crown,
  Lock,
  Globe,
} from "lucide-react";
import Travelers from "./Travelers";
import DateDisplay from "./DateDisplay";

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
  onOfflineClick,
  hasOfflinePermission = true,
  travelers,
  friendsList,
  onAddTraveler,
  onUpdateTraveler,
  onRemoveTraveler,
  onNotesClick,
  onBackClick,
  userRole = "viewer",
  currentUserId,
  startDate,
  boards,
  onEditDates,
  canEditDates,
  // NEW PROPS FOR PRIVACY
  isPrivate = false,
  onPrivacyToggle,
}) => {
  const theme = useTheme();
  const endDate =
    startDate && boards?.length > 0
      ? new Date(
          new Date(startDate).setDate(
            new Date(startDate).getDate() + boards.length - 1
          )
        )
      : null;

  // Check if user can edit (owners and editors)
  const canEdit = userRole === "owner" || userRole === "editor";
  // Check if user can manage travelers (only owners)
  const canManageTravelers = userRole === "owner";
  // Only owners can change privacy settings
  const canChangePrivacy = userRole === "owner";

  const handleNameClick = () => {
    if (canEdit) {
      setIsEditingName(true);
    }
  };

  const handleEditClick = () => {
    if (canEdit) {
      if (isEditingName) {
        handleSaveName();
      } else {
        setIsEditingName(true);
      }
    }
  };

  const handlePrivacyChange = (event) => {
    if (canChangePrivacy && onPrivacyToggle) {
      onPrivacyToggle(event.target.checked);
    }
  };

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
                {isEditingName && canEdit ? (
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
                      cursor: canEdit ? "pointer" : "default",
                      fontSize: { xs: "1.75rem", md: "2.5rem" },
                      lineHeight: 1.2,
                      "&:hover": canEdit
                        ? {
                            opacity: 0.8,
                          }
                        : {},
                    }}
                    onClick={handleNameClick}
                  >
                    {name || "Nuevo Itinerario"}
                  </Typography>
                )}

                {/* Only show edit button for users who can edit */}
                {canEdit && (
                  <Tooltip title={isEditingName ? "Guardar" : "Editar nombre"}>
                    <IconButton
                      onClick={handleEditClick}
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
                )}
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

                <Chip
                  label={`Tu rol: ${myRole}`}
                  size="small"
                  sx={{
                    backgroundColor:
                      userRole === "owner"
                        ? theme.palette.primary.main
                        : userRole === "editor"
                          ? theme.palette.primary.main
                          : "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 500,
                    backdropFilter: "blur(10px)",
                  }}
                />

                {/* NEW: Privacy Status Chip */}
                <Chip
                  icon={isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                  label={isPrivate ? "Privado" : "Público"}
                  size="small"
                  sx={{
                    backgroundColor: isPrivate
                      ? "rgba(255, 152, 0, 0.8)" // Orange for private
                      : "rgba(76, 175, 80, 0.8)", // Green for public
                    color: "white",
                    fontWeight: 500,
                    backdropFilter: "blur(10px)",
                    "& .MuiChip-icon": {
                      color: "white",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Center Section - Stats and Privacy Toggle */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                order: { xs: 3, lg: 2 },
                alignItems: { xs: "flex-start", lg: "center" },
              }}
            >
              {/* Stats Row */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <DateDisplay
                  startDate={startDate}
                  endDate={endDate}
                  onEditClick={onEditDates}
                  canEdit={canEditDates}
                  boardCount={boards?.length || 0}
                />
                <Chip
                  icon={
                    <CalendarDays
                      size={18}
                      color={theme.palette.primary.dark}
                    />
                  }
                  label={`${travelDays} ${travelDays === 1 ? "Día" : "Días"}`}
                  sx={{
                    borderRadius: "30px",
                    color: theme.palette.primary.dark,
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    height: 40,
                    backgroundColor: theme.palette.primary.light,
                    backdropFilter: "blur(10px)",
                    "& .MuiChip-icon": {
                      color: theme.palette.primary.dark,
                    },
                  }}
                />

                <Chip
                  icon={
                    <HandCoins size={18} color={theme.palette.success.dark} />
                  }
                  label={`¥ ${totalBudget.toLocaleString()}`}
                  sx={{
                    borderRadius: "30px",
                    color: theme.palette.success.dark,
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    height: 40,
                    backgroundColor: theme.palette.success.lightest,
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    "& .MuiChip-icon": {
                      color: theme.palette.secondary.main,
                    },
                  }}
                />
              </Box>

              {/* NEW: Privacy Toggle - Only visible to owners */}
              {canChangePrivacy && (
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "25px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    px: 2,
                    py: 0.5,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isPrivate}
                        onChange={handlePrivacyChange}
                        size="small"
                        sx={{
                          "& .MuiSwitch-switchBase": {
                            color: "white",
                            "&.Mui-checked": {
                              color: theme.palette.warning.main,
                              "& + .MuiSwitch-track": {
                                backgroundColor: theme.palette.warning.main,
                                opacity: 0.8,
                              },
                            },
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor: theme.palette.success.main,
                            opacity: 0.6,
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {isPrivate ? (
                          <Lock size={16} color="white" />
                        ) : (
                          <Globe size={16} color="white" />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "white",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                          }}
                        >
                          {isPrivate ? "Privado" : "Público"}
                        </Typography>
                      </Box>
                    }
                    labelPlacement="start"
                    sx={{
                      margin: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </Paper>
              )}
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
                  onAddTraveler={canManageTravelers ? onAddTraveler : undefined}
                  onUpdateTraveler={
                    canManageTravelers ? onUpdateTraveler : undefined
                  }
                  onRemoveTraveler={
                    canManageTravelers ? onRemoveTraveler : undefined
                  }
                  creator={creator}
                  userRole={userRole}
                  currentUserId={currentUserId}
                />
              </Box>
              {hasOfflinePermission && (
                <Tooltip title="PDF & Offline">
                  <IconButton
                    onClick={onOfflineClick}
                    sx={{
                      padding: 2,
                      border: "50%",
                      background:
                        "linear-gradient(rgba(228, 135, 155, 0.38), rgba(235, 157, 188, 0.41))",
                    }}
                  >
                    <Download size={20} color={theme.palette.primary.light} />
                  </IconButton>
                </Tooltip>
              )}
              {/* Notes Button - Available to all users */}
              <Tooltip title="Notas del viaje">
                <IconButton
                  onClick={onNotesClick}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    padding: 2,
                    border: "50%",
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
                  <MessagesSquare size={20} />
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
