import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { images, stables } from "../../constants";
import {
  Facebook,
  Twitter,
  WhatsApp,
  LinkedIn,
  ContentCopy,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getSinglePost } from "../../services/index/posts";
import MainLayout from "../../components/MainLayout";
import SuggestedPosts from "./container/SuggestedPosts";
import CommentsContainer from "../../components/comments/CommentsContainer";
import ErrorMessage from "../../components/ErrorMessage";
import ArticleDetailSkeleton from "./components/ArticleDetailSkeleton";
import BreadcrumbBack from "../../components/BreadcrumbBack";
import useUser from "../../hooks/useUser";

import Editor from "../../components/editor/Editor";
const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { user, jwt } = useUser();
  const theme = useTheme();
  const [body, setBody] = useState(null);

  // Fetch Post
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      try {
        if (data?.body && typeof data.body === "string") {
          setBody(JSON.parse(data.body));
        } else {
          setBody(data?.body || "<p>Contenido no disponible.</p>");
        }
      } catch (error) {
        console.error("❌ Error parsing post body:", error.message);
        setBody("<p>Contenido no disponible.</p>");
      }
    },
  });

  // Fetch Other Posts
  const { data: postsData } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
      ) : (
        <Box sx={{ maxWidth: "900px", mx: "auto", py: 5, px: 3 }}>
          {/* Breadcrumb */}
          <BreadcrumbBack />

          {/* Post Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
              mt: 2,
            }}
          >
            {data?.title}
          </Typography>

          {/* Post Meta Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Author */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={data?.user?.avatar || "/default-avatar.jpg"}
                alt={data?.user?.name}
              />
              <Typography variant="body2" color="text.secondary">
                {data?.user?.name || "Autor desconocido"}
              </Typography>
            </Box>

            {/* Date */}
            <Typography variant="body2" color="text.secondary">
              {new Date(data?.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Box>

          {/* Post Image */}
          <Box
            sx={{
              width: "100%",
              my: 3,
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: theme.shadows[3],
            }}
          >
            <img
              className="rounded-xl w-full"
              src={
                data?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo
                  : images.samplePostImage
              }
              alt={data?.title}
            />
          </Box>

          {/* Categories as Chips */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 2 }}>
            {data?.categories?.map((category) => (
              <Chip
                key={category._id}
                label={category.title}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          {/* Post Content */}
          <div className="w-full">
            {!isLoading && !isError && (
              <Editor content={data?.body} editable={false} />
            )}
          </div>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Social Share */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Typography variant="h6">Compartir en:</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Facebook">
                <IconButton
                  color="primary"
                  component="a"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                  target="_blank"
                >
                  <Facebook />
                </IconButton>
              </Tooltip>
              <Tooltip title="Twitter">
                <IconButton
                  color="primary"
                  component="a"
                  href={`https://twitter.com/intent/tweet?url=${
                    window.location.href
                  }&text=${encodeURIComponent(data?.title)}`}
                  target="_blank"
                >
                  <Twitter />
                </IconButton>
              </Tooltip>
              <Tooltip title="WhatsApp">
                <IconButton
                  color="success"
                  component="a"
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    data?.title + " " + window.location.href
                  )}`}
                  target="_blank"
                >
                  <WhatsApp />
                </IconButton>
              </Tooltip>
              <Tooltip title="LinkedIn">
                <IconButton
                  color="primary"
                  component="a"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                  target="_blank"
                >
                  <LinkedIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copiar Link">
                <IconButton
                  color="secondary"
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Suggested Posts */}
          <SuggestedPosts
            header="Más artículos interesantes"
            posts={postsData?.data}
            tags={data?.tags}
          />

          {/* Comments Section */}
          <CommentsContainer
            comments={data?.comments}
            className="mt-10"
            logginedUserId={user?._id}
            postSlug={slug}
            jwt={jwt}
          />
        </Box>
      )}
    </MainLayout>
  );
};

export default ArticleDetailPage;
