import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, CircularProgress, Alert, Modal, IconButton } from "@mui/material";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { MapPin, AlertCircle, RotateCcw, X, Maximize2 } from "lucide-react";
import {
  getGooglePlaceDetails,
  extractPlaceId,
} from "../../../services/index/map";

// Map container styles for modal
const modalMapContainerStyle = {
  width: "100%",
  height: "70vh", // Use viewport height for modals
  minHeight: "400px",
};

// Default center (Tokyo)
const defaultCenter = { lat: 35.6895, lng: 139.6917 };

// Google Maps libraries
const libraries = ["places"];

const ModalMap = ({
  experiences = [],
  open = false,
  onClose,
  title = "Mapa de Experiencias",
}) => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loadingState, setLoadingState] = useState("loading");
  const [placesLoading, setPlacesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const mapRef = useRef(null);
  const clustererRef = useRef(null);
  const markersRef = useRef([]);
  const modalContentRef = useRef(null);

  // Check if Google Maps API key is available
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  // Reset map state when modal opens/closes
  useEffect(() => {
    if (open) {
      setLoadingState("loading");
      setIsMapReady(false);
      setError(null);
      console.log("🗺️ Modal opened - initializing map");
    } else {
      // Clean up when modal closes
      cleanup();
      setIsMapReady(false);
      console.log("🗺️ Modal closed - cleaning up map");
    }
  }, [open]);

  // Create global navigation function for info window buttons
  useEffect(() => {
    window.navigateToExperience = (slug) => {
      navigate(`/experience/${slug}`);
      onClose(); // Close modal after navigation
    };

    return () => {
      delete window.navigateToExperience;
    };
  }, [navigate, onClose]);

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
      if (experiences.length === 0 || !open) {
        setPlaces([]);
        return;
      }

      setPlacesLoading(true);
      console.log(
        `🔄 Fetching place details for ${experiences.length} experiences`
      );

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
          console.log(
            `✅ Place details fetched for ${updatedPlaces.length} experiences`
          );
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

    if (open) {
      fetchPlaces();
    }

    return () => {
      mounted = false;
    };
  }, [experiences, open]);

  // Filter out valid experiences with proper coordinates
  const validExperiences = places.filter((exp, index) => {
    const hasLocation = exp?.location?.coordinates;
    const isArray = Array.isArray(exp.location?.coordinates);
    const hasCorrectLength = exp.location?.coordinates?.length === 2;
    const validLng = !isNaN(exp.location?.coordinates?.[0]);
    const validLat = !isNaN(exp.location?.coordinates?.[1]);

    const isValid =
      hasLocation && isArray && hasCorrectLength && validLng && validLat;

    if (!isValid) {
      console.warn(
        `❌ Experience "${exp.title}" filtered out from modal map:`,
        {
          hasLocation,
          isArray,
          hasCorrectLength,
          validLng,
          validLat,
        }
      );
    }

    return isValid;
  });

  // Calculate the map center and zoom
  const { mapCenter, initialZoom } = React.useMemo(() => {
    if (validExperiences.length === 0) {
      return { mapCenter: defaultCenter, initialZoom: 6 };
    }

    if (validExperiences.length === 1) {
      return {
        mapCenter: {
          lat: validExperiences[0].location.coordinates[1],
          lng: validExperiences[0].location.coordinates[0],
        },
        initialZoom: 13,
      };
    }

    // Calculate center for multiple experiences
    const lats = validExperiences.map((exp) => exp.location.coordinates[1]);
    const lngs = validExperiences.map((exp) => exp.location.coordinates[0]);

    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return {
      mapCenter: { lat: centerLat, lng: centerLng },
      initialZoom: 10,
    };
  }, [validExperiences]);

  // Get experience icon
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
        ">
          <span>📍 ${exp.address || "Dirección no disponible"}</span>
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
          ">
            ${exp.description.substring(0, 120)}${exp.description.length > 120 ? "..." : ""}
          </p>
        `
            : ""
        }
        
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
            margin-top: 12px;
          "
        >
          Ver Experiencia →
        </button>
      </div>
    </div>
  `,
    []
  );

  // When the map loads
  const onLoad = useCallback(
    async (map) => {
      try {
        mapRef.current = map;
        cleanup();

        console.log(
          `🗺️ Modal map loaded. Valid experiences: ${validExperiences.length}`
        );

        if (!window.google) {
          console.error("❌ Google Maps API not loaded in modal");
          setError("Google Maps no se pudo cargar");
          return;
        }

        if (validExperiences.length === 0) {
          console.warn("⚠️ No valid experiences for modal map");
          setIsMapReady(true);
          setLoadingState("loaded");
          return;
        }

        // Create markers
        const markers = validExperiences.map((exp, index) => {
          const position = {
            lat: exp.location.coordinates[1],
            lng: exp.location.coordinates[0],
          };

          const marker = new window.google.maps.Marker({
            position,
            title: exp.name,
            icon: getExperienceIcon(exp.categories),
            animation: window.google.maps.Animation.DROP,
            map: map,
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

        // Fit bounds if multiple markers
        if (markers.length > 1) {
          const bounds = new window.google.maps.LatLngBounds();
          markers.forEach((marker) => {
            bounds.extend(marker.getPosition());
          });
          map.fitBounds(bounds);

          // Prevent over-zooming
          const listener = window.google.maps.event.addListener(
            map,
            "bounds_changed",
            () => {
              if (map.getZoom() > 15) map.setZoom(15);
              window.google.maps.event.removeListener(listener);
            }
          );
        }

        // Set up clustering
        try {
          const { MarkerClusterer } = await import(
            "@googlemaps/markerclusterer"
          );

          if (window.google && mapRef.current && markers.length > 0) {
            clustererRef.current = new MarkerClusterer({
              map,
              markers,
              imagePath:
                "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            });
            console.log("✅ Modal map clustering setup complete");
          }
        } catch (clusterError) {
          console.warn("⚠️ MarkerClusterer failed in modal:", clusterError);
        }

        setIsMapReady(true);
        setLoadingState("loaded");
      } catch (error) {
        console.error("❌ Error setting up modal map:", error);
        setError("Error al configurar el mapa");
        setLoadingState("error");
      }
    },
    [validExperiences, getExperienceIcon, createInfoWindowContent, cleanup]
  );

  // Handle Google Maps load success
  const handleMapLoad = useCallback(() => {
    console.log("✅ Google Maps script loaded for modal");
  }, []);

  // Handle Google Maps load error
  const handleMapError = useCallback((error) => {
    console.error("❌ Google Maps failed to load in modal:", error);
    setLoadingState("error");
    setError("Error al cargar Google Maps. Verifica tu conexión.");
  }, []);

  // Retry function
  const handleRetry = useCallback(() => {
    setLoadingState("loading");
    setError(null);
    setIsMapReady(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Don't render if no API key
  if (!apiKey) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 300,
          }}
        >
          <Alert severity="error">Google Maps API key no configurado</Alert>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        ref={modalContentRef}
        sx={{
          width: "95vw",
          maxWidth: "1200px",
          height: "85vh",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#fafafa",
          }}
        >
          <div className="flex items-center gap-3">
            <MapPin size={24} className="text-red-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">
                {validExperiences.length} experiencias en el mapa
              </p>
            </div>
          </div>

          <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
            <X size={24} />
          </IconButton>
        </Box>

        {/* Map Container */}
        <Box sx={{ flex: 1, position: "relative" }}>
          {/* Loading Overlay */}
          {(loadingState === "loading" || placesLoading || !isMapReady) && (
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
                  Cargando mapa...
                </div>
                <div className="text-sm text-gray-500">
                  {validExperiences.length > 0 &&
                    `${validExperiences.length} ubicaciones`}
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

          {/* Map Component */}
          {open && (
            <LoadScript
              googleMapsApiKey={apiKey}
              libraries={libraries}
              onLoad={handleMapLoad}
              onError={handleMapError}
            >
              <GoogleMap
                mapContainerStyle={modalMapContainerStyle}
                center={mapCenter}
                zoom={initialZoom}
                onLoad={onLoad}
                options={{
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                  mapTypeControl: true,
                  fullscreenControl: true,
                  streetViewControl: true,
                  zoomControl: true,
                  gestureHandling: "greedy",
                }}
              />
            </LoadScript>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalMap;
