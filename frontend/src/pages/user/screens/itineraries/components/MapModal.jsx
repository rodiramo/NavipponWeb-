import React, { useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { X, MapPin, Navigation } from "lucide-react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const MapModal = ({ open, onClose, experiences, dayTitle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const markersRef = useRef([]);

  // Create global navigation function for info window buttons
  useEffect(() => {
    window.navigateToExperience = (slug) => {
      console.log("🔗 Navigating to experience:", slug);
      navigate(`/experience/${slug}`);
      // Optionally close the modal after navigation
      onClose();
    };

    return () => {
      delete window.navigateToExperience;
    };
  }, [navigate, onClose]);

  // Debug: Log the experiences structure
  useEffect(() => {
    if (experiences && experiences.length > 0) {
      console.log("🔍 Debugging experiences structure:");
      console.log("Full experiences array:", experiences);
      console.log("First experience:", experiences[0]);
      if (experiences[0]?.experienceId) {
        console.log(
          "First experience.experienceId:",
          experiences[0].experienceId
        );
        console.log(
          "First experience.experienceId.location:",
          experiences[0].experienceId.location
        );
      }
      if (experiences[0]?.location) {
        console.log("First experience.location:", experiences[0].location);
      }
    }
  }, [experiences]);

  // Filter experiences that have valid location data - check both possible structures
  const locatedExperiences = React.useMemo(() => {
    if (!experiences) return [];

    return experiences.filter((exp) => {
      // Check if location is directly on experienceId
      const hasExpIdLocation =
        exp?.experienceId?.location?.coordinates?.length === 2;
      // Check if location is directly on the experience
      const hasDirectLocation = exp?.location?.coordinates?.length === 2;
      // Check if experienceId itself has the location
      const hasNestedLocation =
        exp?.experienceId?.experienceId?.location?.coordinates?.length === 2;

      const isValid =
        hasExpIdLocation || hasDirectLocation || hasNestedLocation;

      if (isValid) {
        console.log("✅ Valid experience found:", {
          title: exp?.experienceId?.title || exp?.title,
          hasExpIdLocation,
          hasDirectLocation,
          hasNestedLocation,
          coordinates:
            exp?.experienceId?.location?.coordinates ||
            exp?.location?.coordinates ||
            exp?.experienceId?.experienceId?.location?.coordinates,
        });
      }

      return isValid;
    });
  }, [experiences]);

  // Helper function to get coordinates from experience
  const getCoordinates = (exp) => {
    if (exp?.experienceId?.location?.coordinates?.length === 2) {
      return exp.experienceId.location.coordinates;
    }
    if (exp?.location?.coordinates?.length === 2) {
      return exp.location.coordinates;
    }
    if (exp?.experienceId?.experienceId?.location?.coordinates?.length === 2) {
      return exp.experienceId.experienceId.location.coordinates;
    }
    return null;
  };

  // Helper function to get experience data
  const getExperienceData = (exp) => {
    return exp?.experienceId || exp;
  };

  // Calculate map center
  const mapCenter = React.useMemo(() => {
    if (!locatedExperiences.length) {
      return { lat: 35.6895, lng: 139.6917 }; // Default to Tokyo
    }

    let centerLat = 0;
    let centerLng = 0;

    locatedExperiences.forEach((exp) => {
      const coords = getCoordinates(exp);
      if (coords) {
        centerLat += coords[1]; // latitude
        centerLng += coords[0]; // longitude
      }
    });

    centerLat /= locatedExperiences.length;
    centerLng /= locatedExperiences.length;

    console.log("📍 Calculated map center:", {
      lat: centerLat,
      lng: centerLng,
    });

    return { lat: centerLat, lng: centerLng };
  }, [locatedExperiences]);

  // Clean up when modal closes
  useEffect(() => {
    if (!open) {
      // Clean up markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    }
  }, [open]);

  const onLoad = useCallback(
    (map) => {
      console.log("🗺️ Map loaded successfully!");

      if (!locatedExperiences.length) {
        console.log("⚠️ No located experiences to display");
        return;
      }

      // Move createInfoWindowContent function inside onLoad
      const createInfoWindowContent = (experience, coordinates, number) => {
        // Get the slug from the experience data
        const experienceSlug = experience.slug || experience._id;

        // Helper function for category colors (moved inside)
        const getCategoryColor = (category) => {
          const colors = {
            Cultura: "#9C27B0",
            Naturaleza: "#4CAF50",
            Aventura: "#FF5722",
            Gastronomía: "#FF9800",
            Compras: "#2196F3",
            Entretenimiento: "#E91E63",
            Deportes: "#795548",
            Other: "#607D8B",
          };
          return colors[category] || colors["Other"];
        };

        return `
          <div style="max-width: 250px; padding: 8px; font-family: Arial, sans-serif;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="
                background: ${getCategoryColor(experience.categories)};
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
              ">${number}</div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #333;">
                ${experience.title}
              </h3>
            </div>
            
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px; color: #666;">
              <span style="font-size: 14px;">📍 ${
                experience.prefecture || experience.address || "Ubicación"
              }</span>
            </div>
            
            ${
              experience.description
                ? `
              <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.4; margin-bottom: 8px;">
                ${
                  experience.description.length > 100
                    ? experience.description.substring(0, 100) + "..."
                    : experience.description
                }
              </p>
            `
                : ""
            }
            
            ${
              experience.price
                ? `
              <div style="margin-top: 8px; padding: 4px 8px; background: #f5f5f5; border-radius: 16px; display: inline-block;">
                <span style="font-weight: 600; color: #333;">€${experience.price}</span>
              </div>
            `
                : ""
            }
            
            <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
              <button 
                onclick="window.navigateToExperience('${experienceSlug}')"
                style="
                  background: rgb(224, 53, 101);
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: background-color 0.2s;
                  flex: 1;
                  min-width: 100px;
                "
                onmouseover="this.style.background='rgb(200, 45, 85)'"
                onmouseout="this.style.background='rgb(224, 53, 101)'"
              >
                Ver detalles
              </button>
              
              <button 
                onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(
                  experience.title
                )}/@${coordinates[1]},${coordinates[0]},15z', '_blank')"
                style="
                  background: #4285f4;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: background-color 0.2s;
                  flex: 1;
                  min-width: 100px;
                "
                onmouseover="this.style.background='#3367d6'"
                onmouseout="this.style.background='#4285f4'"
              >
                Abrir en maps
              </button>
            </div>
          </div>
        `;
      };

      console.log(
        "🎯 Creating markers for",
        locatedExperiences.length,
        "experiences"
      );

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Create bounds for auto-fitting
      const bounds = new window.google.maps.LatLngBounds();

      // Add markers for each experience
      locatedExperiences.forEach((exp, index) => {
        const coords = getCoordinates(exp);
        const experienceData = getExperienceData(exp);

        if (!coords) {
          console.warn(`⚠️ No coordinates found for experience ${index + 1}`);
          return;
        }

        const position = { lat: coords[1], lng: coords[0] };

        console.log(
          `Adding marker ${index + 1} at:`,
          position,
          "for:",
          experienceData.title
        );

        // Extend bounds
        bounds.extend(position);

        // Create custom marker
        const marker = new window.google.maps.Marker({
          position,
          map,
          title: experienceData.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: getCategoryColor(experienceData.categories),
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          label: {
            text: (index + 1).toString(),
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "12px",
          },
        });

        console.log(`✅ Marker ${index + 1} created successfully`);

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(experienceData, coords, index + 1),
        });

        // Add click listener
        marker.addListener("click", () => {
          // Close all other info windows
          markersRef.current.forEach((m) => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          infoWindow.open(map, marker);
        });

        marker.infoWindow = infoWindow;
        markersRef.current.push(marker);
      });

      // Fit map to show all markers (only if multiple locations)
      if (locatedExperiences.length > 1) {
        console.log("🔍 Fitting bounds for multiple locations...");
        map.fitBounds(bounds);

        // Add padding to bounds
        window.google.maps.event.addListenerOnce(map, "bounds_changed", () => {
          if (map.getZoom() > 15) {
            map.setZoom(15);
          }
        });
      } else {
        console.log("🎯 Setting zoom for single location...");
        map.setZoom(15);
      }

      console.log(
        "✅ All markers added successfully. Total markers:",
        markersRef.current.length
      );
    },
    [locatedExperiences] // Only locatedExperiences in dependency array
  );

  const getCategoryColor = (category) => {
    const colors = {
      Cultura: "#9C27B0",
      Naturaleza: "#4CAF50",
      Aventura: "#FF5722",
      Gastronomía: "#FF9800",
      Compras: "#2196F3",
      Entretenimiento: "#E91E63",
      Deportes: "#795548",
      Other: "#607D8B",
    };
    return colors[category] || colors["Other"];
  };

  const handleDirections = () => {
    if (!locatedExperiences.length) return;

    const waypoints = locatedExperiences
      .map((exp) => {
        const coords = getCoordinates(exp);
        return coords ? `${coords[1]},${coords[0]}` : null;
      })
      .filter(Boolean)
      .join("/");

    if (waypoints) {
      const url = `https://www.google.com/maps/dir/${waypoints}`;
      window.open(url, "_blank");
    }
  };

  // Always use LoadScript for reliability - simplest approach
  const renderMap = () => {
    console.log("📦 Using LoadScript for reliable Google Maps loading");
    return (
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        libraries={["places"]}
        onLoad={() => {
          console.log("✅ Google Maps loaded successfully via LoadScript");
        }}
        onError={(error) => {
          console.error("❌ Google Maps LoadScript error:", error);
        }}
        loadingElement={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundColor: "#f0f0f0",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography>Cargando Google Maps...</Typography>
          </Box>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={locatedExperiences.length === 1 ? 15 : 12}
          onLoad={onLoad}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        />
      </LoadScript>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <MapPin size={24} color={theme.palette.primary.main} />
          <Typography variant="h6" fontWeight={700}>
            {dayTitle || "Mapa del Día"}
          </Typography>
          <Chip
            label={`${locatedExperiences.length} ubicaciones`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {locatedExperiences.length > 1 && (
            <IconButton
              onClick={handleDirections}
              sx={{
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}10`,
                },
              }}
              title="Ver direcciones en Google Maps"
            >
              <Navigation size={20} />
            </IconButton>
          )}

          <IconButton onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: 500 }}>
        {locatedExperiences.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "0 0 12px 12px",
              overflow: "hidden",
            }}
          >
            {renderMap()}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: theme.palette.text.secondary,
            }}
          >
            <MapPin size={48} />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Sin ubicaciones disponibles
            </Typography>
            <Typography variant="body2" textAlign="center">
              Las experiencias de este día no tienen información de ubicación.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
