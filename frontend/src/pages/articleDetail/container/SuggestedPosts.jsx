import { Link } from "react-router-dom";
import { images, stables } from "../../../constants";
import { AccessTime, TrendingUp, ArrowForward } from "@mui/icons-material";
import {
  Button,
  useTheme,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Stack,
  Fade,
  Grow,
} from "@mui/material";

const SuggestedPosts = ({ className, header, posts = [], tags }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Title with Icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TrendingUp
            sx={{
              color: theme.palette.primary.main,
              fontSize: { xs: 28, md: 32 },
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              fontFamily: theme.typography.h1?.fontFamily,
            }}
          >
            {header}
          </Typography>
        </Box>
      </Box>

      {/* Posts Grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {posts.slice(0, 6).map((item, index) => (
          <Grow in={true} timeout={300 + index * 100} key={item._id}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                component={Link}
                to={`/blog/${item.slug}`}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[12],
                    "& .post-image": {
                      transform: "scale(1.05)",
                    },
                    "& .post-title": {
                      color: theme.palette.primary.main,
                    },
                    "& .read-more": {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  },
                }}
              >
                {/* Post Image */}
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    height: 200,
                  }}
                >
                  <CardMedia
                    className="post-image"
                    component="img"
                    image={
                      item?.photo
                        ? stables.UPLOAD_FOLDER_BASE_URL + item?.photo
                        : images.samplePostImage
                    }
                    alt={item.title}
                    sx={{
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />

                  {/* Overlay gradient */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.7))",
                      display: "flex",
                      alignItems: "flex-end",
                      p: 2,
                    }}
                  >
                    {/* Date chip */}
                    <Chip
                      icon={<AccessTime sx={{ fontSize: 16 }} />}
                      label={new Date(item.createdAt).toLocaleDateString(
                        "es-ES",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        color: theme.palette.text.primary,
                        fontWeight: "medium",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                </Box>

                {/* Post Content */}
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                  }}
                >
                  {/* Title */}
                  <Typography
                    className="post-title"
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      lineHeight: 1.3,
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      transition: "color 0.2s ease-in-out",
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Categories */}
                  {item.categories && item.categories.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
                    >
                      {item.categories.slice(0, 2).map((category, idx) => (
                        <Chip
                          key={idx}
                          label={category.title}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.7rem",
                            height: 24,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.light,
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  )}

                  {/* Read More Button */}
                  <Box
                    className="read-more"
                    sx={{
                      mt: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      opacity: 0,
                      transform: "translateX(-10px)",
                      transition: "all 0.2s ease-in-out",
                      color: theme.palette.primary.main,
                      fontWeight: "medium",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Leer más
                    </Typography>
                    <ArrowForward sx={{ fontSize: 16 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grow>
        ))}
      </Grid>

      {/* View All Button */}
      {posts.length > 6 && (
        <Fade in={true} timeout={800}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: "25px",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[4],
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Ver todos los artículos
            </Button>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default SuggestedPosts;
