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
  useMediaQuery,
  Container,
  Grid,
  Paper,
  Stack,
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
  Share,
  FavoriteBorder,
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

// Rich Text Renderer Component
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

  const [friends, setFriends] = useState({});
  const [body, setBody] = useState(null);
  const [tags, setTags] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data?.tags && Array.isArray(data.tags)) {
      setTags(data.tags);
    } else {
      setTags([]);
    }
  }, [data?.tags]);

  // Toggle Friend Status
  const handleFriendToggle = async (userId) => {
    try {
      await toggleFriend({ userId, token });

      setFriends((prev) => {
        const updatedFriends = { ...prev, [userId]: !prev[userId] };
        localStorage.setItem("friends", JSON.stringify(updatedFriends));
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
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${
            theme.palette.neutral?.light || theme.palette.grey[200]
          }`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: theme.palette.primary.main,
            fontWeight: "bold",
          }}
        >
          Autor
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={
                data?.user?.avatar
                  ? stables.UPLOAD_FOLDER_BASE_URL + data?.user.avatar
                  : "/default-avatar.jpg"
              }
              alt={data?.user?.name}
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: "medium",
                color: theme.palette.text.primary,
              }}
            >
              {data?.user?.name || "Autor desconocido"}
            </Typography>
          </Box>

          <Tooltip
            title={friends[user?._id] ? "Eliminar amigo" : "Agregar amigo"}
          >
            <IconButton
              size="small"
              onClick={() => handleFriendToggle(user?._id)}
              sx={{
                backgroundColor: primaryLight,
                p: 1.5,
                "&:hover": {
                  backgroundColor: primaryDark,
                  "& svg": {
                    color: "white",
                  },
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {friends[user?._id] ? (
                <PersonRemoveOutlined sx={{ color: primaryDark }} />
              ) : (
                <PersonAddOutlined sx={{ color: primaryDark }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Categories Section */}
      {data?.categories && data.categories.length > 0 && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${
              theme.palette.neutral?.light || theme.palette.grey[200]
            }`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: "bold",
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
                variant="outlined"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      {/* Tags Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${
            theme.palette.neutral?.light || theme.palette.grey[200]
          }`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: theme.palette.primary.main,
            fontWeight: "bold",
          }}
        >
          Etiquetas
        </Typography>
        {tags.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay etiquetas disponibles
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{
                  backgroundColor:
                    theme.palette.secondary?.medium ||
                    theme.palette.secondary.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.secondary?.main ||
                      theme.palette.secondary.dark,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              />
            ))}
          </Stack>
        )}
      </Paper>
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
          maxWidth="xl"
          sx={{
            py: { xs: 8, sm: 10, md: 15 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Grid container spacing={{ xs: 0, md: 4 }}>
            {/* Main Content */}
            <Grid item xs={12} md={8} lg={9}>
              <Box sx={{ mb: { xs: 4, md: 0 } }}>
                {/* Breadcrumb */}
                <Box sx={{ mb: 3 }}>
                  <BreadcrumbBack />
                </Box>

                {/* Article Header */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  {/* Date */}
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        theme.palette.secondary?.medium ||
                        theme.palette.text.secondary,
                      mb: 2,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
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
                      fontSize: {
                        xs: "1.75rem",
                        sm: "2.25rem",
                        md: "2.75rem",
                        lg: "3.5rem",
                      },
                      lineHeight: 1.2,
                      fontFamily: theme.typography.h1?.fontFamily,
                    }}
                  >
                    {data?.title}
                  </Typography>
                </Box>

                {/* Post Image with Overlay Buttons */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mb: 4,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: theme.shadows[4],
                    "&:hover": {
                      boxShadow: theme.shadows[8],
                      transform: "scale(1.01)",
                      "& .overlay-buttons": {
                        opacity: 1,
                      },
                    },
                    transition: "all 0.3s ease-in-out",
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
                      height: "auto",
                      display: "block",
                    }}
                  />

                  {/* Overlay Action Buttons */}
                  <Box
                    className="overlay-buttons"
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      opacity: { xs: 1, md: 0.8 },
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    {/* Share Button */}
                    <IconButton
                      onClick={handleShare}
                      disabled={isSharing}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        color: theme.palette.primary.main,
                        width: 48,
                        height: 48,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          transform: "scale(1.1)",
                          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
                        },
                        "&:disabled": {
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          color: theme.palette.primary.light,
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <Share sx={{ fontSize: 24 }} />
                    </IconButton>

                    {/* Favorite Button */}
                    <IconButton
                      onClick={handleFavoriteToggle}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        color: isFavorited
                          ? theme.palette.error.main
                          : theme.palette.grey[600],
                        width: 48,
                        height: 48,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          backgroundColor: theme.palette.error.main,
                          color: "white",
                          transform: "scale(1.1)",
                          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      {isFavorited ? (
                        <Favorite sx={{ fontSize: 24 }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: 24 }} />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* Mobile Sidebar - Show above content on mobile */}
                {isMobile && (
                  <Box sx={{ mb: 4 }}>
                    <SidebarContent />
                  </Box>
                )}

                {/* Post Content - Using Rich Text Renderer */}
                <Box
                  sx={{
                    mb: 4,
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
                    my: { xs: 3, md: 4 },
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
                <Box sx={{ mt: { xs: 4, md: 6 } }}>
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
              <Grid item md={4} lg={3}>
                <Box
                  sx={{
                    position: "sticky",
                    top: 100,
                    maxHeight: "calc(100vh - 120px)",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "2px",
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
