import React, { useEffect, useState, useContext } from "react";
import { images, stables } from "../../../../constants";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
} from "../../../../services/index/favorites";
import DataTable from "../../components/DataTable";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import FavoriteContext from "../../../../context/FavoriteContext";
import { toast } from "react-hot-toast";
import { Heart, Calendar, Tag, FolderOpen, Compass, Eye } from "lucide-react";
import {
  useTheme,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Tooltip,
  CardMedia,
  Stack,
  Fade,
  Container,
} from "@mui/material";

const ManageFavorites = () => {
  const { user, jwt } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { favorites, setFavorites, addFavorite, removeFavorite } =
    useContext(FavoriteContext);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (favorites) {
      const updatedFavorites = favorites
        .filter((fav) => fav !== null && fav.experienceId !== null)
        .map((fav) => ({ ...fav, isFavorite: true }));
      setFilteredFavorites(updatedFavorites);
      setIsLoading(false);
    }
  }, [favorites]);

  const searchKeywordHandler = (e) => {
    setSearchKeyword(e.target.value);
  };

  const submitSearchKeywordHandler = (e) => {
    e.preventDefault();
    if (favorites) {
      const filtered = favorites
        .filter(
          (favorite) => favorite !== null && favorite.experienceId !== null
        )
        .filter((favorite) =>
          favorite.experienceId.title
            .toLowerCase()
            .includes(searchKeyword.toLowerCase())
        );
      setFilteredFavorites(filtered);
    }
  };

  const handleFavoriteClick = async (favorite) => {
    if (!user || !jwt) {
      toast.primary("Debes iniciar sesión para agregar a favoritos");
      console.log("User or token is not defined");
      return;
    }

    try {
      if (favorite.isFavorite) {
        console.log("Removing favorite for user:", user);
        await removeFavoriteService({
          userId: user._id,
          experienceId: favorite.experienceId._id,
          token: jwt,
        });
        removeFavorite(favorite.experienceId._id);
        toast.success("Se eliminó de favoritos");
      } else {
        console.log("Adding favorite for user:", user);
        await addFavoriteService({
          userId: user._id,
          experienceId: favorite.experienceId._id,
          token: jwt,
        });
        addFavorite({
          userId: user._id,
          experienceId: favorite.experienceId._id,
        });
        toast.success("Se agregó a favoritos");
      }

      setFilteredFavorites((prevData) =>
        prevData.filter((fav) => fav._id !== favorite._id)
      );
      setFavorites((prevData) =>
        prevData.filter((fav) => fav._id !== favorite._id)
      );
    } catch (primary) {
      toast.primary("primary al actualizar favoritos");
      console.primary("primary updating favorites:", primary);
    }
  };

  // Empty State Component
  const EmptyState = () => (
    <Container maxWidth="sm">
      <Fade in={true} timeout={600}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: 8,
            px: 4,
          }}
        >
          {/* Empty State Illustration */}
          <Box
            sx={{
              width: { xs: 200, sm: 250 },
              height: { xs: 200, sm: 250 },
              mb: 4,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                height: "80%",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}20)`,
                borderRadius: "50%",
                animation: "heartbeat 2s ease-in-out infinite",
              },
              "@keyframes heartbeat": {
                "0%": { transform: "translate(-50%, -50%) scale(1)" },
                "50%": { transform: "translate(-50%, -50%) scale(1.1)" },
                "100%": { transform: "translate(-50%, -50%) scale(1)" },
              },
            }}
          >
            <Box
              component="img"
              src="/assets/nothing-here.png"
              alt="No tienes favoritos"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              fontFamily: theme.typography.h1?.fontFamily,
            }}
          >
            ¡Descubre tus favoritos!
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "medium",
              mb: 1,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            Aún no has agregado ningún favorito
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: "400px",
              lineHeight: 1.6,
            }}
          >
            Explora increíbles experiencias y guarda las que más te gusten para
            acceder a ellas fácilmente.
          </Typography>

          {/* Action Button */}
          <Button
            variant="contained"
            startIcon={<Compass size={20} />}
            onClick={() => navigate("/experience")}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              borderRadius: "50px",
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: theme.shadows[4],
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,

                boxShadow: theme.shadows[8],
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Explorar experiencias
          </Button>
        </Box>
      </Fade>
    </Container>
  );

  // Mobile Card Component
  const FavoriteCard = ({ favorite }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 4,
        border: `1.5px solid ${theme.palette.secondary.main}`,
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* Experience Image Header */}
      <CardMedia
        component="div"
        sx={{
          height: 180,
          position: "relative",
          backgroundImage: `url(${
            favorite?.experienceId?.photo
              ? stables.UPLOAD_FOLDER_BASE_URL + favorite?.experienceId?.photo
              : images.sampleFavoriteImage
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></CardMedia>

      <CardContent sx={{ p: 3 }}>
        {/* Experience Title */}
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {favorite.experienceId.title}
        </Typography>

        {/* Experience Info Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Calendar
                size={16}
                style={{
                  marginRight: 8,
                  color:
                    theme.palette.neutral?.medium || theme.palette.grey[600],
                }}
              />
              <Typography variant="body2" color="textSecondary">
                Agregado:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {new Date(favorite.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FolderOpen
                size={16}
                style={{
                  marginRight: 8,
                  color:
                    theme.palette.neutral?.medium || theme.palette.grey[600],
                }}
              />
              <Typography variant="body2" color="textSecondary">
                Categoría:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {favorite.experienceId.categories || "Sin categorizar"}
            </Typography>
          </Grid>
        </Grid>

        {/* Tags */}
        {favorite.experienceId.tags &&
          favorite.experienceId.tags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Tag
                  size={16}
                  style={{
                    marginRight: 8,
                    color:
                      theme.palette.neutral?.medium || theme.palette.grey[600],
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  Etiquetas:
                </Typography>
              </Box>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: "wrap", gap: 0.5 }}
              >
                {favorite.experienceId.tags.slice(0, 3).map((tag, index) => (
                  <Chip
                    key={index}
                    size="small"
                    label={tag}
                    sx={{
                      backgroundColor:
                        theme.palette.secondary?.light ||
                        theme.palette.secondary.main,
                      color: "white",
                      fontSize: "0.75rem",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            component={Link}
            to={`/experience/${favorite.experienceId.slug}`}
            startIcon={<Eye size={16} />}
            sx={{
              color: theme.palette.secondary.medium,
              borderColor: theme.palette.secondary.medium,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.dark,
              },
              textTransform: "none",
              borderRadius: 30,
            }}
            variant="outlined"
            size="small"
          >
            Ver experiencia
          </Button>

          <Tooltip title="Quitar de favoritos">
            <IconButton
              onClick={() => handleFavoriteClick(favorite)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Heart size={20} fill="currentColor" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  // Show empty state when no favorites exist
  if (filteredFavorites.length === 0 && !isLoading) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          py: 4,
        }}
      >
        <EmptyState />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ px: 3 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              fontFamily: theme.typography.h1?.fontFamily,
            }}
          >
            Mis favoritos
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 3,
            }}
          >
            Aquí tienes todas las experiencias que has guardado como favoritas
          </Typography>
        </Box>
      </Box>

      <DataTable
        pageTitle=""
        searchInputPlaceHolder="Buscar en favoritos..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isMobile ? [] : ["Experiencia", "Categoría", "Agregado", "Acciones"]
        }
        isLoading={isLoading}
        data={filteredFavorites}
      >
        {isMobile ? (
          <Box sx={{ width: "100%" }}>
            {filteredFavorites.map((favorite) => (
              <FavoriteCard key={favorite._id} favorite={favorite} />
            ))}
          </Box>
        ) : (
          filteredFavorites.map((favorite) => (
            <tr
              key={favorite._id}
              style={{
                backgroundColor: theme.palette.background.default,
                transition: "all 0.2s ease-in-out",
              }}
              className="hover:shadow-lg"
            >
              <td
                style={{
                  padding: "16px 24px",
                  minWidth: "300px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={
                      favorite?.experienceId?.photo
                        ? stables.UPLOAD_FOLDER_BASE_URL +
                          favorite?.experienceId?.photo
                        : images.sampleFavoriteImage
                    }
                    alt={favorite.experienceId.title}
                    variant="rounded"
                    sx={{
                      width: 60,
                      height: 50,
                      mr: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.3,
                      }}
                    >
                      {favorite.experienceId.title}
                    </Typography>
                  </Box>
                </Box>
              </td>

              {/* Category */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                  maxWidth: "200px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FolderOpen
                    size={16}
                    style={{
                      marginRight: 8,
                      color:
                        theme.palette.neutral?.medium ||
                        theme.palette.grey[600],
                    }}
                  />
                  {favorite.experienceId.categories ? (
                    <Chip
                      size="small"
                      label={favorite.experienceId.categories}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.secondary.medium,
                        color: theme.palette.secondary.medium,
                        fontSize: "0.75rem",
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sin categorizar
                    </Typography>
                  )}
                </Box>
              </td>

              {/* Added Date */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Calendar
                    size={16}
                    style={{
                      marginRight: 8,
                      color:
                        theme.palette.neutral?.medium ||
                        theme.palette.grey[600],
                    }}
                  />
                  <Typography variant="body2" color="textPrimary">
                    {new Date(favorite.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
              </td>

              {/* Actions */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    component={Link}
                    to={`/experience/${favorite.experienceId.slug}`}
                    startIcon={<Eye size={16} />}
                    sx={{
                      color: theme.palette.secondary.medium,
                      textTransform: "none",
                      borderRadius: "30rem",
                      borderColor: theme.palette.secondary.medium,
                      "&:hover": {
                        borderColor: theme.palette.secondary.medium,
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                    variant="outlined"
                    size="small"
                  >
                    Ver detalles
                  </Button>

                  <Tooltip title="Quitar de favoritos">
                    <IconButton
                      onClick={() => handleFavoriteClick(favorite)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        width: 40,
                        height: 40,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <Heart size={18} fill="currentColor" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </Box>
  );
};

export default ManageFavorites;
