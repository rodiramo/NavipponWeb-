import React, { useState } from "react";
import { useTheme, Box, Button, TextareaAutosize } from "@mui/material";

const CommentForm = ({
  btnLabel,
  formSubmitHanlder,
  formCancelHandler = null,
  initialText = "",
  loading = false,
}) => {
  const [value, setValue] = useState(initialText);
  const theme = useTheme();

  const submitHandler = (e) => {
    e.preventDefault();
    formSubmitHanlder(value);
    setValue("");
  };

  return (
    <form onSubmit={submitHandler}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: theme.shape.borderRadius,
          p: 2,
        }}
      >
        <TextareaAutosize
          minRows={5}
          placeholder="Deja tu comentario aquí..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: "1rem",
            padding: "8px",
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column-reverse", sm: "row" },
            pt: 2,
          }}
        >
          {formCancelHandler && (
            <Button
              onClick={formCancelHandler}
              variant="outlined"
              sx={{
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                borderRadius: "30rem",
                px: 3,
                py: 1.2,
              }}
            >
              Cancelar
            </Button>
          )}
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.common.white,
              borderRadius: "30rem",
              px: 3,
              py: 1.2,
              "&:disabled": { opacity: 0.7, cursor: "not-allowed" },
            }}
          >
            {btnLabel}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default CommentForm;
