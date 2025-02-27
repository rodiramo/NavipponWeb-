import React from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Typography } from "@mui/material";
import L from "leaflet";

// Define local icons for different categories
const hotelIcon = L.icon({
  iconUrl: "/assets/hotel-map.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const restaurantIcon = L.icon({
  iconUrl: "/assets/restaurant-map.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const attractionIcon = L.icon({
  iconUrl: "/assets/house-map.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Function to return the correct icon based on category
const getExperienceIcon = (category) => {
  if (category === "Atractivos") return attractionIcon;
  if (category === "Hoteles") return hotelIcon;
  if (category === "Restaurantes") return restaurantIcon;
  return attractionIcon; // Default
};

// New component that handles clustering
const ClusteredMarkers = ({ experiences }) => {
  return (
    <MarkerClusterGroup>
      {experiences.map((exp) => (
        <Marker
          key={exp._id}
          position={[exp.location.coordinates[1], exp.location.coordinates[0]]}
          icon={getExperienceIcon(exp.categories)}
        >
          <Popup>
            <Typography variant="subtitle1" fontWeight="bold">
              {exp.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {exp.location?.address || "No address available"}
            </Typography>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};

export default ClusteredMarkers;
