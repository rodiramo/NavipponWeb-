import React from "react";
import { useTheme, Typography, Box } from "@mui/material";
import { FaCalendarAlt } from "react-icons/fa";
import { Clock, Globe, Map, Phone, Mail, SunSnow } from "lucide-react";
import { generalTags, attractionTags, hotelTags, restaurantTags } from "./tags";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fontWeight } from "@mui/system";

// ✅ Custom Leaflet Marker Icon
const markerIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [38, 95],
});

const Aside = ({ info }) => {
  const theme = useTheme();
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

  // ✅ Get coordinates or use a default location (Tokyo)
  const coordinates = info.location
    ? [info.location.lat, info.location.lng]
    : [35.6895, 139.6917]; // Tokyo fallback

  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
      {/* Left Section - Takes More Space */}
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
        <Typography
          variant="body1"
          sx={{ marginBottom: 2, color: "text.secondary" }}
        >
          {info.caption}.
        </Typography>{" "}
        <Typography
          variant="body1"
          className="font-bold "
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
        </Typography>{" "}
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
          {/* Atractivo */}
          {info.categories === "Atractivos" && (
            <div className="-lg  mb-4">
              <h4 className="font-bold mb-2  ">Tipo Atractivo</h4>
              <div className="flex flex-row items-start  ml-2">
                {renderTags(info.attractionTags, attractionTags)}
              </div>
            </div>
          )}
          {/* Hotel */}
          {info.categories === "Hoteles" && (
            <>
              <div className="-lg  mb-4">
                <h4 className="font-bold mb-2  ">Tipo de alojamiento</h4>
                {renderTags(
                  info.hotelTags.accommodation,
                  hotelTags.accommodations
                )}
              </div>
              <div className="-lg  mb-4">
                <h4 className="font-bold mb-2  ">Servicios</h4>
                {renderTags(
                  info.hotelTags.hotelServices,
                  hotelTags.hotelServices
                )}
              </div>
              <div className="-lg  mb-4">
                <h4 className="font-bold mb-2  ">Tipo de viaje</h4>
                {renderTags(info.hotelTags.typeTrip, hotelTags.typeTrip)}
              </div>
            </>
          )}{" "}
          {/* Restaurante */}
          {info.categories === "Restaurantes" && (
            <>
              <div className=" border  -lg  mb-4">
                <h4 className="font-bold mb-2   ">Tipo de restaurante</h4>
                {renderTags(
                  info.restaurantTags.restaurantTypes,
                  restaurantTags.restaurantTypes
                )}
              </div>

              <div className=" border  -lg  mb-4">
                <h4 className="font-bold mb-2   ">Cocinas</h4>
                {renderTags(
                  info.restaurantTags.cuisines,
                  restaurantTags.cuisines
                )}
              </div>

              <div className=" border  -lg  mb-4">
                <h4 className="font-bold mb-2   ">Servicios de restaurante</h4>
                {renderTags(
                  info.restaurantTags.restaurantServices,
                  restaurantTags.restaurantServices
                )}
              </div>
            </>
          )}
        </Box>
      </Box>

      {/* Right Section - Map & Contact (Takes Less Space) */}
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
          <MapContainer
            center={coordinates}
            zoom={13}
            style={{ width: "100%", height: "100%", zIndex: " -99999" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coordinates} icon={markerIcon}>
              <Popup>
                <strong>{info.name || "Ubicación"}</strong>
              </Popup>
            </Marker>
          </MapContainer>
        </Box>{" "}
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
        </Box>{" "}
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
        </Box>{" "}
        <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
          <Clock color={theme.palette.primary.main} size={20} />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            {info.schedule}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Aside;
