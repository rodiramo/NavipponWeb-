import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { getGooglePlaceDetails, extractPlaceId } from "../services/index/map";

// Set your container style and default center (Tokyo as fallback)
const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 120px)",
};
const defaultCenter = { lat: 35.6895, lng: 139.6917 };

const MapAside = ({ experiences = [] }) => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);

  // Create global navigation function for info window buttons
  useEffect(() => {
    window.navigateToExperience = (slug) => {
      navigate(`/experience/${slug}`);
    };

    return () => {
      delete window.navigateToExperience;
    };
  }, [navigate]);

  // Fetch and update experiences using your existing logic
  useEffect(() => {
    let mounted = true;
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
      if (mounted) {
        setPlaces(updatedPlaces);
      }
    };
    fetchPlaces();
    return () => {
      mounted = false;
    };
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

        // Enhanced info window with image, address, description, rating, and button
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="max-width: 250px; font-family: Arial, sans-serif;">
              ${
                exp.image
                  ? `
                <img 
                  src="${exp.image}" 
                  alt="${exp.name}"
                  style="
                    width: 100%; 
                    height: 120px; 
                    object-fit: cover; 
                    border-radius: 8px;
                    margin-bottom: 8px;
                  "
                  onerror="this.style.display='none'"
                />
              `
                  : ""
              }
              <div style="padding: 4px 0;">
                <strong style="font-size: 16px; color: #333;">${
                  exp.name
                }</strong>
                <br>
                <span style="font-size: 14px; color: #666; line-height: 1.4;">
                  ${exp.address || "No address available"}
                </span>
                ${
                  exp.description
                    ? `
                  <br>
                  <p style="
                    font-size: 12px; 
                    color: #888; 
                    margin: 8px 0 0 0; 
                    line-height: 1.3;
                    max-height: 60px;
                    overflow: hidden;
                  ">
                    ${exp.description.substring(0, 100)}${
                        exp.description.length > 100 ? "..." : ""
                      }
                  </p>
                `
                    : ""
                }
                ${
                  exp.rating
                    ? `
                  <div style="margin-top: 8px; font-size: 12px; color: rgb(224, 53, 101);">
                    ⭐ ${exp.rating}/5
                  </div>
                `
                    : ""
                }
                
                <button 
                  onclick="window.navigateToExperience('${exp.slug}')" 
                  style="
                    background: rgb(224, 53, 101);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 30px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-top: 12px;
                    width: 100%;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.background='rgb(200, 45, 85)'"
                  onmouseout="this.style.background='rgb(224, 53, 101)'"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
        return marker;
      });

      // Use the official MarkerClusterer from @googlemaps/markerclusterer
      // (Ensure you've installed it: npm install @googlemaps/markerclusterer)
      import("@googlemaps/markerclusterer").then(({ MarkerClusterer }) => {
        // Before creating the clusterer, double-check that the google object is still available.
        if (!window.google) return;
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
