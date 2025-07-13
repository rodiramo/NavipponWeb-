import React, { useEffect } from "react";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Leaf,
  Sun,
  Flower2,
  Snowflake,
  Infinity,
  HandHelping,
  PiggyBank,
  CircleDollarSign,
  Crown,
  Coins,
  TrainFront,
  Plane,
  Building2,
  Store,
  Mountain,
  Waves,
  Trees,
} from "lucide-react";

// ✅ UPDATED: Now matches schema exactly!
const generalTags = {
  season: [
    { icon: <Flower2 />, label: "Primavera (Sakura)" },
    { icon: <Sun />, label: "Verano (Festivales)" },
    { icon: <Leaf />, label: "Otoño (Koyo)" },
    { icon: <Snowflake />, label: "Invierno (Nieve)" },
    { icon: <Infinity />, label: "Todo el año" },
  ],
  budget: [
    { icon: <HandHelping />, label: "Gratis" },
    { icon: <PiggyBank />, label: "Económico (¥0-3,000)" },
    { icon: <CircleDollarSign />, label: "Moderado (¥3,000-10,000)" },
    { icon: <Crown />, label: "Premium (¥10,000-30,000)" },
    { icon: <Coins />, label: "Lujo (¥30,000+)" },
  ],
  location: [
    { icon: <TrainFront />, label: "Cerca de estaciones JR" },
    { icon: <TrainFront />, label: "Cerca de metro" },
    { icon: <Plane />, label: "Cerca de aeropuertos" },
    { icon: <Building2 />, label: "Centro de la ciudad" },
    { icon: <Store />, label: "Distritos comerciales" },
    { icon: <Mountain />, label: "Áreas rurales/montañosas" },
    { icon: <Waves />, label: "Zona costera" },
    { icon: <Trees />, label: "Parques y naturaleza" },
  ],
};

// ✅ UPDATED: Mapping for potential database value mismatches (backward compatibility)
const tagValueMapping = {
  season: {
    // Old values mapping to new schema values
    Primavera: "Primavera (Sakura)",
    Verano: "Verano (Festivales)",
    Otoño: "Otoño (Koyo)",
    Invierno: "Invierno (Nieve)",
    // English versions
    spring: "Primavera (Sakura)",
    summer: "Verano (Festivales)",
    autumn: "Otoño (Koyo)",
    fall: "Otoño (Koyo)",
    winter: "Invierno (Nieve)",
    all_year: "Todo el año",
    year_round: "Todo el año",
    // Exact matches (case insensitive)
    "primavera (sakura)": "Primavera (Sakura)",
    "verano (festivales)": "Verano (Festivales)",
    "otoño (koyo)": "Otoño (Koyo)",
    "invierno (nieve)": "Invierno (Nieve)",
    "todo el año": "Todo el año",
  },
  budget: {
    // Old values mapping to new schema values
    Económico: "Económico (¥0-3,000)",
    Moderado: "Moderado (¥3,000-10,000)",
    Lujo: "Lujo (¥30,000+)",
    // English versions
    free: "Gratis",
    budget: "Económico (¥0-3,000)",
    economic: "Económico (¥0-3,000)",
    economico: "Económico (¥0-3,000)",
    moderate: "Moderado (¥3,000-10,000)",
    moderado: "Moderado (¥3,000-10,000)",
    premium: "Premium (¥10,000-30,000)",
    luxury: "Lujo (¥30,000+)",
    lujo: "Lujo (¥30,000+)",
    expensive: "Lujo (¥30,000+)",
    // Exact matches (case insensitive)
    gratis: "Gratis",
    "económico (¥0-3,000)": "Económico (¥0-3,000)",
    "moderado (¥3,000-10,000)": "Moderado (¥3,000-10,000)",
    "premium (¥10,000-30,000)": "Premium (¥10,000-30,000)",
    "lujo (¥30,000+)": "Lujo (¥30,000+)",
  },
  location: {
    // Old values mapping to new schema values
    "Cerca de estaciones de tren o metro": "Cerca de estaciones JR",
    "Cerca de áreas de puntos de interés": "Centro de la ciudad",
    // English versions
    train_station: "Cerca de estaciones JR",
    metro_station: "Cerca de metro",
    airport: "Cerca de aeropuertos",
    city_center: "Centro de la ciudad",
    commercial: "Distritos comerciales",
    rural: "Áreas rurales/montañosas",
    coastal: "Zona costera",
    nature: "Parques y naturaleza",
    poi: "Centro de la ciudad",
    points_of_interest: "Centro de la ciudad",
    // Exact matches (case insensitive)
    "cerca de estaciones jr": "Cerca de estaciones JR",
    "cerca de metro": "Cerca de metro",
    "cerca de aeropuertos": "Cerca de aeropuertos",
    "centro de la ciudad": "Centro de la ciudad",
    "distritos comerciales": "Distritos comerciales",
    "áreas rurales/montañosas": "Áreas rurales/montañosas",
    "zona costera": "Zona costera",
    "parques y naturaleza": "Parques y naturaleza",
  },
};

// Display names for Spanish UI
const tagDisplayNames = {
  season: "Estación",
  budget: "Presupuesto",
  location: "Ubicación",
};

// ✅ Helper function to convert component format back to database format
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

  useEffect(() => {
    // If we have initial data but selectedGeneralTags is empty, populate it
    if (
      initialData &&
      (!selectedGeneralTags || Object.keys(selectedGeneralTags).length === 0)
    ) {
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
        </Box>
      ))}
    </Box>
  );
};

export default GeneralTags;
