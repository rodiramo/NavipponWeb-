// Modern Collaborative Notes.jsx
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
  Divider,
  Avatar,
  useTheme,
  IconButton,
  Chip,
  Checkbox,
  Tooltip,
  Fade,
  Zoom,
} from "@mui/material";
import {
  MessagesSquare,
  Send,
  CheckSquare,
  Square,
  Pin,
  Heart,
  Smile,
  Clock,
  Users,
  Plus,
} from "lucide-react";

const Notes = ({
  open,
  onClose,
  notes = [],
  newNote,
  setNewNote,
  onAddNote,
  onToggleCheck,
  onTogglePin,
  currentUser,
}) => {
  const theme = useTheme();
  const [noteType, setNoteType] = useState("message");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(noteType);
      setNoteType("message");
    }
  };

  // Group notes by date
  const groupedNotes = notes.reduce((groups, note) => {
    const date = new Date(note.date).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(note);
    return groups;
  }, {});

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }
  };

  const isCurrentUser = (note) => {
    return note.author?._id === currentUser?._id;
  };

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
          background: `linear-gradient(135deg, ${theme.palette.secondary.medium})`,
          color: "white",
          p: 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
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
              <MessagesSquare size={24} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Notas del equipo
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Colabora y organiza tareas juntos
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${notes.length} notas`}
            sx={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              fontWeight: 600,
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, display: "flex", flexDirection: "column", height: "500px" }}
      >
        {/* Notes Feed */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          {Object.keys(groupedNotes).length === 0 ? (
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
                <MessagesSquare size={40} opacity={0.5} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                ¡Empieza la conversación!
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 300 }}>
                Comparte notas, crea tareas y mantén a todo el equipo organizado
              </Typography>
            </Box>
          ) : (
            Object.entries(groupedNotes).map(([date, dayNotes]) => (
              <Box key={date} sx={{ mb: 4 }}>
                {/* Date Separator */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Divider sx={{ flex: 1 }} />
                  <Chip
                    label={formatDate(date)}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                      border: `1px solid ${theme.palette.primary.main}30`,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                  <Divider sx={{ flex: 1 }} />
                </Box>

                {/* Notes for this date */}
                {dayNotes.map((note, index) => (
                  <Zoom
                    in={true}
                    key={index}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: isCurrentUser(note)
                          ? "flex-end"
                          : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                          flexDirection: isCurrentUser(note)
                            ? "row-reverse"
                            : "row",
                        }}
                      >
                        {/* Avatar */}
                        <Avatar
                          src={note.author?.avatar}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: isCurrentUser(note)
                              ? theme.palette.primary.main
                              : theme.palette.secondary.main,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          {note.author?.name?.charAt(0)?.toUpperCase() || "A"}
                        </Avatar>

                        {/* Message Bubble */}
                        <Box
                          sx={{
                            position: "relative",
                            background:
                              note.type === "task"
                                ? `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.light}15)`
                                : isCurrentUser(note)
                                ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                                : `${theme.palette.background.paper}`,
                            color: isCurrentUser(note)
                              ? "white"
                              : theme.palette.text.primary,
                            borderRadius: 3,
                            p: 2,
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                            border:
                              note.type === "task"
                                ? `1px solid ${theme.palette.warning.main}30`
                                : isCurrentUser(note)
                                ? "none"
                                : `1px solid ${theme.palette.divider}`,
                            backdropFilter: "blur(10px)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          {/* Note Header */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            {note.type === "task" && (
                              <Tooltip
                                title={
                                  note.completed
                                    ? "Marcar como pendiente"
                                    : "Marcar como completada"
                                }
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => onToggleCheck?.(note._id)}
                                  sx={{
                                    p: 0.5,
                                    color: note.completed
                                      ? theme.palette.success.main
                                      : theme.palette.warning.main,
                                  }}
                                >
                                  {note.completed ? (
                                    <CheckSquare size={18} />
                                  ) : (
                                    <Square size={18} />
                                  )}
                                </IconButton>
                              </Tooltip>
                            )}

                            <Typography
                              variant="caption"
                              sx={{
                                opacity: 0.8,
                                fontWeight: 500,
                                color: isCurrentUser(note)
                                  ? "rgba(255,255,255,0.9)"
                                  : theme.palette.text.secondary,
                              }}
                            >
                              {note.author?.name} • {formatTime(note.date)}
                            </Typography>

                            {note.pinned && (
                              <Tooltip title="Nota fijada">
                                <Pin size={14} style={{ opacity: 0.7 }} />
                              </Tooltip>
                            )}
                          </Box>

                          {/* Note Content */}
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              lineHeight: 1.4,
                              textDecoration:
                                note.type === "task" && note.completed
                                  ? "line-through"
                                  : "none",
                              opacity:
                                note.type === "task" && note.completed
                                  ? 0.7
                                  : 1,
                            }}
                          >
                            {note.text}
                          </Typography>

                          {/* Note Type Badge */}
                          {note.type === "task" && (
                            <Chip
                              label={
                                note.completed ? "Completada" : "Pendiente"
                              }
                              size="small"
                              sx={{
                                mt: 1,
                                height: 20,
                                fontSize: "0.7rem",
                                background: note.completed
                                  ? `${theme.palette.success.main}20`
                                  : `${theme.palette.warning.main}20`,
                                color: note.completed
                                  ? theme.palette.success.main
                                  : theme.palette.warning.main,
                                border: `1px solid ${
                                  note.completed
                                    ? theme.palette.success.main
                                    : theme.palette.warning.main
                                }30`,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Zoom>
                ))}
              </Box>
            ))
          )}
        </Box>

        {/* Modern Input Section */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper}90, ${theme.palette.background.paper}70)`,
            backdropFilter: "blur(20px)",
            borderTop: `1px solid ${theme.palette.divider}40`,
          }}
        >
          {/* Note Type Selector */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip
              label="Mensaje"
              variant={noteType === "message" ? "filled" : "outlined"}
              onClick={() => setNoteType("message")}
              sx={{
                background:
                  noteType === "message"
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : "transparent",
                color:
                  noteType === "message" ? "white" : theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`,
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": {
                  background:
                    noteType === "message"
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                      : `${theme.palette.primary.main}10`,
                },
              }}
            />
            <Chip
              label=" Tarea"
              variant={noteType === "task" ? "filled" : "outlined"}
              onClick={() => setNoteType("task")}
              sx={{
                background:
                  noteType === "task"
                    ? `linear-gradient(135deg, ${theme.palette.warning.main})`
                    : "transparent",
                color:
                  noteType === "task" ? "white" : theme.palette.warning.main,
                border: `1px solid ${theme.palette.warning.main}`,
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": {
                  background:
                    noteType === "task"
                      ? `linear-gradient(135deg, ${theme.palette.warning.dark})`
                      : `${theme.palette.warning.main}10`,
                },
              }}
            />
          </Box>

          {/* Input Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={
                noteType === "task"
                  ? "Describe la tarea..."
                  : "Escribe un mensaje..."
              }
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
            <Tooltip
              title={`Enviar ${noteType === "task" ? "tarea" : "mensaje"}`}
            >
              <IconButton
                type="submit"
                disabled={!newNote.trim()}
                sx={{
                  width: 48,
                  height: 48,
                  background: newNote.trim()
                    ? `linear-gradient(135deg, ${theme.palette.primary.main})`
                    : theme.palette.grey[300],
                  color: "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: newNote.trim()
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark})`
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
                <Send size={20} />
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

export default Notes;
