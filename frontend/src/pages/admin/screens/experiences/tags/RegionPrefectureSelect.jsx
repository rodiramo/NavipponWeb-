import React from "react";
import { Autocomplete, TextField, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: [
    "Tokio",
    "Kanagawa",
    "Chiba",
    "Saitama",
    "Ibaraki",
    "Tochigi",
    "Gunma",
  ],
  Chubu: [
    "Aichi",
    "Shizuoka",
    "Gifu",
    "Nagano",
    "Niigata",
    "Toyama",
    "Ishikawa",
    "Fukui",
  ],
  Kansai: ["Osaka", "Kyoto", "Hyogo", "Nara", "Wakayama", "Shiga", "Mie"],
  Chugoku: ["Hiroshima", "Okayama", "Shimane", "Tottori", "Yamaguchi"],
  Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
  Kyushu: [
    "Fukuoka",
    "Nagasaki",
    "Kumamoto",
    "Oita",
    "Miyazaki",
    "Kagoshima",
    "Saga",
  ],
};

const RegionPrefectureSelect = ({
  region,
  setRegion,
  prefecture,
  setPrefecture,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `2px solid ${theme.palette.secondary.light}`,
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: theme.palette.secondary.light,
        width: "100%",
        marginTop: "1rem",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginBottom: "8px",
        }}
      >
        Región y Prefectura
      </Typography>
      {/* Región Selector */}{" "}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginBottom: "8px",
        }}
      >
        Región
      </Typography>
      <Autocomplete
        options={Object.keys(regions)}
        value={region || null}
        onChange={(event, newValue) => {
          setRegion(newValue);
          setPrefecture(""); // Reset prefecture when changing region
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Selecciona una región"
            sx={{
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          />
        )}
        sx={{
          "& .MuiFilledInput-root": {
            backgroundColor: "white",
            borderRadius: "12px",
          },
          "& .MuiAutocomplete-popupIndicator": {
            backgroundColor: "white",
            color: theme.palette.primary.main,
          },
          "& .MuiAutocomplete-listbox": {
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          },
          "& .MuiAutocomplete-option": { borderRadius: "8px", padding: "10px" },
          "& .MuiAutocomplete-option:hover": { backgroundColor: "#E9D5FF" },
        }}
      />
      {/* Prefectura Selector */}{" "}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginTop: "15px",
        }}
      >
        Prefectura
      </Typography>
      <Autocomplete
        options={region ? regions[region] : []}
        value={prefecture || null}
        onChange={(event, newValue) => setPrefecture(newValue)}
        disabled={!region}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Selecciona una prefectura"
            sx={{
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          />
        )}
        sx={{
          marginTop: "12px",
          "& .MuiFilledInput-root": {
            backgroundColor: "#F5F5F5",
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
          "& .MuiAutocomplete-option": { borderRadius: "8px", padding: "10px" },
          "& .MuiAutocomplete-option:hover": { backgroundColor: "#E9D5FF" },
        }}
      />
    </Box>
  );
};

export default RegionPrefectureSelect;
