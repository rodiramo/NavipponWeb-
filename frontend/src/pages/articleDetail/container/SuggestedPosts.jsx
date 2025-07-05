import { useNavigate } from "react-router-dom";
import { TrendingUp, ArrowForward } from "@mui/icons-material";
import {
  Button,
  useTheme,
  Box,
  Typography,
  Grid,
  Fade,
  Grow,
} from "@mui/material";
import ArticleCard from "../../../components/ArticleCard";

const SuggestedPosts = ({
  className,
  header,
  posts = [],
  jwt,
  currentUser,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  // Don't render if no posts
  if (!posts || posts.length === 0) {
    return null;
  }

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
              <ArticleCard post={item} currentUser={currentUser} token={jwt} />
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
              onClick={() => navigate("/blog")}
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
