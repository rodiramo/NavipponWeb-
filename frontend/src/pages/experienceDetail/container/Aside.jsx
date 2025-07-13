import React from "react";
import {
  useTheme,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { Globe, Map, Phone, Mail, SunSnow, MapPin, Euro } from "lucide-react";
import ScheduleDisplay from "./ScheduleDisplay";
import { attractionTags, hotelTags, restaurantTags } from "./tags";
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
              mb: 2,
              color: theme.palette.text.primary,
              lineHeight: 1.7,
              "&:last-child": { mb: 0 },
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
          1: "h4",
          2: "h5",
          3: "h6",
          4: "subtitle1",
          5: "subtitle2",
          6: "body1",
        };

        return (
          <Typography
            key={index}
            variant={headingVariants[level] || "h6"}
            component={`h${Math.min(level, 6)}`}
            sx={{
              mb: 2,
              mt: level <= 2 ? 3 : 2,
              fontWeight: 600,
              color: theme.palette.text.primary,
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
              mb: 2,
              pl: 3,
              "& li": {
                mb: 0.5,
                color: theme.palette.text.primary,
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
              mb: 2,
              pl: 3,
              "& li": {
                mb: 0.5,
                color: theme.palette.text.primary,
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
              mb: 2,
              pl: 3,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              backgroundColor: `${theme.palette.primary.main}08`,
              py: 2,
              pr: 2,
              fontStyle: "italic",
              borderRadius: "0 4px 4px 0",
            }}
          >
            {node.content?.map((child, childIndex) =>
              renderNode(child, `${index}-${childIndex}`)
            )}
          </Box>
        );

      case "hardBreak":
        return <br key={index} />;

      case "text":
        return (
          <React.Fragment key={index}>
            {applyMarks(node.text || "", node.marks)}
          </React.Fragment>
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
    return null;
  }

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

const Aside = ({ info }) => {
  const theme = useTheme();

  // Enhanced tag rendering with better styling
  const renderTags = (tags, availableTags) => {
    console.log("Rendering tags:", tags, "with available:", availableTags);

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No hay tags disponibles
        </Typography>
      );
    }

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
          ) : (
            // Show tags even if not found in availableTags (for debugging)
            <Chip
              key={index}
              label={tag}
              variant="outlined"
              sx={{
                borderColor: theme.palette.warning.main,
                color: theme.palette.warning.main,
                backgroundColor: `${theme.palette.warning.main}08`,
              }}
            />
          );
        })}
      </Box>
    );
  };
  const getPrice = () => {
    if (info.price) return `¥ ${info.price}`;
    if (info.budget) return `¥ ${info.budget}`;
    if (info.cost) return `¥ ${info.cost}`;
    if (info.pricing) return `¥ ${info.pricing}`;
    return "A consultar";
  };

  // Try multiple possible data paths for season
  const getSeason = () => {
    if (info.generalTags?.season) return info.generalTags.season;
    if (info.season) return info.season;
    if (info.bestSeason) return info.bestSeason;
    if (info.recommendedSeason) return info.recommendedSeason;
    return "No especificada";
  };

  // ADD THIS DEBUG CODE TO SEE YOUR DATA STRUCTURE
  console.log("=== DEBUG INFO DATA ===");
  console.log("Full info object:", info);
  console.log("Categories:", info.categories);
  console.log("Restaurant tags:", info.restaurantTags);
  console.log("Hotel tags:", info.hotelTags);
  console.log("Attraction tags:", info.attractionTags);
  console.log("General tags:", info.generalTags);
  console.log("Price:", info.price);
  console.log("Budget:", info.budget);
  console.log("All keys in info:", Object.keys(info));
  console.log("=======================");
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
      <Box flex={{ xs: 1, md: 3 }}>
        <Card
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}03 100%)`,
            border: `1px solid ${theme.palette.primary.main}15`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Render body content with rich text renderer */}
            <Box sx={{ mb: 4 }}>
              {info.body ? (
                <RichTextRenderer content={info.body} theme={theme} />
              ) : info.caption ? (
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.primary,
                    lineHeight: 1.7,
                  }}
                >
                  {info.caption}
                </Typography>
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7,
                  }}
                >
                  No hay descripción disponible.
                </Typography>
              )}
            </Box>

            {/* Season and Price Info */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    {getSeason()}
                  </Typography>
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    {getPrice()}
                  </Typography>
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mt: 4, mb: 4, opacity: 0.3 }} />

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
                      info.hotelTags?.accommodation ||
                        info.hotelTags?.accommodations ||
                        info.accommodation ||
                        info.accommodations ||
                        [],
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
                      info.hotelTags?.hotelServices ||
                        info.hotelTags?.services ||
                        info.hotelServices ||
                        info.services ||
                        [],
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
                      info.hotelTags?.typeTrip ||
                        info.hotelTags?.tripType ||
                        info.typeTrip ||
                        info.tripType ||
                        [],
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
                      info.restaurantTags?.restaurantTypes ||
                        info.restaurantTags?.types ||
                        info.restaurantTypes ||
                        info.types ||
                        [],
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
                      info.restaurantTags?.cuisines ||
                        info.restaurantTags?.cuisine ||
                        info.cuisines ||
                        info.cuisine ||
                        [],
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
                      info.restaurantTags?.restaurantServices ||
                        info.restaurantTags?.services ||
                        info.restaurantServices ||
                        info.services ||
                        [],
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
              )}{" "}
              {info.schedule && (
                <ScheduleDisplay schedule={info.schedule} theme={theme} />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Aside;
