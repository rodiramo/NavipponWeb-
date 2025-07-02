import React, { useEffect, useState, useMemo } from "react";
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
  useMediaQuery,
  Container,
  Grid,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import { setFriends } from "../../store/reducers/authSlice";
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
  Share,
  FavoriteBorder,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getSinglePost } from "../../services/index/posts";
import MainLayout from "../../components/MainLayout";
import SuggestedPosts from "./container/SuggestedPosts";
import CommentsContainer from "../../components/comments/CommentsContainer";
import ErrorMessage from "../../components/ErrorMessage";
import ArticleDetailSkeleton from "./components/ArticleDetailSkeleton";
import BreadcrumbBack from "../../components/BreadcrumbBack";
import useUser from "../../hooks/useUser";
import { useSelector } from "react-redux";

const RichTextRenderer = ({ content, theme }) => {
  // Function to apply text marks (bold, italic, etc.)
  const applyMarks = (text, marks = []) => {
    if (!marks || marks.length === 0) {
      return text;
    }

    let styledText = text;
    let Component = React.Fragment;
    let props = {};

    marks.forEach((mark) => {
      switch (mark.type) {
        case "bold":
          const BoldWrapper = ({ children }) => (
            <Typography component="strong" sx={{ fontWeight: 700 }}>
              {children}
            </Typography>
          );
          Component = BoldWrapper;
          break;
        case "italic":
          const ItalicWrapper = ({ children }) => (
            <Typography component="em" sx={{ fontStyle: "italic" }}>
              {children}
            </Typography>
          );
          Component = ItalicWrapper;
          break;
        case "underline":
          const UnderlineWrapper = ({ children }) => (
            <Typography component="u" sx={{ textDecoration: "underline" }}>
              {children}
            </Typography>
          );
          Component = UnderlineWrapper;
          break;
        case "code":
          const CodeWrapper = ({ children }) => (
            <Typography
              component="code"
              sx={{
                fontFamily: "monospace",
                backgroundColor: theme.palette.grey[100],
                padding: "2px 4px",
                borderRadius: "4px",
                fontSize: "0.9em",
              }}
            >
              {children}
            </Typography>
          );
          Component = CodeWrapper;
          break;
        case "link":
          const LinkWrapper = ({ children }) => (
            <Typography
              component="a"
              href={mark.attrs?.href || "#"}
              target={mark.attrs?.target || "_blank"}
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {children}
            </Typography>
          );
          Component = LinkWrapper;
          break;
        default:
          break;
      }
    });

    return <Component {...props}>{styledText}</Component>;
  };

  // Function to render individual content nodes
  const renderNode = (node, index) => {
    if (!node || !node.type) {
      return null;
    }

    switch (node.type) {
      case "doc":
        return (
          <Box key={index}>
            {node.content?.map((child, childIndex) =>
              renderNode(child, childIndex)
            )}
          </Box>
        );

      case "paragraph":
        return (
          <Typography
            key={index}
            variant="body1"
            component="p"
            sx={{
              mb: 2.5,
              color: theme.palette.text.primary,
              lineHeight: 1.8,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              "&:last-child": { mb: 0 },
              "&:first-of-type": {
                "&::first-letter": {
                  fontSize: { xs: "3rem", sm: "4rem" },
                  fontWeight: 700,
                  lineHeight: 1,
                  float: "left",
                  marginRight: "8px",
                  marginTop: "4px",
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            {node.content?.map((child, childIndex) =>
              renderNode(child, `${index}-${childIndex}`)
            )}
          </Typography>
        );

      case "heading":
        const level = node.attrs?.level || 1;
        const headingVariants = {
          1: "h3",
          2: "h4",
          3: "h5",
          4: "h6",
          5: "subtitle1",
          6: "subtitle2",
        };

        return (
          <Typography
            key={index}
            variant={headingVariants[level] || "h6"}
            component={`h${Math.min(level + 2, 6)}`}
            sx={{
              mb: 2.5,
              mt: level <= 2 ? 4 : 3,
              fontWeight: 700,
              color: theme.palette.primary.main,
              "&:first-of-type": { mt: 0 },
            }}
          >
            {node.content?.map((child, childIndex) =>
              renderNode(child, `${index}-${childIndex}`)
            )}
          </Typography>
        );

      case "bulletList":
        return (
          <Box
            key={index}
            component="ul"
            sx={{
              mb: 3,
              pl: 4,
              "& li": {
                mb: 1,
                color: theme.palette.text.primary,
                lineHeight: 1.7,
              },
            }}
          >
            {node.content?.map((child, childIndex) =>
              renderNode(child, `${index}-${childIndex}`)
            )}
          </Box>
        );

      case "orderedList":
        return (
          <Box
            key={index}
            component="ol"
            sx={{
              mb: 3,
              pl: 4,
              "& li": {
                mb: 1,
                color: theme.palette.text.primary,
                lineHeight: 1.7,
              },
            }}
          >
            {node.content?.map((child, childIndex) =>
              renderNode(child, `${index}-${childIndex}`)
            )}
          </Box>
        );

      case "listItem":
        return (
          <Box key={index} component="li">
            {node.content?.map((child, childIndex) =>
              renderNode(child, `${index}-${childIndex}`)
            )}
          </Box>
        );

      case "blockquote":
        return (
          <Box
            key={index}
            component="blockquote"
            sx={{
              mb: 3,
              pl: 4,
              pr: 3,
              py: 3,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              backgroundColor: `${theme.palette.primary.main}08`,
              fontStyle: "italic",
              borderRadius: "0 8px 8px 0",
              fontSize: { xs: "1.1rem", sm: "1.2rem" },
              lineHeight: 1.6,
            }}
          >
            {node.content?.map((child, childIndex) =>
              renderNode(child, `${index}-${childIndex}`)
            )}
          </Box>
        );

      case "codeBlock":
        return (
          <Box
            key={index}
            component="pre"
            sx={{
              mb: 3,
              p: 3,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 2,
              overflow: "auto",
              fontFamily: "monospace",
              fontSize: "0.9em",
              border: `1px solid ${theme.palette.grey[300]}`,
              lineHeight: 1.5,
            }}
          >
            <code>
              {node.content?.map((child, childIndex) =>
                renderNode(child, `${index}-${childIndex}`)
              )}
            </code>
          </Box>
        );

      case "horizontalRule":
        return (
          <Divider
            key={index}
            sx={{
              my: 4,
              borderColor: theme.palette.grey[300],
            }}
          />
        );

      case "hardBreak":
        return <br key={index} />;

      case "text":
        return (
          <React.Fragment key={index}>
            {applyMarks(node.text || "", node.marks)}
          </React.Fragment>
        );

      case "image":
        return (
          <Box
            key={index}
            sx={{
              mb: 4,
              textAlign: node.attrs?.align || "center",
            }}
          >
            <Box
              component="img"
              src={node.attrs?.src}
              alt={node.attrs?.alt || ""}
              title={node.attrs?.title}
              sx={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: theme.shadows[3],
              }}
            />
            {node.attrs?.title && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 2,
                  color: theme.palette.text.secondary,
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                {node.attrs.title}
              </Typography>
            )}
          </Box>
        );

      default:
        // Handle unknown node types gracefully
        if (node.content && Array.isArray(node.content)) {
          return (
            <Box key={index}>
              {node.content.map((child, childIndex) =>
                renderNode(child, `${index}-${childIndex}`)
              )}
            </Box>
          );
        }

        if (node.text) {
          return (
            <Typography key={index} component="span">
              {node.text}
            </Typography>
          );
        }

        return null;
    }
  };

  // Main render function
  if (!content) {
    return (
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          fontStyle: "italic",
          textAlign: "center",
          py: 4,
        }}
      >
        No hay contenido disponible.
      </Typography>
    );
  }

  // Handle string content (HTML or plain text)
  if (typeof content === "string") {
    // If it looks like HTML, render it safely
    if (content.includes("<") && content.includes(">")) {
      return (
        <Typography
          variant="body1"
          component="div"
          sx={{
            lineHeight: 1.8,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            color: theme.palette.text.primary,
            "& p": { mb: 2 },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              color: theme.palette.primary.main,
              fontWeight: 700,
              mt: 3,
              mb: 2,
            },
            "& ul, & ol": { pl: 3, mb: 2 },
            "& blockquote": {
              pl: 3,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              backgroundColor: `${theme.palette.primary.main}08`,
              py: 2,
              pr: 2,
              fontStyle: "italic",
              borderRadius: "0 4px 4px 0",
            },
            "& code": {
              backgroundColor: theme.palette.grey[100],
              padding: "2px 4px",
              borderRadius: "4px",
              fontSize: "0.9em",
              fontFamily: "monospace",
            },
            "& pre": {
              backgroundColor: theme.palette.grey[100],
              padding: 2,
              borderRadius: 1,
              overflow: "auto",
              fontSize: "0.9em",
            },
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    } else {
      // Plain text
      return (
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            color: theme.palette.text.primary,
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </Typography>
      );
    }
  }

  // Handle structured content
  if (Array.isArray(content)) {
    return <Box>{content.map((node, index) => renderNode(node, index))}</Box>;
  }

  if (content.content && Array.isArray(content.content)) {
    return (
      <Box>{content.content.map((node, index) => renderNode(node, index))}</Box>
    );
  }

  return renderNode(content, 0);
};

const ArticleDetailPage = (token) => {
  const { slug } = useParams();
  const { user, jwt } = useUser();
  const theme = useTheme();
  const primaryDark = theme.palette.primary.dark;
  const primaryLight = theme.palette.primary.light;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  // ✅ Get friends from Redux store
  const userFriends = useSelector((state) => state.auth.user?.friends ?? []);

  const [body, setBody] = useState(null);
  const [tags, setTags] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  // ✅ Local state for immediate UI update
  const [localFriendState, setLocalFriendState] = useState(null);

  // Fetch Post
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      try {
        // Handle different body formats
        if (data?.body) {
          if (typeof data.body === "string") {
            try {
              // Try to parse as JSON first
              const parsedBody = JSON.parse(data.body);
              setBody(parsedBody);
            } catch (parseError) {
              // If JSON parsing fails, treat as HTML/plain text
              setBody(data.body);
            }
          } else {
            // Body is already an object
            setBody(data.body);
          }
        } else {
          setBody(null);
        }

        console.log("✅ Post Data:", data);
        console.log("✅ Body:", data?.body);
        console.log("✅ Tags:", data?.tags);

        setTags(data?.tags || []);
      } catch (error) {
        console.error("❌ Error processing post body:", error.message);
        setBody(null);
      }
    },
  });

  // Fetch Other Posts
  const { data: postsData } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
  });

  const isPostAuthorFriend = useMemo(() => {
    return data?.user?._id ? userFriends.includes(data.user._id) : false;
  }, [userFriends, data?.user?._id]);

  const isOwnPost = useMemo(() => {
    return user?._id === data?.user?._id;
  }, [user?._id, data?.user?._id]);

  // ✅ Sync local state with Redux when data changes
  useEffect(() => {
    if (data?.user?._id && localFriendState === null) {
      setLocalFriendState(userFriends.includes(data.user._id));
    }
  }, [data?.user?._id, userFriends, localFriendState]);

  // Debug friend state
  useEffect(() => {
    if (data?.user?._id) {
      console.log("🔍 Friend Debug:", {
        userFriends,
        postAuthorId: data.user._id,
        isPostAuthorFriend,
        isOwnPost,
        currentUserId: user?._id,
        localFriendState,
      });
    }
  }, [
    userFriends,
    data?.user?._id,
    isPostAuthorFriend,
    isOwnPost,
    user?._id,
    localFriendState,
  ]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const dispatch = useDispatch();
  const [processingFriends, setProcessingFriends] = useState(new Set());
  useEffect(() => {
    if (data?.tags && Array.isArray(data.tags)) {
      setTags(data.tags);
    } else {
      setTags([]);
    }
  }, [data?.tags]);

  // ✅ Fixed Toggle Friend Status - with immediate UI update
  const handleFriendToggle = async () => {
    if (!data?.user?._id || !jwt) {
      toast.error("Error: No se puede agregar/quitar amigo");
      return;
    }

    const userId = data.user._id;
    setProcessingFriends((prev) => new Set(prev.add(userId)));

    try {
      const updatedUser = await toggleFriend({ userId, token: jwt });
      dispatch(setFriends(updatedUser.friends));

      const userName = data.user.name || "Usuario";
      const isFriend = updatedUser.friends.includes(userId);
      toast.success(
        isFriend
          ? `Ahora eres amigo de ${userName}`
          : `Has dejado de seguir a ${userName}`,
        { duration: 3000 }
      );
    } catch (error) {
      toast.error("Error al actualizar amigos");
      console.error(error);
    } finally {
      setProcessingFriends((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Handle Favorite Toggle
  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited ? "Eliminado de favoritos" : "Agregado a favoritos"
    );
  };

  // Handle Share
  const handleShare = async () => {
    setIsSharing(true);
    const shareData = {
      title: data?.title,
      text: `Lee este interesante artículo: ${data?.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && isMobile) {
        await navigator.share(shareData);
        toast.success("Compartido exitosamente");
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Enlace copiado al portapapeles");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Enlace copiado al portapapeles");
      } catch (clipboardError) {
        toast.error("Error al compartir");
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Mobile Sidebar Component
  const SidebarContent = () => (
    <>
      {/* Author Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}05 100%)`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: theme.palette.primary.main,
            fontWeight: 700,
          }}
        >
          Sobre el Autor
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={
                data?.user?.avatar
                  ? stables.UPLOAD_FOLDER_BASE_URL + data?.user.avatar
                  : images.userImage
              }
              alt={data?.user?.name}
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                border: `3px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[3],
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                }}
              >
                {data?.user?.name || "Autor desconocido"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                {isOwnPost ? "Tu publicación" : "Contribuidor"}
              </Typography>
            </Box>
          </Box>

          {user && !isOwnPost && (
            <Tooltip
              title={
                isPostAuthorFriend ? "Eliminar de amigos" : "Agregar a amigos"
              }
            >
              <IconButton
                onClick={handleFriendToggle}
                disabled={processingFriends.has(data?.user?._id)}
                sx={{
                  backgroundColor: isPostAuthorFriend
                    ? theme.palette.error.light
                    : theme.palette.primary.light,
                  color: isPostAuthorFriend
                    ? theme.palette.error.main
                    : theme.palette.primary.main,
                  width: { xs: 44, sm: 48 },
                  height: { xs: 44, sm: 48 },
                  "&:hover": {
                    backgroundColor: isPostAuthorFriend
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                    color: "white",
                    transform: "scale(1.05)",
                  },
                  "&:disabled": {
                    backgroundColor: theme.palette.action.disabledBackground,
                  },
                  transition: "all 0.3s ease",
                  boxShadow: theme.shadows[2],
                }}
              >
                {processingFriends.has(data?.user?._id) ? (
                  <CircularProgress size={20} />
                ) : isPostAuthorFriend ? (
                  <PersonRemoveOutlined sx={{ fontSize: { xs: 20, sm: 24 } }} />
                ) : (
                  <PersonAddOutlined sx={{ fontSize: { xs: 20, sm: 24 } }} />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Paper>

      {/* Categories Section */}
      {data?.categories && data.categories.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: 700,
            }}
          >
            Categorías
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {data.categories.map((category) => (
              <Chip
                key={category._id}
                label={category.title}
                color="primary"
                variant="filled"
                sx={{
                  borderRadius: "30px",
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      {/* Tags Section */}
      {tags.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: 700,
            }}
          >
            Etiquetas
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                variant="outlined"
                sx={{
                  borderRadius: "30px",
                  fontWeight: 500,
                  borderColor: theme.palette.secondary.medium,
                  color: theme.palette.secondary.medium,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.medium,
                    color: "white",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Stack>
        </Paper>
      )}
    </>
  );

  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
      ) : (
        <Container
          maxWidth={false}
          sx={{
            py: { xs: 6, sm: 8, md: 12 },
            px: { xs: 2, sm: 3, md: 12 },
            width: "100%",
          }}
        >
          <Grid container spacing={{ xs: 0, md: 6 }} sx={{ maxWidth: "none" }}>
            {/* Main Content */}
            <Grid item xs={12} md={9} lg={8}>
              <Box sx={{ mb: { xs: 4, md: 0 }, pr: { md: 2 } }}>
                {/* Breadcrumb */}
                <Box sx={{ mb: 4 }}>
                  <BreadcrumbBack />
                </Box>

                {/* Article Header */}
                <Box sx={{ mb: 5 }}>
                  {/* Date and Reading Time */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {" "}
                      {new Date(data?.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        fontWeight: 500,
                      }}
                    >
                      ⏱{" "}
                      {Math.ceil(
                        (data?.caption?.split(" ").length || 100) / 200
                      )}{" "}
                      min lectura
                    </Typography>
                  </Box>

                  {/* Post Title */}
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      color: theme.palette.text.primary,
                      fontSize: {
                        xs: "2rem",
                        sm: "2.5rem",
                        md: "3rem",
                        lg: "3.5rem",
                      },
                      lineHeight: { xs: 1.2, md: 1.1 },
                      letterSpacing: "-0.02em",
                      mb: 3,
                      background: `linear-gradient(135deg, 
                        ${theme.palette.primary.main} , 
                        ${theme.palette.primary.main} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {data?.title}
                  </Typography>

                  {/* Caption/Subtitle */}
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: {
                        xs: "1.125rem",
                        sm: "1.25rem",
                        md: "1.375rem",
                      },
                      lineHeight: 1.6,
                      fontWeight: 400,
                      mb: 4,
                      fontStyle: "italic",
                    }}
                  >
                    {data?.caption}
                  </Typography>
                </Box>

                {/* ✅ Consistently Sized Post Image with Overlay Buttons */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: {
                      xs: "300px",
                      sm: "400px",
                      md: "500px",
                      lg: "600px",
                    },
                    borderRadius: 3,
                    mb: 5,
                  }}
                >
                  <Box
                    component="img"
                    src={
                      data?.photo
                        ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo
                        : images.samplePostImage
                    }
                    alt={data?.title}
                    sx={{
                      width: "100%",
                      borderRadius: 3,
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />

                  {/* Overlay Action Buttons */}
                  <Box
                    className="overlay-buttons"
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      right: 20,
                      display: "flex",
                      gap: 2,
                      opacity: { xs: 1, md: 0.9 },
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {/* Share Button */}
                    <IconButton
                      onClick={handleShare}
                      disabled={isSharing}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        color: theme.palette.primary.main,
                        width: { xs: 48, sm: 56 },
                        height: { xs: 48, sm: 56 },
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          transform: "scale(1.1) translateY(-2px)",
                          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                        },
                        "&:disabled": {
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          color: theme.palette.primary.light,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Share sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>

                    {/* Favorite Button */}
                    <IconButton
                      onClick={handleFavoriteToggle}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        color: isFavorited
                          ? theme.palette.error.main
                          : theme.palette.grey[600],
                        width: { xs: 48, sm: 56 },
                        height: { xs: 48, sm: 56 },
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          backgroundColor: theme.palette.error.main,
                          color: "white",
                          transform: "scale(1.1) translateY(-2px)",
                          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isFavorited ? (
                        <Favorite sx={{ fontSize: { xs: 20, sm: 24 } }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: { xs: 20, sm: 24 } }} />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* Mobile Sidebar - Show above content on mobile */}
                {isMobile && (
                  <Box sx={{ mb: 5 }}>
                    <SidebarContent />
                  </Box>
                )}

                {/* Post Content - Using Rich Text Renderer */}
                <Box
                  sx={{
                    mb: 5,
                    "& .drop-cap": {
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                      lineHeight: { xs: 1.6, md: 1.7 },
                    },
                  }}
                >
                  {!isLoading && !isError && (
                    <RichTextRenderer
                      content={body || data?.body}
                      theme={theme}
                    />
                  )}
                </Box>

                {/* Divider */}
                <Divider
                  sx={{
                    my: 6,
                    borderColor: theme.palette.divider,
                  }}
                />

                {/* Comments Section */}
                <CommentsContainer
                  comments={data?.comments}
                  logginedUserId={user?._id}
                  postSlug={slug}
                  jwt={jwt}
                />

                {/* Suggested Posts - Moved to bottom */}
                <Box sx={{ mt: 8 }}>
                  <SuggestedPosts
                    header="Más artículos interesantes"
                    posts={postsData?.data}
                    tags={tags}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Desktop Sidebar */}
            {!isMobile && (
              <Grid item md={3} lg={4}>
                <Box
                  sx={{
                    position: "sticky",
                    top: 120,
                    maxHeight: "calc(100vh - 140px)",
                    overflowY: "auto",
                    pl: { md: 2 },
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "3px",
                    },
                  }}
                >
                  <SidebarContent />
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      )}
    </MainLayout>
  );
};

export default ArticleDetailPage;
