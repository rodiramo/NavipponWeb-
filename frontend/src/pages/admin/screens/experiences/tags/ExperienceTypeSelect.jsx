import React from "react";
import { Autocomplete, TextField, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];

const ExperienceTypeSelect = ({
  categories,
  setCategories,
  isExperienceDataLoaded,
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginBottom: "8px",
        }}
      >
        Tipo de Experiencia*
      </Typography>

      {isExperienceDataLoaded && (
        <Autocomplete
          options={categoriesEnum}
          value={categories || null}
          onChange={(event, newValue) => setCategories(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Seleccione una opción" />
          )}
          sx={{
            "& .MuiFilledInput-root": {
              border: `1px solid ${theme.palette.secondary.light}`,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.11)",
              backgroundColor: "white",

              borderRadius: "12px",
            },
            "& .MuiAutocomplete-popupIndicator": {
              color: theme.palette.primary.main,
            },
            "& .MuiAutocomplete-listbox": {
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            },
            "& .MuiAutocomplete-option": {
              borderRadius: "10px",
              padding: "10px",
            },
            "& .MuiAutocomplete-option:hover": {
              backgroundColor: "#E9D5FF", // Light purple hover effect
            },
            "& .MuiAutocomplete-option[aria-selected='true']": {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.main,
            },
          }}
        />
      )}
    </Box>
  );
};

export default ExperienceTypeSelect;
