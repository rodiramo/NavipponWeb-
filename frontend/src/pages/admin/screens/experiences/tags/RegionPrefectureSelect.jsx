import React from "react";
import { Autocomplete, TextField, Typography, Box, Stack } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: [
    "Tokyo",
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
    "Yamanashi",
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
    "Okinawa",
  ],
};

const RegionPrefectureSelect = ({
  region,
  setRegion,
  prefecture,
  setPrefecture,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isXS = useMediaQuery("(max-width:480px)");

  // Region options from our predefined regions object
  const regionOptions = Object.keys(regions);
  // Ensure prefectureOptions is always an array—even if the region doesn't match a key.
  const prefectureOptions = region && regions[region] ? regions[region] : [];

  return (
    <Box>
      <Typography
        variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
        fontWeight="medium"
        gutterBottom
        sx={{
          fontSize: isXS ? "1rem" : undefined,
          mb: isXS ? 1.5 : 2,
        }}
      >
        Región y prefectura
      </Typography>

      <Stack spacing={isXS ? 2 : 3}>
        {/* Región Selector */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "medium",
              mb: 1,
              fontSize: isXS ? "0.9rem" : "1rem",
            }}
          >
            Región*
          </Typography>
          <Autocomplete
            options={regionOptions}
            value={region}
            onChange={(event, newValue) => {
              setRegion(newValue);
              setPrefecture(""); // Reset prefecture when region changes
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Selecciona una región"
                size={isXS ? "small" : "medium"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: isXS ? "8px" : "12px",
                    fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                  },
                }}
              />
            )}
            size={isXS ? "small" : "medium"}
            sx={{
              "& .MuiAutocomplete-popupIndicator": {
                color: theme.palette.primary.main,
              },
              "& .MuiAutocomplete-paper": {
                borderRadius: isXS ? "8px" : "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                mt: 1,
              },
              "& .MuiAutocomplete-listbox": {
                borderRadius: isXS ? "8px" : "12px",
                "& .MuiAutocomplete-option": {
                  borderRadius: isXS ? "4px" : "6px",
                  margin: "2px 4px",
                  fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light + "20",
                  },
                  "&.Mui-focused": {
                    backgroundColor: theme.palette.primary.light + "30",
                  },
                },
              },
            }}
          />
        </Box>

        {/* Prefectura Selector */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "medium",
              mb: 1,
              fontSize: isXS ? "0.9rem" : "1rem",
              color: !region
                ? theme.palette.text.disabled
                : theme.palette.text.primary,
            }}
          >
            Prefectura
          </Typography>
          <Autocomplete
            options={prefectureOptions}
            value={prefecture}
            onChange={(event, newValue) => setPrefecture(newValue)}
            disabled={!region}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  !region
                    ? "Primero selecciona una región"
                    : "Selecciona una prefectura"
                }
                size={isXS ? "small" : "medium"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: isXS ? "8px" : "12px",
                    fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                    backgroundColor: !region
                      ? theme.palette.action.disabledBackground
                      : "transparent",
                  },
                }}
              />
            )}
            size={isXS ? "small" : "medium"}
            sx={{
              "& .MuiAutocomplete-popupIndicator": {
                color: !region
                  ? theme.palette.text.disabled
                  : theme.palette.primary.main,
              },
              "& .MuiAutocomplete-paper": {
                borderRadius: isXS ? "8px" : "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                mt: 1,
              },
              "& .MuiAutocomplete-listbox": {
                borderRadius: isXS ? "8px" : "12px",
                "& .MuiAutocomplete-option": {
                  borderRadius: isXS ? "4px" : "6px",
                  margin: "2px 4px",
                  fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light + "20",
                  },
                  "&.Mui-focused": {
                    backgroundColor: theme.palette.primary.light + "30",
                  },
                },
              },
            }}
          />

          {/* Helper text */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: isXS ? "0.7rem" : isMobile ? "0.75rem" : "0.875rem",
              display: !region ? "block" : "none",
            }}
          >
            Selecciona primero una región para ver las prefecturas disponibles
          </Typography>

          {region && prefectureOptions.length > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: isXS ? "0.7rem" : isMobile ? "0.75rem" : "0.875rem",
              }}
            >
              {prefectureOptions.length} prefectura
              {prefectureOptions.length !== 1 ? "s" : ""} disponible
              {prefectureOptions.length !== 1 ? "s" : ""} en {region}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default RegionPrefectureSelect;
