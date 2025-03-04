import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { getGooglePlaceDetails, extractPlaceId } from "../services/index/map";

// Set your container style and default center (Tokyo as fallback)
const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 120px)",
};
const defaultCenter = { lat: 35.6895, lng: 139.6917 };

const MapAside = ({ experiences = [] }) => {
  const [places, setPlaces] = useState([]);

  // Fetch and update experiences using your existing logic
  useEffect(() => {
    const fetchPlaces = async () => {
      const updatedPlaces = await Promise.all(
        experiences.map(async (exp) => {
          const placeId = extractPlaceId(exp.googleMapsUrl);
          const nameInSpanish = placeId
            ? await getGooglePlaceDetails(placeId)
            : null;
          return {
            ...exp,
            name: nameInSpanish || exp.title,
          };
        })
      );
      setPlaces(updatedPlaces);
    };
    fetchPlaces();
  }, [experiences]);

  // Filter out valid experiences with proper coordinates
  const validExperiences = places.filter(
    (exp) =>
      exp?.location?.coordinates &&
      Array.isArray(exp.location.coordinates) &&
      exp.location.coordinates.length === 2
  );

  // Calculate the map center based on valid experiences or use fallback
  const mapCenter = validExperiences.length
    ? {
        lat: validExperiences[0].location.coordinates[1],
        lng: validExperiences[0].location.coordinates[0],
      }
    : defaultCenter;

  // Define a function to return a custom icon for each category
  const getExperienceIcon = (category) => {
    if (!window.google) return null; // safety check
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

  // When the map loads, create markers and cluster them
  const onLoad = useCallback(
    (map) => {
      if (!window.google || validExperiences.length === 0) return;
      // Create an array of google.maps.Marker objects
      const markers = validExperiences.map((exp) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: exp.location.coordinates[1],
            lng: exp.location.coordinates[0],
          },
          title: exp.name,
          icon: getExperienceIcon(exp.categories),
        });
        // Optionally add an info window for the marker
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${exp.name}</strong><br>${
            exp.location?.address || "No address available"
          }</div>`,
        });
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
        return marker;
      });

      // Use the official MarkerClusterer from @googlemaps/markerclusterer
      // (Ensure you've installed it: npm install @googlemaps/markerclusterer)
      // Note: Make sure MarkerClusterer is available on window if not import it directly.
      // Here, we import it dynamically:
      import("@googlemaps/markerclusterer").then(({ MarkerClusterer }) => {
        new MarkerClusterer({
          map,
          markers,
          imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });
      });
    },
    [validExperiences]
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 120px)",
        position: "sticky",
        top: 80,
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 10,
      }}
    >
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={6}
          onLoad={onLoad}
        />
      </LoadScript>
    </Box>
  );
};

export default MapAside;
