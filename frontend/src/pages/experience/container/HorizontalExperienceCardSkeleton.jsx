import React from "react";
import { Box, Card, CardContent, Skeleton, useTheme } from "@mui/material";

const HorizontalExperienceCardSkeleton = ({ className = "" }) => {
  const theme = useTheme();

  return (
    <Card
      className={className}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        minHeight: { xs: "auto", sm: "200px" },
        transition: "all 0.3s ease",
      }}
    >
      {/* Image Skeleton */}
      <Box
        sx={{
          width: { xs: "100%", sm: "280px" },
          height: { xs: "200px", sm: "200px" },
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            backgroundColor: `${theme.palette.primary.main}10`,
          }}
        />

        {/* Favorite Button Skeleton */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
          }}
        >
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            animation="wave"
            sx={{
              backgroundColor: `${theme.palette.background.paper}80`,
            }}
          />
        </Box>

        {/* Category Badge Skeleton */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={80}
            height={24}
            animation="wave"
            sx={{
              borderRadius: "12px",
              backgroundColor: `${theme.palette.background.paper}80`,
            }}
          />
        </Box>
      </Box>

      {/* Content Skeleton */}
      <CardContent
        sx={{
          flex: 1,
          padding: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: { sm: "200px" },
        }}
      >
        {/* Header Section */}
        <Box>
          {/* Title Skeleton */}
          <Skeleton
            variant="text"
            width="85%"
            height={32}
            animation="wave"
            sx={{
              marginBottom: 1,
              fontSize: "1.25rem",
            }}
          />

          {/* Location Skeleton */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              animation="wave"
              sx={{ marginRight: 1 }}
            />
            <Skeleton variant="text" width="60%" height={20} animation="wave" />
          </Box>

          {/* Description Skeleton */}
          <Box sx={{ marginBottom: 2 }}>
            <Skeleton
              variant="text"
              width="100%"
              height={20}
              animation="wave"
              sx={{ marginBottom: 0.5 }}
            />
            <Skeleton
              variant="text"
              width="90%"
              height={20}
              animation="wave"
              sx={{ marginBottom: 0.5 }}
            />
            <Skeleton variant="text" width="75%" height={20} animation="wave" />
          </Box>

          {/* Features/Tags Skeleton */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              marginBottom: 2,
            }}
          >
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={Math.random() * 40 + 60} // Random width between 60-100px
                height={24}
                animation="wave"
                sx={{
                  borderRadius: "12px",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Footer Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          {/* Rating Skeleton */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  width={16}
                  height={16}
                  animation="wave"
                />
              ))}
            </Box>
            <Skeleton variant="text" width={40} height={20} animation="wave" />
          </Box>

          {/* Price Skeleton */}
          <Box sx={{ textAlign: "right" }}>
            <Skeleton
              variant="text"
              width={80}
              height={24}
              animation="wave"
              sx={{ marginBottom: 0.5 }}
            />
            <Skeleton variant="text" width={60} height={16} animation="wave" />
          </Box>
        </Box>

        {/* Action Button Skeleton */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 2,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={120}
            height={36}
            animation="wave"
            sx={{
              borderRadius: "18px",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default HorizontalExperienceCardSkeleton;
