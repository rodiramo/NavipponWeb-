import React, { useEffect } from "react";
import { FaSnowflake, FaSun, FaLeaf, FaTree } from "react-icons/fa";
import { MdAttachMoney, MdStars, MdLocationOn } from "react-icons/md";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Updated to match backend expectations
const generalTags = {
  season: [
    { icon: <FaLeaf />, label: "Primavera" },
    { icon: <FaSun />, label: "Verano" },
    { icon: <FaTree />, label: "Otoño" },
    { icon: <FaSnowflake />, label: "Invierno" },
    { icon: <MdStars />, label: "Todo el año" },
  ],
  budget: [
    { icon: <MdAttachMoney />, label: "Gratis" },
    { icon: <MdAttachMoney />, label: "Económico" },
    { icon: <MdAttachMoney />, label: "Moderado" },
    { icon: <MdAttachMoney />, label: "Lujo" },
  ],
  location: [
    { icon: <MdLocationOn />, label: "Cerca de estaciones de tren o metro" },
    { icon: <MdLocationOn />, label: "Cerca de aeropuertos" },
    { icon: <MdLocationOn />, label: "Cerca de áreas de puntos de interés" },
  ],
};

// Mapping for potential database value mismatches
const tagValueMapping = {
  season: {
    spring: "Primavera",
    summer: "Verano",
    autumn: "Otoño",
    fall: "Otoño",
    winter: "Invierno",
    all_year: "Todo el año",
    year_round: "Todo el año",
    // Add Spanish versions in case database has them
    primavera: "Primavera",
    verano: "Verano",
    otoño: "Otoño",
    invierno: "Invierno",
    "todo el año": "Todo el año",
  },
  budget: {
    free: "Gratis",
    budget: "Económico",
    economic: "Económico",
    economico: "Económico",
    moderate: "Moderado",
    moderado: "Moderado",
    luxury: "Lujo",
    lujo: "Lujo",
    expensive: "Lujo",
    // Add exact matches
    gratis: "Gratis",
    económico: "Económico",
  },
  location: {
    train_station: "Cerca de estaciones de tren o metro",
    metro_station: "Cerca de estaciones de tren o metro",
    airport: "Cerca de aeropuertos",
    poi: "Cerca de áreas de puntos de interés",
    points_of_interest: "Cerca de áreas de puntos de interés",
    // Add Spanish versions
    "cerca de estaciones de tren o metro":
      "Cerca de estaciones de tren o metro",
    "cerca de aeropuertos": "Cerca de aeropuertos",
    "cerca de áreas de puntos de interés":
      "Cerca de áreas de puntos de interés",
  },
};

// Updated display names for Spanish UI
const tagDisplayNames = {
  season: "Estación",
  budget: "Presupuesto",
  location: "Ubicación",
};

// Helper function to convert component format back to database format
// Note: This only handles season, budget, and location.
// Rating should be handled separately in your form.
export const convertTagsToDbFormat = (componentTags) => {
  const dbFormat = {};
  Object.keys(componentTags || {}).forEach((tagType) => {
    if (componentTags[tagType]) {
      dbFormat[tagType] = [componentTags[tagType]]; // Convert single value to array
    }
  });
  return dbFormat;
};

const GeneralTags = ({
  selectedGeneralTags,
  setSelectedGeneralTags,
  initialData,
}) => {
  const theme = useTheme();

  // Debug: Log the props being received
  useEffect(() => {
    console.log("🔍 GeneralTags Debug Info:");
    console.log("selectedGeneralTags:", selectedGeneralTags);
    console.log("initialData:", initialData);

    // If we have initial data but selectedGeneralTags is empty, populate it
    if (
      initialData &&
      (!selectedGeneralTags || Object.keys(selectedGeneralTags).length === 0)
    ) {
      console.log("🔄 Populating selectedGeneralTags from initialData");

      const mappedTags = {};

      // Handle the specific database format where tags are stored as arrays
      if (initialData.generalTags) {
        const { generalTags: dbGeneralTags } = initialData;

        // Map each tag type from database format (arrays) to component format (single values)
        Object.keys(generalTags).forEach((tagType) => {
          if (
            dbGeneralTags[tagType] &&
            Array.isArray(dbGeneralTags[tagType]) &&
            dbGeneralTags[tagType].length > 0
          ) {
            // Take the first value from the array
            const dbValue = dbGeneralTags[tagType][0];
            const mappedValue = mapDatabaseValue(tagType, dbValue);
            if (mappedValue) {
              mappedTags[tagType] = mappedValue;
              console.log(
                `✅ Mapped ${tagType}: [${dbValue}] → "${mappedValue}"`
              );
            } else {
              console.log(`❌ Could not map ${tagType}: [${dbValue}]`);
            }
          }
        });
      } else {
        // Fallback: try to map direct properties (legacy format)
        Object.keys(generalTags).forEach((tagType) => {
          if (initialData[tagType]) {
            const dbValue = Array.isArray(initialData[tagType])
              ? initialData[tagType][0]
              : initialData[tagType];
            const mappedValue = mapDatabaseValue(tagType, dbValue);
            if (mappedValue) {
              mappedTags[tagType] = mappedValue;
              console.log(
                `✅ Mapped ${tagType}: "${dbValue}" → "${mappedValue}"`
              );
            } else {
              console.log(`❌ Could not map ${tagType}: "${dbValue}"`);
            }
          }
        });
      }

      if (Object.keys(mappedTags).length > 0) {
        setSelectedGeneralTags(mappedTags);
        console.log("🎯 Final mapped tags:", mappedTags);
      }
    }
  }, [initialData, selectedGeneralTags, setSelectedGeneralTags]);

  // Function to map database values to display labels
  const mapDatabaseValue = (tagType, dbValue) => {
    if (!dbValue) return null;

    // Handle both array and string values
    const actualValue = Array.isArray(dbValue) ? dbValue[0] : dbValue;

    // Convert to string and normalize for comparison
    const normalizedValue = actualValue.toString().toLowerCase().trim();

    // Check if we have a mapping for this value
    if (tagValueMapping[tagType] && tagValueMapping[tagType][normalizedValue]) {
      return tagValueMapping[tagType][normalizedValue];
    }

    // Check if the value already matches one of our labels (case-insensitive)
    const availableLabels = generalTags[tagType].map((tag) => tag.label);
    const exactMatch = availableLabels.find(
      (label) => label.toLowerCase() === normalizedValue
    );

    if (exactMatch) {
      return exactMatch;
    }

    // If no mapping found, return the original value and log it
    console.warn(`⚠️ No mapping found for ${tagType}: "${actualValue}"`);
    return actualValue;
  };

  const handleChipClick = (tagType, tagValue) => {
    console.log(`🎯 Selecting ${tagType}: ${tagValue}`);

    setSelectedGeneralTags((prevTags) => {
      const newTags = {
        ...prevTags,
        [tagType]: prevTags[tagType] === tagValue ? null : tagValue, // Toggle selection
      };
      console.log("📋 Updated selectedGeneralTags:", newTags);
      return newTags;
    });
  };

  // Ensure selectedGeneralTags is always an object
  const safeTags = selectedGeneralTags || {};

  return (
    <Box className="mb-5 mt-2">
      {Object.keys(generalTags).map((tagType) => (
        <Box key={tagType} sx={{ marginBottom: "1.5rem" }}>
          <Typography
            sx={{
              fontWeight: "600",
              color: theme.palette.text.primary,
              mb: 1,
              fontSize: "1rem",
            }}
          >
            {tagDisplayNames[tagType]}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              marginTop: "8px",
            }}
          >
            {generalTags[tagType].map(({ label, icon }) => {
              const isSelected = safeTags[tagType] === label;

              return (
                <Chip
                  key={label}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        py: 0.5,
                      }}
                    >
                      {icon}
                      <Typography variant="body2" component="span">
                        {label}
                      </Typography>
                    </Box>
                  }
                  onClick={() => handleChipClick(tagType, label)}
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{
                    backgroundColor: isSelected
                      ? theme.palette.primary.main
                      : "transparent",
                    color: isSelected
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    border: `1.5px solid ${
                      isSelected
                        ? theme.palette.primary.main
                        : theme.palette.primary.light
                    }`,
                    borderRadius: "20px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? theme.palette.primary.dark
                        : theme.palette.primary.light,
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-1px)",
                    },
                    "& .MuiChip-label": {
                      padding: "0 4px",
                    },
                  }}
                />
              );
            })}
          </Box>

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                mt: 0.5,
                display: "block",
                fontFamily: "monospace",
              }}
            >
              Debug: {tagType} = "{safeTags[tagType] || "none"}"
            </Typography>
          )}
        </Box>
      ))}

      {/* Usage example for saving back to database */}
      {process.env.NODE_ENV === "development" && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", display: "block" }}
          >
            💡 To save back to database, use:
            convertTagsToDbFormat(selectedGeneralTags)
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", display: "block", mt: 1 }}
          >
            Result: {JSON.stringify(convertTagsToDbFormat(safeTags), null, 2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GeneralTags;
