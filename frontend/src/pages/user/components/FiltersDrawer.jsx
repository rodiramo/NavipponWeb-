import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  useTheme,
  IconButton,
  Menu,
} from "@mui/material";
import { XCircle, Filter } from "lucide-react";

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];
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

const FiltersDrawer = ({
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  selectedPrefecture,
  setSelectedPrefecture,
  handleClearFilters,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      alignContent="flex-end"
      justifyContent="flex-end"
      width="100%"
    >
      <IconButton
        onClick={handleClick}
        sx={{
          border: `1.5px solid ${theme.palette.secondary.medium}`,
          marginRight: "1rem",
        }}
      >
        <Filter color={theme.palette.secondary.medium} size={20} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 300, p: 2 } }}
      >
        <Typography variant="subtitle2" color="textSecondary">
          Category:
        </Typography>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        >
          <MenuItem value="All">All</MenuItem>
          {categoriesEnum.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="subtitle2" color="textSecondary">
          Region:
        </Typography>
        <Select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        >
          <MenuItem value="All">All</MenuItem>
          {Object.keys(regions).map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="subtitle2" color="textSecondary">
          Prefecture:
        </Typography>
        <Select
          value={selectedPrefecture}
          onChange={(e) => setSelectedPrefecture(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          disabled={selectedRegion === "All"}
        >
          <MenuItem value="All">All</MenuItem>
          {selectedRegion !== "All" &&
            regions[selectedRegion].map((prefecture) => (
              <MenuItem key={prefecture} value={prefecture}>
                {prefecture}
              </MenuItem>
            ))}
        </Select>
        <IconButton
          onClick={() => {
            handleClearFilters();
            handleClose();
          }}
          sx={{ alignSelf: "flex-end", mb: 2, color: "gray" }}
        >
          <XCircle size={20} />
        </IconButton>
      </Menu>
    </Box>
  );
};

export default FiltersDrawer;
