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
            {/* Left: Back Button */}
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
                px: { xs: 1.5, sm: 2 },
                py: 0.5,
                mb: { xs: 2, sm: 1 },
                minWidth: "auto",
                minHeight: { xs: 40, sm: 32 },
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.5)",
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              {isMobile ? "" : "Volver"}
            </Button>

            <Box
              sx={{
                display: "flex",
                pt: { xs: 1, sm: 2 },
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              {/* Center: Title */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  justifyContent: { xs: "center", sm: "flex-start" },
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
                      maxWidth: { xs: "280px", sm: "400px" },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(20px)",
                        borderRadius: { xs: 16, sm: 20 },
                        border: `2px solid rgba(255,255,255,0.3)`,
                        fontSize: { xs: "1rem", sm: "1.25rem" },
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
                        padding: { xs: "12px 16px", sm: "8px 12px" },
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
                    variant={isMobile ? "h4" : "h3"}
                    component="h1"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      cursor: canEdit ? "pointer" : "default",
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
                      lineHeight: 1.2,
                      textAlign: { xs: "center", sm: "left" },
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
                      width: { xs: 36, sm: 32 },
                      height: { xs: 36, sm: 32 },
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
                    {isEditingName ? <Save size={16} /> : <Edit size={16} />}
                  </IconButton>
                )}
              </Box>

              {/* Right: Travelers + Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 2, sm: 1.5 },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                {/* Travelers Avatar Group */}
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

                {/* Notes Button */}
                <Tooltip title="Lista del viaje">
                  <IconButton
                    onClick={onNotesClick}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      width: { xs: 44, sm: 36 },
                      height: { xs: 44, sm: 36 },
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <ListCheck size={isMobile ? 18 : 16} />
                  </IconButton>
                </Tooltip>

                {/* Menu Button */}
                <Tooltip title="Más opciones">
                  <IconButton
                    onClick={handleMenuClick}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "white",
                      width: { xs: 44, sm: 36 },
                      height: { xs: 44, sm: 36 },
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.25)",
                      },
                    }}
                  >
                    <MoreVertical size={isMobile ? 18 : 16} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Quick Info Bar - Minimal */}
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

      {/* Dropdown Menu */}
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
