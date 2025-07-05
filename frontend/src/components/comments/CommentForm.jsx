import React, { useState } from "react";
import {
  useTheme,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Fade,
} from "@mui/material";
import { Send, Cancel, Edit } from "@mui/icons-material";

const CommentForm = ({
  btnLabel,
  formSubmitHanlder,
  formCancelHandler = null,
  initialText = "",
  loading = false,
}) => {
  const [value, setValue] = useState(initialText);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

  const submitHandler = (e) => {
    e.preventDefault();
    if (value.trim()) {
      formSubmitHanlder(value);
      setValue("");
      setIsFocused(false);
    }
  };

  const handleCancel = () => {
    setValue(initialText);
    setIsFocused(false);
    if (formCancelHandler) {
      formCancelHandler();
    }
  };

  const maxLength = 1000;
  const remainingChars = maxLength - value.length;
  const isNearLimit = remainingChars < 100;
  const isOverLimit = remainingChars < 0;

  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      sx={{
        width: "100%",
      }}
    >
      <Paper
        elevation={isFocused ? 4 : 1}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          transition: "all 0.3s ease",
          backgroundColor: theme.palette.background.default,
          border: `2px solid ${
            isFocused ? theme.palette.primary.main : "transparent"
          }`,
          "&:hover": {
            elevation: 2,
            borderColor: theme.palette.primary.light,
          },
        }}
      >
        <Fade in={isFocused || value.length > 0}>
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Edit sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  fontSize: "0.875rem",
                }}
              >
                {initialText ? "Editando comentario" : "Escribiendo comentario"}
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Text Input Area */}
        <Box sx={{ p: 3 }}>
          <TextField
            multiline
            maxRows={8}
            placeholder={
              isFocused
                ? "Comparte tu opinión de manera respetuosa..."
                : "Deja tu comentario aquí..."
            }
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setValue(e.target.value);
              }
            }}
            onFocus={() => setIsFocused(true)}
            variant="standard"
            fullWidth
            disabled={loading}
            sx={{
              "& .MuiInput-underline": {
                "&:before": {
                  borderBottom: "none",
                },
                "&:after": {
                  borderBottom: "none",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "none",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: 1.6,
                color: theme.palette.text.primary,
                "&::placeholder": {
                  color: theme.palette.text.secondary,
                  opacity: 0.7,
                },
              },
              "& .Mui-focused": {
                "& .MuiInputBase-input": {
                  "&::placeholder": {
                    opacity: 0.5,
                  },
                },
              },
            }}
          />

          {/* Character Count - Show when focused or near limit */}
          <Fade in={isFocused || isNearLimit}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: isOverLimit
                    ? theme.palette.error.main
                    : isNearLimit
                      ? theme.palette.warning.main
                      : theme.palette.text.secondary,
                  fontWeight: isNearLimit ? 600 : 400,
                  fontSize: "0.75rem",
                }}
              >
                {remainingChars} caracteres restantes
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Action Buttons - Show when focused or has content */}
        <Fade in={isFocused || value.length > 0}>
          <Box
            sx={{
              px: 3,
              pb: 3,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {(formCancelHandler || isFocused) && (
              <Button
                onClick={handleCancel}
                variant="outlined"
                startIcon={<Cancel sx={{ fontSize: 18 }} />}
                disabled={loading}
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.secondary,
                  borderRadius: "24px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  order: { xs: 2, sm: 1 },
                  "&:hover": {
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    backgroundColor: `${theme.palette.error.main}08`,
                  },
                }}
              >
                Cancelar
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <Send sx={{ fontSize: 18 }} />
                )
              }
              disabled={loading || !value.trim() || isOverLimit}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                borderRadius: "24px",
                px: 4,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                order: { xs: 1, sm: 2 },
                minWidth: { xs: "auto", sm: "120px" },
                boxShadow: theme.shadows[2],
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: theme.shadows[4],
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  backgroundColor: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                  boxShadow: "none",
                  transform: "none",
                },
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "Enviando..." : btnLabel}
            </Button>
          </Box>
        </Fade>

        {/* Quick Actions Bar - Show when not focused and empty */}
        <Fade in={!isFocused && value.length === 0}>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1.5, sm: 2 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.background.default,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              }}
            >
              Haz clic para empezar a escribir
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                opacity: 0.6,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.7rem",
                }}
              >
                Máx. {maxLength} caracteres
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Paper>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: theme.shadows[4],
            }}
          >
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Publicando comentario...
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentForm;
