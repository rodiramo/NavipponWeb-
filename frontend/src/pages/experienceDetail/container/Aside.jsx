import React from "react";
import { useTheme, Typography, Box } from "@mui/material";
import { FaCalendarAlt } from "react-icons/fa";
import { Clock, Globe, Map, Phone, Mail, SunSnow } from "lucide-react";
import { generalTags, attractionTags, hotelTags, restaurantTags } from "./tags";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { fontWeight } from "@mui/system";

const getGoogleIcon = (category) => {
  if (
    typeof window.google === "undefined" ||
    !window.google.maps ||
    !window.google.maps.Size ||
    !window.google.maps.Point
  ) {
    // API not ready, return undefined so default marker is used.
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

  // Render tags, description, contact info, etc.
  const renderTags = (tags, availableTags) => {
    return tags.map((tag, index) => {
      const tagInfo = availableTags.find((t) => t.title === tag);
      return tagInfo ? (
        <div key={index} className="flex items-center mb-2">
          <div
            className="icon-container mr-2"
            style={{ color: theme.palette.primary.main }}
          >
            {tagInfo.icon}
          </div>
          <span>{tagInfo.title}</span>
        </div>
      ) : null;
    });
  };

  // Convert info.location.coordinates to a LatLngLiteral
  const coordinatesObj =
    info.location &&
    Array.isArray(info.location.coordinates) &&
    info.location.coordinates.length === 2
      ? {
          lat: parseFloat(info.location.coordinates[1]),
          lng: parseFloat(info.location.coordinates[0]),
        }
      : { lat: 35.6895, lng: 139.6917 };

  console.log("📍 Coordinates for Map:", coordinatesObj);
  // Google Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
      {/* Left Section - Description, tags, contact info, etc. */}
      <Box
        sx={{
          flex: { xs: 1, md: 2 },
          boxShadow: `-4px 0px 50px -9px #CDD9E1`,
          borderRadius: 4,
          padding: 3,
          marginTop: 3,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Descripción general
        </Typography>
        {info.body?.content?.map((block, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{ marginBottom: 2, color: "text.secondary" }}
          >
            {block.content?.map((textObj) => textObj.text).join(" ")}
          </Typography>
        ))}
        <Typography
          variant="body1"
          className="font-bold"
          sx={{ color: "text.secondary" }}
        >
          La mejor temporada para visitar es en{" "}
          <span
            className="font-bold"
            style={{ color: theme.palette.secondary.medium }}
          >
            {info.generalTags?.season?.join(", ")}
          </span>
          .
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            marginTop: 3,
            color: theme.palette.primary.main,
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          Precio estimado: {info.price}€
        </Typography>
        <hr />
        <Box
          display="flex"
          sx={{
            flexWrap: "wrap",
            marginTop: 5,
            justifyContent: "space-between",
            textAlign: "left",
          }}
        >
          {info.categories === "Atractivos" && (
            <div className="-lg mb-4">
              <h4 className="font-bold mb-2">Tipo Atractivo</h4>
              <div className="flex flex-row items-start ml-2">
                {renderTags(info.attractionTags, attractionTags)}
              </div>
            </div>
          )}
          {info.categories === "Hoteles" && (
            <>
              <div className="-lg mb-4">
                <h4 className="font-bold mb-2">Tipo de alojamiento</h4>
                {renderTags(
                  info.hotelTags.accommodation,
                  hotelTags.accommodations
                )}
              </div>
              <div className="-lg mb-4">
                <h4 className="font-bold mb-2">Servicios</h4>
                {renderTags(
                  info.hotelTags.hotelServices,
                  hotelTags.hotelServices
                )}
              </div>
              <div className="-lg mb-4">
                <h4 className="font-bold mb-2">Tipo de viaje</h4>
                {renderTags(info.hotelTags.typeTrip, hotelTags.typeTrip)}
              </div>
            </>
          )}
          {info.categories === "Restaurantes" && (
            <>
              <div className="border -lg mb-4">
                <h4 className="font-bold mb-2">Tipo de restaurante</h4>
                {renderTags(
                  info.restaurantTags.restaurantTypes,
                  restaurantTags.restaurantTypes
                )}
              </div>
              <div className="border -lg mb-4">
                <h4 className="font-bold mb-2">Cocinas</h4>
                {renderTags(
                  info.restaurantTags.cuisines,
                  restaurantTags.cuisines
                )}
              </div>
              <div className="border -lg mb-4">
                <h4 className="font-bold mb-2">Servicios de restaurante</h4>
                {renderTags(
                  info.restaurantTags.restaurantServices,
                  restaurantTags.restaurantServices
                )}
              </div>
            </>
          )}
        </Box>
      </Box>

      {/* Right Section - Map & Contact Info */}
      <Box
        flex={{ xs: 1, md: 1 }}
        display="flex"
        flexDirection="column"
        sx={{ marginTop: 3 }}
      >
        <Box
          sx={{
            width: "100%",
            height: "300px",
            borderRadius: "8px",
            overflow: "hidden",
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
              >
                <Marker
                  position={coordinatesObj}
                  icon={getGoogleIcon(info.categories)}
                />
              </GoogleMap>
            </LoadScript>
          ) : (
            <Typography
              sx={{ textAlign: "center", color: theme.palette.error.main }}
            >
              ⚠️ Ubicación no disponible
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" marginTop="10px" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {info.generalTags.location.map((tag, index) => (
              <Typography key={index} variant="body1">
                {tag}.
              </Typography>
            ))}
          </Box>
        </Box>
        <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
          Datos de Contacto
        </Typography>
        <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
          <Map color={theme.palette.primary.main} size={20} />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            {info.address}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
          <Phone color={theme.palette.primary.main} size={20} />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            {info.phone}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
          <Mail color={theme.palette.primary.main} size={20} />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            {info.email}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
          <Globe color={theme.palette.primary.main} size={20} />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            <a
              href={info.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
            >
              {info.website}
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Aside;
