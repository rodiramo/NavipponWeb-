import React from "react";
import PostForm from "../../../../components/PostForm";
import { useParams, useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import { ArrowLeft } from "lucide-react";

const PostFormPage = () => {
  const { slug } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ margin: "auto" }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          padding: "1rem ",
          borderRadius: "30rem",
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
          },
        }}
      >
        <ArrowLeft size={24} />
        Volver
      </IconButton>

      <PostForm slug={slug} open={true} onClose={() => navigate(-1)} />
    </Box>
  );
};

export default PostFormPage;
