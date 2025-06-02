// Fixed MapModal.jsx - Uses existing Google Maps instance (no LoadScript)

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import { X, MapPin, Navigation } from "lucide-react";

const MapModal = ({ open, onClose, experiences, dayTitle }) => {
  const theme = useTheme();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  // Filter experiences that have valid location data
  const locatedExperiences =
    experiences?.filter(
      (exp) => exp?.experienceId?.location?.coordinates?.length === 2
    ) || [];

  // Wait for dialog to be fully rendered
  useEffect(() => {
    if (open && mapRef.current) {
      const timer = setTimeout(() => {
        setMapReady(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setMapReady(false);
    }
  }, [open]);

  useEffect(() => {
    if (!mapReady || !locatedExperiences.length || !mapRef.current) return;

    console.log("=== MAP MODAL DEBUG (No LoadScript) ===");
    console.log("Map ready:", mapReady);
    console.log("Located experiences:", locatedExperiences);
    console.log("Map ref current:", mapRef.current);
    console.log("Google Maps loaded:", !!window.google);

    // Check if Google Maps is available
    if (!window.google || !window.google.maps) {
      console.error("❌ Google Maps not available");
      showFallbackInterface();
      return;
    }

    try {
      initializeMap();
    } catch (error) {
      console.error("❌ Error initializing map:", error);
      showFallbackInterface();
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [mapReady, locatedExperiences]);

  const initializeMap = () => {
    console.log("Initializing map...");
    console.log("Located experiences count:", locatedExperiences.length);

    if (!mapRef.current || !locatedExperiences.length) {
      console.error("Cannot initialize map: missing ref or experiences");
      return;
    }

    // Clear the container first
    mapRef.current.innerHTML = "";

    // Calculate center from all locations
    let centerLat = 0;
    let centerLng = 0;

    locatedExperiences.forEach((exp, index) => {
      const coords = exp.experienceId.location.coordinates;
      console.log(`Experience ${index + 1} coordinates:`, coords);
      centerLat += coords[1]; // latitude
      centerLng += coords[0]; // longitude
    });

    centerLat /= locatedExperiences.length;
    centerLng /= locatedExperiences.length;

    const mapCenter = { lat: centerLat, lng: centerLng };
    console.log("Map center:", mapCenter);

    // Create map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: locatedExperiences.length === 1 ? 15 : 12,
      mapTypeId: "roadmap",
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    console.log("✅ Map created successfully");
    mapInstanceRef.current = map;

    // Create bounds for auto-fitting
    const bounds = new window.google.maps.LatLngBounds();

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each experience
    locatedExperiences.forEach((exp, index) => {
      const coords = exp.experienceId.location.coordinates;
      const position = { lat: coords[1], lng: coords[0] };

      console.log(`Adding marker ${index + 1} at:`, position);

      // Extend bounds
      bounds.extend(position);

      // Create custom marker
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: exp.experienceId.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: getCategoryColor(exp.experienceId.categories),
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

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(exp.experienceId, index + 1),
      });

      // Add click listener
      marker.addListener("click", () => {
        // Close all other info windows
        markersRef.current.forEach((m) => m.infoWindow?.close());
        infoWindow.open(map, marker);
      });

      marker.infoWindow = infoWindow;
      markersRef.current.push(marker);
    });

    // Fit map to show all markers (only if multiple locations)
    if (locatedExperiences.length > 1) {
      map.fitBounds(bounds);
    }

    console.log("✅ All markers added successfully");
  };

  const showFallbackInterface = () => {
    if (!mapRef.current) return;

    mapRef.current.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 20px;
        background: #f5f5f5;
        text-align: center;
      ">
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">📍 Ubicaciones del Día</h3>
          <p style="color: #666; margin-bottom: 20px;">Haz clic en una ubicación para abrirla en Google Maps</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 400px;">
          ${locatedExperiences
            .map((exp, index) => {
              const coords = exp.experienceId.location.coordinates;
              const title = exp.experienceId.title;
              const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(
                title
              )}/@${coords[1]},${coords[0]},15z`;

              return `
              <a href="${mapUrl}" target="_blank" style="
                display: flex;
                align-items: center;
                padding: 15px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                text-decoration: none;
                color: #333;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              " onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'; this.style.transform='translateY(-2px)';" 
                 onmouseout="this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)';">
                <div style="
                  background: ${getCategoryColor(exp.experienceId.categories)};
                  color: white;
                  border-radius: 50%;
                  width: 30px;
                  height: 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 14px;
                  margin-right: 15px;
                  flex-shrink: 0;
                ">${index + 1}</div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${title}</div>
                  <div style="color: #666; font-size: 14px;">${
                    exp.experienceId.prefecture || "Ver en mapa"
                  }</div>
                </div>
                <div style="color: #999; font-size: 12px;">Abrir →</div>
              </a>
            `;
            })
            .join("")}
        </div>
        
        ${
          locatedExperiences.length > 1
            ? `
          <div style="margin-top: 20px;">
            <a href="https://www.google.com/maps/dir/${locatedExperiences
              .map((exp) => {
                const coords = exp.experienceId.location.coordinates;
                return `${coords[1]},${coords[0]}`;
              })
              .join("/")}" target="_blank" style="
              display: inline-flex;
              align-items: center;
              padding: 12px 20px;
              background: #4285f4;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              transition: background 0.2s ease;
            " onmouseover="this.style.background='#3367d6';" onmouseout="this.style.background='#4285f4';">
              🗺️ Ver ruta completa en Google Maps
            </a>
          </div>
        `
            : ""
        }
      </div>
    `;
  };

  const createInfoWindowContent = (experience, number) => {
    return `
      <div style="max-width: 250px; padding: 8px;">
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
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${
            experience.title
          }</h3>
        </div>
        
        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px; color: #666;">
          <span style="font-size: 14px;">${
            experience.prefecture || "Ubicación"
          }</span>
        </div>
        
        ${
          experience.description
            ? `
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.4;">
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
      </div>
    `;
  };

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
        const coords = exp.experienceId.location.coordinates;
        return `${coords[1]},${coords[0]}`;
      })
      .join("/");

    const url = `https://www.google.com/maps/dir/${waypoints}`;
    window.open(url, "_blank");
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
            ref={mapRef}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "0 0 12px 12px",
              backgroundColor: "#f0f0f0",
            }}
          />
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
