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
  Button,
  useTheme,
} from "@mui/material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { toggleFriend } from "../../services/index/users";
import { toast } from "react-hot-toast";
import { images, stables } from "../../constants";
import {
  Facebook,
  Twitter,
  WhatsApp,
  LinkedIn,
  ContentCopy,
  Favorite,
  PersonAdd,
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

const ArticleDetailPage = (token) => {
  const { slug } = useParams();
  const { user, jwt } = useUser();
  const theme = useTheme();
  const primaryDark = theme.palette.primary.dark;
  const primaryLight = theme.palette.primary.light;
  const [friends, setFriends] = useState({});
  const [body, setBody] = useState(null);
  const [tags, setTags] = useState([]); // ✅ Fix: State to hold tags

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
        console.log("✅ Post Data:", data);
        console.log("✅ Tags:", data?.tags);

        setTags(data?.tags || []);
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
  useEffect(() => {
    if (data?.tags && Array.isArray(data.tags)) {
      setTags(data.tags);
    } else {
      setTags([]); // Default to empty array
    }
  }, [data?.tags]);
  // 🔹 Toggle Friend Status
  const handleFriendToggle = async (userId) => {
    try {
      await toggleFriend({ userId, token });

      setFriends((prev) => {
        const updatedFriends = { ...prev, [userId]: !prev[userId] };
        localStorage.setItem("friends", JSON.stringify(updatedFriends)); // ✅ Update Local Storage
        return updatedFriends;
      });

      toast.success(
        friends[userId] ? "Eliminado de amigos" : "Agregado a amigos"
      );
    } catch (error) {
      toast.error("Error al actualizar amigos");
      console.error(error);
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
      ) : (
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            py: 15,
            px: 3,
            display: "flex",
            gap: 4,
          }}
        >
          {/* Main Content */}
          <Box sx={{ flex: 3 }}>
            {/* Breadcrumb */}
            <BreadcrumbBack />
            {/* Date */}
            <Typography
              variant="body2"
              color={theme.palette.secondary.medium}
              textAlign="center"
            >
              {new Date(data?.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>

            {/* Post Title */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                mt: 2,
                textAlign: "center",
              }}
            >
              {data?.title}
            </Typography>

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

            {/* Post Content */}
            <div className="w-full drop-cap">
              {!isLoading && !isError && (
                <Editor content={data?.body} editable={false} />
              )}
            </div>

            {/* Divider */}
            <Divider sx={{ my: 4 }} />

            {/* Comments Section */}
            <CommentsContainer
              comments={data?.comments}
              className="mt-10"
              logginedUserId={user?._id}
              postSlug={slug}
              jwt={jwt}
            />
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: 1, marginTop: 2 }}>
            {" "}
            {/* Post Meta Info */} <Typography variant="h6">Autor</Typography>
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  justifyContent: "space-between",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                {" "}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={
                      data?.user?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + data?.user.avatar
                        : "/default-avatar.jpg"
                    }
                    alt={data?.user?.name}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {data?.user?.name || "Autor desconocido"}
                  </Typography>
                </Box>{" "}
                {/* Friend Request Button */}
                <IconButton
                  size="small"
                  onClick={() => handleFriendToggle(user._id)}
                  sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                >
                  {friends[user._id] ? (
                    <PersonRemoveOutlined
                      size={20}
                      sx={{ color: primaryDark }}
                    />
                  ) : (
                    <PersonAddOutlined size={20} sx={{ color: primaryDark }} />
                  )}
                </IconButton>
              </Box>
            </Box>
            {/* Categories as Chips */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categorías
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
              {data?.categories?.map((category) => (
                <Chip
                  key={category._id}
                  label={category.title}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            {/* Tags as Chips */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Etiquetas
            </Typography>
            {tags.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay etiquetas disponibles
              </Typography>
            ) : (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    color="secondary.light"
                    variant="filled"
                  />
                ))}
              </Box>
            )}
            {/* Suggested Posts */}
            <SuggestedPosts
              header="Más artículos interesantes"
              posts={postsData?.data}
              tags={tags}
            />
          </Box>
        </Box>
      )}
    </MainLayout>
  );
};

export default ArticleDetailPage;
