// Modern Collaborative Checklist.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  useTheme,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  Zoom,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Target,
  Edit3,
  Save,
  X,
} from "lucide-react";

const Checklist = ({
  open,
  onClose,
  notes = [], // These are actually checklist items
  newNote,
  setNewNote,
  onAddNote,
  onToggleCheck,
  onDeleteItem,
  onEditItem,
  currentUser,
}) => {
  const theme = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Calculate progress
  const totalItems = notes.length;
  const completedItems = notes.filter((item) => item.completed).length;
  const progressPercentage =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote();
    }
  };

  const handleToggleComplete = (itemId) => {
    if (onToggleCheck) {
      onToggleCheck(itemId);
    }
  };

  const handleStartEdit = (item) => {
    if (isCurrentUser(item)) {
      setEditingId(item._id);
      setEditText(item.text);
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEditItem) {
      onEditItem(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (itemId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      onDeleteItem(itemId);
    }
  };

  const isCurrentUser = (item) => {
    return (
      item.author === currentUser?.name || item.author === currentUser?._id
    );
  };

  // Sort items: incomplete first, then completed
  const sortedItems = [...notes].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: "85vh",
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.paper}85)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          boxShadow: "0 32px 64px rgba(0,0,0,0.25)",
        },
      }}
    >
      {/* Modern Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: "white",
          p: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <Target size={24} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Lista de Tareas
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Organiza y completa tareas del viaje
              </Typography>
            </Box>
          </Box>

          {/* Progress Stats */}
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" fontWeight={700}>
              {completedItems}/{totalItems}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              completadas
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.2)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 4,
              },
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {Math.round(progressPercentage)}% completado
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, display: "flex", flexDirection: "column", height: "500px" }}
      >
        {/* Checklist Items */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {sortedItems.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                color: theme.palette.text.secondary,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Target size={40} opacity={0.5} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                ¡Crea tu primera tarea!
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 300 }}>
                Añade tareas importantes para organizar tu viaje perfectamente
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 2 }}>
              {sortedItems.map((item, index) => (
                <Zoom
                  in={true}
                  key={item._id || index}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <ListItem
                    sx={{
                      mb: 1,
                      borderRadius: 3,
                      background: item.completed
                        ? `linear-gradient(135deg, ${theme.palette.success.main}08, ${theme.palette.success.light}05)`
                        : `${theme.palette.background.paper}`,
                      border: `1px solid ${
                        item.completed
                          ? theme.palette.success.main + "30"
                          : theme.palette.divider
                      }`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        borderColor: item.completed
                          ? theme.palette.success.main
                          : theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <IconButton
                        onClick={() => handleToggleComplete(item._id)}
                        sx={{
                          color: item.completed
                            ? theme.palette.success.main
                            : theme.palette.grey[400],
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: item.completed
                              ? `${theme.palette.success.main}15`
                              : `${theme.palette.primary.main}15`,
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {item.completed ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <Circle size={24} />
                        )}
                      </IconButton>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        editingId === item._id ? (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveEdit();
                                }
                                if (e.key === "Escape") {
                                  handleCancelEdit();
                                }
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  fontSize: "1rem",
                                },
                              }}
                            />
                            <IconButton
                              onClick={handleSaveEdit}
                              size="small"
                              sx={{
                                color: theme.palette.success.main,
                                "&:hover": {
                                  backgroundColor: `${theme.palette.success.main}15`,
                                },
                              }}
                            >
                              <Save size={18} />
                            </IconButton>
                            <IconButton
                              onClick={handleCancelEdit}
                              size="small"
                              sx={{
                                color: theme.palette.error.main,
                                "&:hover": {
                                  backgroundColor: `${theme.palette.error.main}15`,
                                },
                              }}
                            >
                              <X size={18} />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            onClick={() => handleStartEdit(item)}
                            sx={{
                              textDecoration: item.completed
                                ? "line-through"
                                : "none",
                              opacity: item.completed ? 0.7 : 1,
                              fontWeight: 500,
                              color: item.completed
                                ? theme.palette.text.secondary
                                : theme.palette.text.primary,
                              cursor: isCurrentUser(item)
                                ? "pointer"
                                : "default",
                              transition: "all 0.2s ease",
                              "&:hover": isCurrentUser(item)
                                ? {
                                    color: theme.palette.primary.main,
                                    backgroundColor: `${theme.palette.primary.main}05`,
                                    borderRadius: 1,
                                    padding: "2px 4px",
                                  }
                                : {},
                            }}
                          >
                            {item.text}
                            {isCurrentUser(item) && (
                              <Edit3
                                size={14}
                                style={{
                                  marginLeft: "8px",
                                  opacity: 0.5,
                                  display: "inline",
                                }}
                              />
                            )}
                          </Typography>
                        )
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {typeof item.author === "string" &&
                            item.author.length === 24
                              ? `Usuario ${item.author.slice(-4)}`
                              : item.author}
                            {isCurrentUser(item) && (
                              <Chip
                                label="Tú"
                                size="small"
                                sx={{
                                  ml: 1,
                                  height: 16,
                                  fontSize: "0.65rem",
                                  background: `${theme.palette.info.main}20`,
                                  color: theme.palette.info.main,
                                }}
                              />
                            )}
                          </Typography>
                          {item.completed && (
                            <Chip
                              label="Completada"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                background: `${theme.palette.success.main}20`,
                                color: theme.palette.success.main,
                                border: `1px solid ${theme.palette.success.main}30`,
                              }}
                            />
                          )}
                        </Box>
                      }
                    />

                    {/* Action buttons - only show for current user's items */}
                    {isCurrentUser(item) && editingId !== item._id && (
                      <ListItemSecondaryAction>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Editar tarea">
                            <IconButton
                              onClick={() => handleStartEdit(item)}
                              sx={{
                                color: theme.palette.primary.main,
                                opacity: 0.7,
                                "&:hover": {
                                  opacity: 1,
                                  backgroundColor: `${theme.palette.primary.main}15`,
                                },
                              }}
                            >
                              <Edit3 size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar tarea">
                            <IconButton
                              onClick={() => handleDelete(item._id)}
                              sx={{
                                color: theme.palette.error.main,
                                opacity: 0.7,
                                "&:hover": {
                                  opacity: 1,
                                  backgroundColor: `${theme.palette.error.main}15`,
                                },
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                </Zoom>
              ))}
            </List>
          )}
        </Box>

        {/* Add New Item Section */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper}90, ${theme.palette.background.paper}70)`,
            backdropFilter: "blur(20px)",
            borderTop: `1px solid ${theme.palette.divider}40`,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}
          >
            <TextField
              fullWidth
              placeholder="Añadir nueva tarea..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: `${theme.palette.background.paper}95`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${theme.palette.divider}50`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: theme.palette.background.paper,
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused": {
                    background: theme.palette.background.paper,
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                  },
                },
              }}
            />
            <Tooltip title="Añadir tarea">
              <IconButton
                type="submit"
                disabled={!newNote.trim()}
                sx={{
                  width: 48,
                  height: 48,
                  background: newNote.trim()
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : theme.palette.grey[300],
                  color: "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: newNote.trim()
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                      : theme.palette.grey[400],
                    boxShadow: newNote.trim()
                      ? `0 8px 24px ${theme.palette.primary.main}40`
                      : "none",
                  },
                  "&:disabled": {
                    color: theme.palette.grey[500],
                  },
                }}
              >
                <Plus size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          background: `linear-gradient(135deg, ${theme.palette.background.paper}90, ${theme.palette.background.paper}70)`,
          backdropFilter: "blur(20px)",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 30,
            textTransform: "none",
            px: 4,
            fontWeight: 600,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.grey[400],
              background: `${theme.palette.grey[500]}10`,
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Checklist;
