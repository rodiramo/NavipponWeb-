import React, { useState, useEffect } from "react";
import {
  Route,
  MapPin,
  Clock,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

// Utility functions (same as before)
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
  return R * c;
};

const getExperienceCoordinates = (experience) => {
  const coords =
    experience?.experienceId?.location?.coordinates ||
    experience?.location?.coordinates;

  if (!coords || coords.length !== 2) return null;

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
  if (distanceKm === null || distanceKm === undefined) return "N/A";

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else {
    return `${distanceKm.toFixed(1)}km`;
  }
};

const estimateTravelTime = (distanceKm, mode = "walking") => {
  if (distanceKm === null || distanceKm === undefined) return null;

  const speeds = {
    walking: 5,
    cycling: 15,
    driving: 30,
    transit: 20,
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

const calculateTotalDistance = (experiences) => {
  if (!experiences || experiences.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < experiences.length - 1; i++) {
    const distance = calculateExperienceDistance(
      experiences[i],
      experiences[i + 1]
    );
    if (distance !== null) {
      totalDistance += distance;
    }
  }

  return totalDistance;
};

const optimizeRoute = (experiences, startIndex = 0) => {
  if (!experiences || experiences.length <= 2) return experiences;

  const validExperiences = experiences.filter((exp) =>
    getExperienceCoordinates(exp)
  );
  if (validExperiences.length <= 2) return experiences;

  const optimized = [];
  const remaining = [...validExperiences];

  let current = remaining.splice(startIndex, 1)[0];
  optimized.push(current);

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateExperienceDistance(current, remaining[i]);
      if (distance !== null && distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    current = remaining.splice(nearestIndex, 1)[0];
    optimized.push(current);
  }

  return optimized;
};

const RouteOptimizer = ({
  experiences,
  onApplyOptimization,
  transportMode = "walking",
  boardIndex,
}) => {
  const [originalRoute, setOriginalRoute] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!experiences || experiences.length < 2) {
      setAnalysis(null);
      return;
    }

    const validExperiences = experiences.filter((exp) =>
      getExperienceCoordinates(exp)
    );
    if (validExperiences.length < 2) {
      setAnalysis(null);
      return;
    }

    setOriginalRoute(validExperiences);
    const optimized = optimizeRoute(validExperiences);
    setOptimizedRoute(optimized);

    // Calculate statistics
    const originalDistance = calculateTotalDistance(validExperiences);
    const optimizedDistance = calculateTotalDistance(optimized);
    const distanceSaved = originalDistance - optimizedDistance;
    const percentageImprovement = (distanceSaved / originalDistance) * 100;

    const originalTime = estimateTravelTime(originalDistance, transportMode);
    const optimizedTime = estimateTravelTime(optimizedDistance, transportMode);

    setAnalysis({
      originalDistance,
      optimizedDistance,
      distanceSaved,
      percentageImprovement,
      originalTime,
      optimizedTime,
      isWorthOptimizing: distanceSaved > 0.1 && percentageImprovement > 5,
      validExperiencesCount: validExperiences.length,
      totalExperiences: experiences.length,
    });
  }, [experiences, transportMode]);

  if (!analysis || !analysis.isWorthOptimizing) {
    return (
      <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200 my-2">
        <CheckCircle size={20} className="text-green-600 mr-2" />
        <span className="text-sm text-green-700">
          Tu ruta ya está optimizada ✨
        </span>
      </div>
    );
  }

  const handleApplyOptimization = () => {
    if (onApplyOptimization && optimizedRoute.length > 0) {
      onApplyOptimization(optimizedRoute);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Route size={20} className="text-blue-600 mr-2" />
          <h3 className="text-sm font-semibold text-blue-800">
            Optimización de Ruta
          </h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          {showDetails ? "Ocultar detalles" : "Ver detalles"}
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Mejora posible:</span>
          <div className="flex items-center">
            <TrendingDown size={16} className="text-green-600 mr-1" />
            <span className="text-sm font-semibold text-green-600">
              {formatDistance(analysis.distanceSaved)} menos
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({analysis.percentageImprovement.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-500">Ruta actual:</span>
            <div className="font-medium">
              {formatDistance(analysis.originalDistance)} •{" "}
              {analysis.originalTime}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Ruta optimizada:</span>
            <div className="font-medium text-green-600">
              {formatDistance(analysis.optimizedDistance)} •{" "}
              {analysis.optimizedTime}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      {showDetails && (
        <div className="bg-white rounded-lg p-3 mb-3">
          <h4 className="text-sm font-medium mb-3">Comparación de rutas:</h4>

          <div className="space-y-3">
            {/* Original Route */}
            <div>
              <div className="flex items-center mb-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Ruta Actual
                </span>
              </div>
              <div className="space-y-1">
                {originalRoute.map((exp, index) => (
                  <div key={index} className="text-xs flex items-center">
                    <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </span>
                    <span className="truncate">
                      {exp.experienceId?.title || "Experiencia sin nombre"}
                    </span>
                    {index < originalRoute.length - 1 && (
                      <span className="ml-auto text-gray-400">
                        {formatDistance(
                          calculateExperienceDistance(
                            exp,
                            originalRoute[index + 1]
                          )
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optimized Route */}
            <div>
              <div className="flex items-center mb-2">
                <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                  Ruta Optimizada
                </span>
              </div>
              <div className="space-y-1">
                {optimizedRoute.map((exp, index) => (
                  <div key={index} className="text-xs flex items-center">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </span>
                    <span className="truncate">
                      {exp.experienceId?.title || "Experiencia sin nombre"}
                    </span>
                    {index < optimizedRoute.length - 1 && (
                      <span className="ml-auto text-gray-400">
                        {formatDistance(
                          calculateExperienceDistance(
                            exp,
                            optimizedRoute[index + 1]
                          )
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning if some experiences don't have coordinates */}
      {analysis.validExperiencesCount < analysis.totalExperiences && (
        <div className="flex items-start bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <AlertTriangle
            size={16}
            className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
          />
          <div>
            <div className="text-xs text-yellow-800">
              {analysis.totalExperiences - analysis.validExperiencesCount}{" "}
              experiencia(s) sin ubicación no incluida(s) en la optimización.
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={handleApplyOptimization}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        <Route size={16} className="mr-2" />
        Aplicar Ruta Optimizada
        <ArrowRight size={16} className="ml-2" />
      </button>
    </div>
  );
};

export default RouteOptimizer;
