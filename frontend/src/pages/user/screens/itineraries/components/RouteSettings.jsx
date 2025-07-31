import React, { useState } from "react";
import { Settings, MapPin, Route } from "lucide-react";

const RouteSettings = ({
  transportMode,
  onTransportModeChange,
  showDistanceIndicators,
  onToggleDistanceIndicators,
  showRouteOptimizer,
  onToggleRouteOptimizer,
  userRole = "viewer",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (userRole === "viewer") return null;

  const transportModes = [
    { value: "walking", label: "Caminando", icon: "🚶", speed: "5 km/h" },
    { value: "cycling", label: "Bicicleta", icon: "🚴", speed: "15 km/h" },
    {
      value: "transit",
      label: "Transporte público",
      icon: "🚇",
      speed: "20 km/h",
    },
    { value: "driving", label: "Coche", icon: "🚗", speed: "30 km/h" },
  ];

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        title="Configuración de ruta"
      >
        <Settings size={20} />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Configuración de Ruta
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Transport Mode Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MapPin size={16} className="mr-2" />
              Modo de transporte
            </h4>
            <div className="space-y-2">
              {transportModes.map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    transportMode === mode.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="transportMode"
                    value={mode.value}
                    checked={transportMode === mode.value}
                    onChange={(e) => onTransportModeChange(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-xl mr-3">{mode.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      {mode.label}
                    </div>
                    <div className="text-xs text-gray-500">~{mode.speed}</div>
                  </div>
                  {transportMode === mode.value && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <Route size={16} className="mr-2" />
              Características
            </h4>

            {/* Distance Indicators Toggle */}
            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200">
              <div className="flex items-center">
                <MapPin size={16} className="mr-3 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    Indicadores de distancia
                  </div>
                  <div className="text-xs text-gray-500">
                    Mostrar distancia entre experiencias
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  onToggleDistanceIndicators(!showDistanceIndicators)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  showDistanceIndicators ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    showDistanceIndicators ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>

            {/* Route Optimizer Toggle */}
            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200">
              <div className="flex items-center">
                <Route size={16} className="mr-3 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    Optimizador de ruta
                  </div>
                  <div className="text-xs text-gray-500">
                    Sugerir rutas optimizadas
                  </div>
                </div>
              </div>
              <button
                onClick={() => onToggleRouteOptimizer(!showRouteOptimizer)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  showRouteOptimizer ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    showRouteOptimizer ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Info Section */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-800">
              <strong>💡 Consejo:</strong> Los tiempos de viaje son estimaciones
              basadas en velocidades promedio. Las distancias se calculan en
              línea recta entre ubicaciones.
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RouteSettings;
