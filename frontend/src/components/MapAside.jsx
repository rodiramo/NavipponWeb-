import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, CircularProgress, Alert, Skeleton } from "@mui/material";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { MapPin, AlertCircle, RotateCcw } from "lucide-react";
import { getGooglePlaceDetails, extractPlaceId } from "../services/index/map";

// Set your container style and default center (Tokyo as fallback)
const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 120px)",
};
const defaultCenter = { lat: 35.6895, lng: 139.6917 };

// Google Maps libraries to load
const libraries = ["places"];

const MapAside = ({ experiences = [] }) => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loadingState, setLoadingState] = useState("loading"); // loading, loaded, error
  const [placesLoading, setPlacesLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const clustererRef = useRef(null);
  const markersRef = useRef([]);

  // Check if Google Maps API key is available
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  if (!apiKey) {
    console.error(
      "Google Maps API key not found. Please set REACT_APP_GOOGLE_API_KEY in your environment variables."
    );
  }

  // Create global navigation function for info window buttons
  useEffect(() => {
    window.navigateToExperience = (slug) => {
      navigate(`/experience/${slug}`);
    };

    return () => {
      delete window.navigateToExperience;
    };
  }, [navigate]);

  // Cleanup function for markers and clusterer
  const cleanup = useCallback(() => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    markersRef.current.forEach((marker) => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];
  }, []);

  // Fetch and update experiences with place details
  useEffect(() => {
    let mounted = true;

    const fetchPlaces = async () => {
      if (experiences.length === 0) {
        setPlaces([]);
        return;
      }

      setPlacesLoading(true);
      try {
        const updatedPlaces = await Promise.all(
          experiences.map(async (exp) => {
            try {
              const placeId = extractPlaceId(exp.googleMapsUrl);
              const nameInSpanish = placeId
                ? await getGooglePlaceDetails(placeId)
                : null;
              return {
                ...exp,
                name: nameInSpanish || exp.title,
              };
            } catch (error) {
              console.warn(
                `Failed to fetch place details for ${exp.title}:`,
                error
              );
              return {
                ...exp,
                name: exp.title,
              };
            }
          })
        );

        if (mounted) {
          setPlaces(updatedPlaces);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
        if (mounted) {
          setPlaces(experiences.map((exp) => ({ ...exp, name: exp.title })));
        }
      } finally {
        if (mounted) {
          setPlacesLoading(false);
        }
      }
    };

    fetchPlaces();
    return () => {
      mounted = false;
    };
  }, [experiences]);

  // Filter out valid experiences with proper coordinates + DEBUG LOGGING
  const validExperiences = places.filter((exp, index) => {
    const hasLocation = exp?.location?.coordinates;
    const isArray = Array.isArray(exp.location?.coordinates);
    const hasCorrectLength = exp.location?.coordinates?.length === 2;
    const validLng = !isNaN(exp.location?.coordinates?.[0]);
    const validLat = !isNaN(exp.location?.coordinates?.[1]);

    const isValid =
      hasLocation && isArray && hasCorrectLength && validLng && validLat;

    // Debug logging for invalid experiences
    if (!isValid) {
      console.warn(`❌ Experience "${exp.title}" filtered out:`, {
        title: exp.title,
        hasLocation,
        isArray,
        hasCorrectLength,
        coordinates: exp.location?.coordinates,
        validLng,
        validLat,
        fullLocation: exp.location,
      });
    } else {
      console.log(
        `✅ Valid experience: "${exp.title}" at [${exp.location.coordinates[1]}, ${exp.location.coordinates[0]}]`
      );
    }

    return isValid;
  });

  // Debug logging for overall filtering results
  useEffect(() => {
    console.log(`📊 MAP DEBUG SUMMARY:`);
    console.log(`- Total experiences received: ${experiences.length}`);
    console.log(`- Places with details fetched: ${places.length}`);
    console.log(`- Valid experiences for map: ${validExperiences.length}`);
    console.log(
      `- Experiences without valid coordinates: ${experiences.length - validExperiences.length}`
    );

    if (validExperiences.length === 0 && experiences.length > 0) {
      console.error(
        `🚨 NO VALID EXPERIENCES FOR MAP! Check coordinate format in database.`
      );
      console.log(
        "Expected format: { location: { coordinates: [longitude, latitude] } }"
      );
    }
  }, [experiences.length, places.length, validExperiences.length]);

  // Calculate the map center based on valid experiences or use fallback
  const mapCenter = validExperiences.length
    ? {
        lat: validExperiences[0].location.coordinates[1],
        lng: validExperiences[0].location.coordinates[0],
      }
    : defaultCenter;

  // Define a function to return a custom icon for each category
  const getExperienceIcon = useCallback((category) => {
    if (!window.google) return null;

    const iconMap = {
      Atractivos: "/assets/house-map.png",
      Hoteles: "/assets/hotel-map.png",
      Restaurantes: "/assets/restaurant-map.png",
    };

    return {
      url: iconMap[category] || "/assets/house-map.png",
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32),
    };
  }, []);

  // Create info window content
  const createInfoWindowContent = useCallback(
    (exp) => `
    <div style="max-width: 280px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
      ${
        exp.image
          ? `
        <div style="position: relative; margin-bottom: 12px;">
          <img 
            src="${exp.image}" 
            alt="${exp.name}"
            style="
              width: 100%; 
              height: 140px; 
              object-fit: cover; 
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            "
            onerror="this.parentElement.style.display='none'"
          />
        </div>
      `
          : ""
      }
      <div style="padding: 2px 0;">
        <h3 style="
          font-size: 16px; 
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          line-height: 1.3;
        ">${exp.name}</h3>
        
        <div style="
          font-size: 13px; 
          color: #6b7280; 
          margin-bottom: 10px;
          display: flex;
          align-items: flex-start;
          gap: 4px;
        ">
          <span style="color: #9ca3af; margin-top: 1px;">📍</span>
          <span style="line-height: 1.4;">${exp.address || "Dirección no disponible"}</span>
        </div>
        
        ${
          exp.description
            ? `
          <p style="
            font-size: 13px; 
            color: #4b5563; 
            margin: 10px 0; 
            line-height: 1.4;
            max-height: 54px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          ">
            ${exp.description.substring(0, 120)}${exp.description.length > 120 ? "..." : ""}
          </p>
        `
            : ""
        }
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 12px 0;">
          ${
            exp.rating
              ? `
            <div style="
              display: flex; 
              align-items: center; 
              gap: 4px;
              background: #fef3f2;
              padding: 4px 8px;
              border-radius: 6px;
              border: 1px solid #fecaca;
            ">
              <span style="color: #dc2626; font-size: 12px;">⭐</span>
              <span style="color: #dc2626; font-size: 12px; font-weight: 600;">
                ${exp.rating}/5
              </span>
            </div>
          `
              : "<div></div>"
          }
          
          <span style="
            font-size: 11px;
            color: #9ca3af;
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
          ">${exp.categories || "Experiencia"}</span>
        </div>
        
        <button 
          onclick="window.navigateToExperience('${exp.slug}')" 
          style="
            background: linear-gradient(135deg, #e11d48 0%, #be185d 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(225, 29, 72, 0.2);
          "
          onmouseover="
            this.style.background='linear-gradient(135deg, #be185d 0%, #9d174d 100%)';
            this.style.transform='translateY(-1px)';
            this.style.boxShadow='0 4px 12px rgba(225, 29, 72, 0.3)';
          "
          onmouseout="
            this.style.background='linear-gradient(135deg, #e11d48 0%, #be185d 100%)';
            this.style.transform='translateY(0)';
            this.style.boxShadow='0 2px 4px rgba(225, 29, 72, 0.2)';
          "
        >
          Ver Experiencia →
        </button>
      </div>
    </div>
  `,
    []
  );

  // When the map loads, create markers and cluster them
  const onLoad = useCallback(
    async (map) => {
      try {
        mapRef.current = map;
        cleanup(); // Clean up previous markers

        if (!window.google || validExperiences.length === 0) return;

        // Create markers
        const markers = validExperiences.map((exp) => {
          const marker = new window.google.maps.Marker({
            position: {
              lat: exp.location.coordinates[1],
              lng: exp.location.coordinates[0],
            },
            title: exp.name,
            icon: getExperienceIcon(exp.categories),
            animation: window.google.maps.Animation.DROP,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: createInfoWindowContent(exp),
            maxWidth: 300,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          return marker;
        });

        markersRef.current = markers;

        // Load MarkerClusterer dynamically
        const { MarkerClusterer } = await import("@googlemaps/markerclusterer");

        if (window.google && mapRef.current) {
          clustererRef.current = new MarkerClusterer({
            map,
            markers,
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
          });
        }
      } catch (error) {
        console.error("Error setting up map markers:", error);
        setError("Failed to load map markers");
      }
    },
    [validExperiences, getExperienceIcon, createInfoWindowContent, cleanup]
  );

  // Handle Google Maps load success
  const handleMapLoad = useCallback(() => {
    setLoadingState("loaded");
    setError(null);
  }, []);

  // Handle Google Maps load error
  const handleMapError = useCallback((error) => {
    console.error("Google Maps failed to load:", error);
    setLoadingState("error");
    setError(
      "Failed to load Google Maps. Please check your internet connection and try again."
    );
  }, []);

  // Retry function
  const handleRetry = useCallback(() => {
    setLoadingState("loading");
    setError(null);
    window.location.reload(); // Simple retry by reloading
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Don't render if no API key
  if (!apiKey) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          Google Maps API key not configured. Please contact support.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 120px)",
        position: "sticky",
        top: 80,
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        zIndex: 10,
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Loading Overlay */}
      {(loadingState === "loading" || placesLoading) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            gap: 2,
          }}
        >
          <CircularProgress size={40} sx={{ color: "#e11d48" }} />
          <div className="text-center">
            <div className="font-semibold text-gray-700 mb-1">
              {placesLoading ? "Cargando experiencias..." : "Cargando mapa..."}
            </div>
            <div className="text-sm text-gray-500">
              {validExperiences.length > 0 &&
                `${validExperiences.length} ubicaciones encontradas`}
            </div>
          </div>
        </Box>
      )}

      {/* Error State */}
      {loadingState === "error" && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            p: 3,
            backgroundColor: "#f9fafb",
          }}
        >
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <div className="text-lg font-semibold text-gray-700 mb-2 text-center">
            Error al cargar el mapa
          </div>
          <div className="text-sm text-gray-500 mb-6 text-center max-w-md">
            {error || "Ha ocurrido un problema al cargar Google Maps"}
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <RotateCcw size={16} />
            Reintentar
          </button>
        </Box>
      )}

      {/* Experience Counter */}
      {validExperiences.length > 0 && loadingState === "loaded" && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 100,
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "8px 12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MapPin size={16} className="text-red-500" />
          <span className="text-sm font-semibold text-gray-700">
            {validExperiences.length} experiencias
          </span>
        </Box>
      )}

      {/* Map Component */}
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
        onLoad={handleMapLoad}
        onError={handleMapError}
        loadingElement={<Skeleton variant="rectangular" height="100%" />}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={validExperiences.length > 0 ? 10 : 6}
          onLoad={onLoad}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: false,
          }}
        />
      </LoadScript>
    </Box>
  );
};

export default MapAside;
