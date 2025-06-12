import React from "react";
import {
  useTheme,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Clock,
  Globe,
  Map,
  Phone,
  Mail,
  SunSnow,
  MapPin,
  Euro,
} from "lucide-react";
import { generalTags, attractionTags, hotelTags, restaurantTags } from "./tags";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const getGoogleIcon = (category) => {
  if (
    typeof window.google === "undefined" ||
    !window.google.maps ||
    !window.google.maps.Size ||
    !window.google.maps.Point
  ) {
    return undefined;
  }

  if (category === "Atractivos") {
    return {
      url: "/assets/house-map.png",
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32),
    };
  }
  if (category === "Hoteles") {
    return {
      url: "/assets/hotel-map.png",
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32),
    };
  }
  if (category === "Restaurantes") {
    return {
      url: "/assets/restaurant-map.png",
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32),
    };
  }
  return {
    url: "/assets/house-map.png",
    scaledSize: new window.google.maps.Size(32, 32),
    anchor: new window.google.maps.Point(16, 32),
  };
};

const Aside = ({ info }) => {
  const theme = useTheme();

  // Enhanced tag rendering with better styling
  const renderTags = (tags, availableTags) => {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        {tags.map((tag, index) => {
          const tagInfo = availableTags.find((t) => t.title === tag);
          return tagInfo ? (
            <Chip
              key={index}
              icon={
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {tagInfo.icon}
                </Box>
              }
              label={tagInfo.title}
              variant="outlined"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}08`,
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}15`,
                },
                "& .MuiChip-icon": {
                  color: theme.palette.primary.main,
                },
              }}
            />
          ) : null;
        })}
      </Box>
    );
  };

  // Contact info item component
  const ContactItem = ({ icon, text, isLink = false, href = null }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1.5,
        px: 2,
        backgroundColor: `${theme.palette.primary.main}05`,
        borderRadius: 2,
        border: `1px solid ${theme.palette.primary.main}15`,
        mb: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: `${theme.palette.primary.main}10`,
          transform: "translateX(2px)",
        },
      }}
    >
      <Box
        sx={{
          color: theme.palette.primary.main,
          mr: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      {isLink && href ? (
        <Typography
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {text}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
          {text}
        </Typography>
      )}
    </Box>
  );

  // Convert coordinates
  const coordinatesObj =
    info.location &&
    Array.isArray(info.location.coordinates) &&
    info.location.coordinates.length === 2
      ? {
          lat: parseFloat(info.location.coordinates[1]),
          lng: parseFloat(info.location.coordinates[0]),
        }
      : { lat: 35.6895, lng: 139.6917 };

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      gap={3}
      sx={{ mt: 4 }}
    >
      {/* Left Section - Main Content */}
      <Box flex={{ xs: 1, md: 2 }}>
        <Card
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}03 100%)`,
            border: `1px solid ${theme.palette.primary.main}15`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              {info.body?.content?.map((block, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    mb: 2,
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7,
                  }}
                >
                  {block.content?.map((textObj) => textObj.text).join(" ")}
                </Typography>
              ))}
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography> {info.body || "No especificada"}</Typography>
            </Box>

            {/* Season and Price Info */}

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}
            >
              <SunSnow color={theme.palette.secondary.medium} size={20} />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
              >
                Mejor temporada:{" "}
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.secondary.medium,
                  }}
                >
                  {info.generalTags?.season || "No especificada"}
                </Typography>
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}
            >
              <Euro color={theme.palette.primary.main} size={20} />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
              >
                Precio Aproximado:{" "}
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                  }}
                >
                  {`${info.price}€` || "A consultar"}
                </Typography>
              </Typography>
            </Box>
            <Divider sx={{ mt: 4, mb: 4, opacity: 0.3 }} />

            {/* Category-specific Tags */}
            <Box>
              {info.categories === "Atractivos" && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <MapPin size={20} color={theme.palette.primary.main} />
                    Tipo de Atractivo
                  </Typography>
                  {renderTags(info.attractionTags || [], attractionTags)}
                </Box>
              )}

              {info.categories === "Hoteles" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Tipo de alojamiento
                    </Typography>
                    {renderTags(
                      info.hotelTags?.accommodation || [],
                      hotelTags.accommodations
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Servicios
                    </Typography>
                    {renderTags(
                      info.hotelTags?.hotelServices || [],
                      hotelTags.hotelServices
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Tipo de viaje
                    </Typography>
                    {renderTags(
                      info.hotelTags?.typeTrip || [],
                      hotelTags.typeTrip
                    )}
                  </Box>
                </Box>
              )}

              {info.categories === "Restaurantes" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Tipo de restaurante
                    </Typography>
                    {renderTags(
                      info.restaurantTags?.restaurantTypes || [],
                      restaurantTags.restaurantTypes
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Cocinas
                    </Typography>
                    {renderTags(
                      info.restaurantTags?.cuisines || [],
                      restaurantTags.cuisines
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Servicios de restaurante
                    </Typography>
                    {renderTags(
                      info.restaurantTags?.restaurantServices || [],
                      restaurantTags.restaurantServices
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Right Section - Map & Contact */}
      <Box flex={{ xs: 1, md: 1 }}>
        {/* Map Section */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: `1px solid ${theme.palette.primary.main}15`,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "300px",
              position: "relative",
            }}
          >
            {coordinatesObj.lat && coordinatesObj.lng ? (
              <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                libraries={["places"]}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={coordinatesObj}
                  zoom={13}
                  options={{
                    styles: [
                      {
                        featureType: "all",
                        elementType: "geometry.fill",
                        stylers: [{ saturation: -20 }],
                      },
                    ],
                  }}
                >
                  <Marker
                    position={coordinatesObj}
                    icon={getGoogleIcon(info.categories)}
                  />
                </GoogleMap>
              </LoadScript>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  backgroundColor: theme.palette.grey[100],
                  color: theme.palette.error.main,
                }}
              >
                <Typography>⚠️ Ubicación no disponible</Typography>
              </Box>
            )}
          </Box>

          {/* Location Tags */}
          {info.generalTags?.location && (
            <Box
              sx={{ p: 2, backgroundColor: `${theme.palette.primary.main}05` }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Array.isArray(info.generalTags.location) ? (
                  info.generalTags.location.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        fontSize: "0.75rem",
                      }}
                    />
                  ))
                ) : (
                  <Chip
                    label={info.generalTags.location}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.dark,
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Card>

        {/* Contact Information */}
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.primary.main}15`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: theme.palette.text.primary,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 1,
                display: "inline-block",
              }}
            >
              Información de Contacto
            </Typography>

            <Box>
              {info.address && (
                <ContactItem icon={<Map size={18} />} text={info.address} />
              )}

              {info.phone && (
                <ContactItem icon={<Phone size={18} />} text={info.phone} />
              )}

              {info.email && (
                <ContactItem
                  icon={<Mail size={18} />}
                  text={info.email}
                  isLink={true}
                  href={`mailto:${info.email}`}
                />
              )}

              {info.website && (
                <ContactItem
                  icon={<Globe size={18} />}
                  text={info.website}
                  isLink={true}
                  href={info.website}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Aside;
