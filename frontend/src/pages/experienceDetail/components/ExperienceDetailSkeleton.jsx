import React from "react";
import { Box, Grid, Skeleton, Typography, Paper } from "@mui/material";

const ExperienceDetailSkeleton = () => {
  return (
    <Box
      sx={{
        maxWidth: "lg",
        mx: "auto",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main Experience Content */}
      <Box>
        {/* Image Placeholder */}
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ aspectRatio: "16/9", borderRadius: 2 }}
        />

        {/* Title */}
        <Skeleton variant="text" sx={{ width: "40%", height: 40, mt: 2 }} />

        {/* Content Paragraphs */}
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="text" sx={{ width: "60%", height: 20, my: 1 }} />
          <Skeleton variant="text" sx={{ width: "100%", height: 20, my: 1 }} />
          <Skeleton variant="text" sx={{ width: "70%", height: 20, my: 1 }} />
          <Skeleton variant="text" sx={{ width: "80%", height: 20, my: 1 }} />
        </Box>
      </Box>

      {/* Related Posts - Always at the Bottom */}
      <Box sx={{ mt: 5, width: "100%" }}>
        <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Publicaciones Relacionadas
          </Typography>

          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Grid key={index} item xs={12} sm={6} lg={4}>
                <Box display="flex" gap={2} alignItems="center">
                  {/* Image Placeholder */}
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={80}
                    sx={{ borderRadius: 2 }}
                  />

                  {/* Text Content */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton
                      variant="text"
                      sx={{ width: "80%", height: 20 }}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ width: "60%", height: 15, mt: 1 }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default ExperienceDetailSkeleton;
