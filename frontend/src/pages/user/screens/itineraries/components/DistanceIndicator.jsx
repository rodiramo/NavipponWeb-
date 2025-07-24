import React, { useState } from "react";
import { MapPin, Clock, Navigation, Route } from "lucide-react";

// Import the distance utilities
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const getExperienceCoordinates = (experience) => {
  const coords =
    experience?.experienceId?.location?.coordinates ||
    experience?.location?.coordinates;

  if (!coords || coords.length !== 2) return null;

  // MongoDB stores coordinates as [longitude, latitude]
  return {
    lat: coords[1],
    lng: coords[0],
  };
};

const calculateExperienceDistance = (exp1, exp2) => {
  const coords1 = getExperienceCoordinates(exp1);
  const coords2 = getExperienceCoordinates(exp2);

  if (!coords1 || !coords2) return null;

  return calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
};

const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined)
    return "Ubicación no disponible";

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else {
    return `${distanceKm.toFixed(1)}km`;
  }
};

const estimateTravelTime = (distanceKm, mode = "walking") => {
  if (distanceKm === null || distanceKm === undefined) return null;

  const speeds = {
    walking: 5, // km/h
    cycling: 15, // km/h
    driving: 30, // km/h (city traffic)
    transit: 20, // km/h (public transport average)
  };

  const timeHours = distanceKm / speeds[mode];
  const timeMinutes = Math.round(timeHours * 60);

  if (timeMinutes < 60) {
    return `${timeMinutes}min`;
  } else {
    const hours = Math.floor(timeMinutes / 60);
    const minutes = timeMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
};

const DistanceIndicator = ({
  fromExperience,
  toExperience,
  showDetails = false,
  mode = "walking", // walking, driving, transit, cycling
}) => {
  const [expanded, setExpanded] = useState(false);

  const distance = calculateExperienceDistance(fromExperience, toExperience);
  const travelTime = estimateTravelTime(distance, mode);

  if (distance === null) {
    return (
      <div className="flex items-center justify-center py-2 px-4 my-2 bg-gray-100 rounded-lg border border-dashed border-gray-300">
        <MapPin size={14} className="text-gray-500" />
        <span className="ml-2 text-xs text-gray-600">
          Ubicación no disponible
        </span>
      </div>
    );
  }

  const getDistanceColorClass = (distanceKm) => {
    if (distanceKm < 0.5) return "text-green-600 border-green-500"; // Green for short
    if (distanceKm < 2) return "text-orange-600 border-orange-500"; // Orange for medium
    return "text-red-600 border-red-500"; // Red for long
  };

  const getModeIcon = (transportMode) => {
    switch (transportMode) {
      case "driving":
        return "🚗";
      case "transit":
        return "🚇";
      case "cycling":
        return "🚴";
      case "walking":
      default:
        return "🚶";
    }
  };

  const colorClass = getDistanceColorClass(distance);

  return (
    <div className="flex flex-col items-center py-2 my-2">
      {/* Main Distance Display */}
      <div
        className={`flex items-center bg-white rounded-full px-4 py-2 border shadow-sm transition-all duration-200 ${colorClass} ${
          showDetails ? "cursor-pointer hover:shadow-md hover:scale-105" : ""
        }`}
        onClick={() => showDetails && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Navigation
            size={14}
            className={colorClass.split(" ")[0]}
            style={{ transform: "rotate(45deg)" }}
          />
          <span className={`text-xs font-semibold ${colorClass.split(" ")[0]}`}>
            {formatDistance(distance)}
          </span>
          {travelTime && (
            <>
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <Clock size={12} className="text-gray-600" />
              <span className="text-xs text-gray-700">{travelTime}</span>
            </>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && showDetails && (
        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 min-w-[200px]">
          <h4 className="text-sm font-semibold mb-2">
            Opciones de transporte:
          </h4>

          {["walking", "cycling", "transit", "driving"].map((transportMode) => {
            const time = estimateTravelTime(distance, transportMode);
            return (
              <div
                key={transportMode}
                className="flex justify-between items-center py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getModeIcon(transportMode)}</span>
                  <span className="text-xs capitalize">
                    {transportMode === "walking"
                      ? "Caminando"
                      : transportMode === "cycling"
                        ? "Bicicleta"
                        : transportMode === "transit"
                          ? "Transporte público"
                          : "Coche"}
                  </span>
                </div>
                <span className="text-xs font-medium">{time}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DistanceIndicator;
