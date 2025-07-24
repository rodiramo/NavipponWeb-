import React, { useState } from "react";
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
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Fade,
} from "@mui/material";
import {
  Save,
  Edit,
  CalendarDays,
  HandCoins,
  Download,
  ArrowLeft,
  Crown,
  Lock,
  Globe,
  ListCheck,
  MoreVertical,
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const endDate =
    startDate && boards?.length > 0
      ? new Date(
          new Date(startDate).setDate(
            new Date(startDate).getDate() + boards.length - 1
          )
        )
      : null;

  // Check permissions
  const canEdit = userRole === "owner" || userRole === "editor";
  const canManageTravelers = userRole === "owner";
  const canChangePrivacy = userRole === "owner";

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(false);
  };

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
    handleMenuClose();
  };

  const handleOfflineClick = () => {
    onOfflineClick();
    handleMenuClose();
  };

  return (
    <>
      <Box
        sx={{
          background: theme.palette.background.nav,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ py: { xs: 3, sm: 2 } }}>
            {/* MOBILE LAYOUT: Stack vertically for better UX */}
            {isMobile && (
              <>
                {/* Mobile: Back Button on its own line */}
                <Button
                  variant="outlined"
                  onClick={onBackClick}
                  startIcon={<ArrowLeft size={16} />}
                  size="small"
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "20px",
                    textTransform: "none",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    fontSize: "0.75rem",
                    px: 1.5,
                    py: 0.5,
                    mb: 2,
                    minWidth: "auto",
                    minHeight: 40,
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.5)",
                      backgroundColor: "rgba(255,255,255,0.2)",
                    },
                  }}
                />

                {/* Mobile: Title Section */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {/* Title */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                      justifyContent: "center",
                    }}
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
                        size="small"
                        sx={{
                          flex: 1,
                          maxWidth: "280px",
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 16,
                            border: `2px solid rgba(255,255,255,0.3)`,
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,1)",
                              border: `2px solid rgba(255,255,255,0.5)`,
                            },
                            "&.Mui-focused": {
                              backgroundColor: "rgba(255,255,255,1)",
                              border: `2px solid ${theme.palette.primary.main}`,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "12px 16px",
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
                        variant="h4"
                        component="h1"
                        sx={{
                          fontWeight: "bold",
                          color: "white",
                          cursor: canEdit ? "pointer" : "default",
                          fontSize: "1.5rem",
                          lineHeight: 1.2,
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
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

                    {canEdit && (
                      <IconButton
                        onClick={handleEditClick}
                        size="small"
                        sx={{
                          width: 36,
                          height: 36,
                          color: isEditingName
                            ? theme.palette.success.main
                            : "white",
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                          "&:hover": {
                            background: "rgba(255,255,255,0.25)",
                          },
                        }}
                      >
                        {isEditingName ? (
                          <Save size={16} />
                        ) : (
                          <Edit size={16} />
                        )}
                      </IconButton>
                    )}
                  </Box>

                  {/* Mobile: Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Travelers
                      travelers={travelers}
                      friendsList={friendsList}
                      onAddTraveler={
                        canManageTravelers ? onAddTraveler : undefined
                      }
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

                    <Tooltip title="Lista del viaje">
                      <IconButton
                        onClick={onNotesClick}
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          width: 44,
                          height: 44,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        <ListCheck size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Más opciones">
                      <IconButton
                        onClick={handleMenuClick}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.15)",
                          color: "white",
                          width: 44,
                          height: 44,
                          backdropFilter: "blur(10px)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.25)",
                          },
                        }}
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </>
            )}

            {/* DESKTOP/TABLET LAYOUT: Everything in one line */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { sm: 2, md: 3 },
                  width: "100%",
                  py: 1,
                }}
              >
                {/* Desktop: Back Button */}
                <Button
                  variant="outlined"
                  onClick={onBackClick}
                  startIcon={<ArrowLeft size={16} />}
                  size="small"
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "20px",
                    textTransform: "none",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.5,
                    minWidth: "auto",
                    minHeight: 32,
                    flexShrink: 0,
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.5)",
                      backgroundColor: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  Volver
                </Button>

                {/* Desktop: Title Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flex: 1,
                    minWidth: 0, // Allow text truncation
                  }}
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
                      size="small"
                      sx={{
                        flex: 1,
                        maxWidth: { sm: "300px", md: "400px" },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255,255,255,0.95)",
                          backdropFilter: "blur(20px)",
                          borderRadius: 20,
                          border: `2px solid rgba(255,255,255,0.3)`,
                          fontSize: { sm: "1.125rem", md: "1.25rem" },
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,1)",
                            border: `2px solid rgba(255,255,255,0.5)`,
                          },
                          "&.Mui-focused": {
                            backgroundColor: "rgba(255,255,255,1)",
                            border: `2px solid ${theme.palette.primary.main}`,
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "8px 12px",
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
                        fontSize: { sm: "1.5rem", md: "2rem", lg: "2.25rem" },
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        minWidth: 0,
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

                  {canEdit && (
                    <IconButton
                      onClick={handleEditClick}
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        color: isEditingName
                          ? theme.palette.success.main
                          : "white",
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        flexShrink: 0,
                        "&:hover": {
                          background: "rgba(255,255,255,0.25)",
                        },
                      }}
                    >
                      {isEditingName ? <Save size={16} /> : <Edit size={16} />}
                    </IconButton>
                  )}
                </Box>

                {/* Desktop: Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexShrink: 0,
                  }}
                >
                  <Travelers
                    travelers={travelers}
                    friendsList={friendsList}
                    onAddTraveler={
                      canManageTravelers ? onAddTraveler : undefined
                    }
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

                  <Tooltip title="Lista del viaje">
                    <IconButton
                      onClick={onNotesClick}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        width: 36,
                        height: 36,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <ListCheck size={16} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Más opciones">
                    <IconButton
                      onClick={handleMenuClick}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        width: 36,
                        height: 36,
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.25)",
                        },
                      }}
                    >
                      <MoreVertical size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}

            {/* Quick Info Bar - Always below main content */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-start" },
                gap: { xs: 1.5, sm: 1 },
                mt: { xs: 2.5, sm: 2 },
                mb: { xs: 2, sm: 1.5 },
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={<CalendarDays size={14} />}
                label={`${travelDays} días`}
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: { xs: "0.75rem", sm: "0.7rem" },
                  height: { xs: 28, sm: 24 },
                  backdropFilter: "blur(10px)",
                  "& .MuiChip-icon": { color: "white", width: 14, height: 14 },
                }}
              />
              <Chip
                icon={<HandCoins size={14} />}
                label={`¥ ${totalBudget.toLocaleString()}`}
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: { xs: "0.75rem", sm: "0.7rem" },
                  height: { xs: 28, sm: 24 },
                  backdropFilter: "blur(10px)",
                  "& .MuiChip-icon": { color: "white", width: 14, height: 14 },
                }}
              />
              <Chip
                icon={isPrivate ? <Lock size={12} /> : <Globe size={12} />}
                label={isPrivate ? "Privado" : "Público"}
                size="small"
                sx={{
                  backgroundColor: isPrivate
                    ? "rgba(255, 152, 0, 0.8)"
                    : "rgba(76, 175, 80, 0.8)",
                  color: "white",
                  fontSize: { xs: "0.75rem", sm: "0.7rem" },
                  height: { xs: 28, sm: 24 },
                  backdropFilter: "blur(10px)",
                  "& .MuiChip-icon": { color: "white", width: 12, height: 12 },
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Dropdown Menu - Same as before */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: theme.palette.background.paper,
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
            minWidth: { xs: 300, sm: 280 },
            maxWidth: "90vw",
          },
        }}
      >
        {/* Header Info */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Información del Viaje
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Crown size={16} color="gold" />
            <Typography variant="body2">
              Creado por: {creator?.name || "Desconocido"}
            </Typography>
          </Box>
          <Chip
            label={`Tu rol: ${myRole}`}
            size="small"
            color={userRole === "owner" ? "primary" : "default"}
            sx={{ fontSize: "0.75rem" }}
          />
        </Box>

        {/* Dates */}
        <MenuItem onClick={onEditDates} disabled={!canEditDates}>
          <ListItemIcon>
            <CalendarDays size={18} />
          </ListItemIcon>
          <ListItemText>
            <Box>
              <Typography variant="body2">Fechas del viaje</Typography>
              <Typography variant="caption" color="text.secondary">
                {startDate ? startDate.toLocaleDateString() : "Sin fecha"} -{" "}
                {endDate ? endDate.toLocaleDateString() : "Sin fecha"}
              </Typography>
            </Box>
          </ListItemText>
        </MenuItem>

        <Divider />

        {/* Privacy Toggle */}
        {canChangePrivacy && (
          <MenuItem>
            <ListItemIcon>
              {isPrivate ? <Lock size={18} /> : <Globe size={18} />}
            </ListItemIcon>
            <ListItemText>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">
                  {isPrivate ? "Itinerario Privado" : "Itinerario Público"}
                </Typography>
                <Switch
                  checked={isPrivate}
                  onChange={handlePrivacyChange}
                  size="small"
                />
              </Box>
            </ListItemText>
          </MenuItem>
        )}

        {/* Offline/PDF */}
        {hasOfflinePermission && (
          <MenuItem onClick={handleOfflineClick}>
            <ListItemIcon>
              <Download size={18} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Descargar PDF</Typography>
            </ListItemText>
          </MenuItem>
        )}

        <Divider />

        {/* Info */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {travelDays} días • ¥{totalBudget.toLocaleString()} presupuesto
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default ItineraryHeader;
