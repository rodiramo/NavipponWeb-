import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, InputBase, IconButton } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { useTheme } from "@mui/material/styles";

const Search = ({ className, onSearchKeyword }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      onSearchKeyword({ searchKeyword });
      navigate(`/experience?search=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full md:w-3/4 ${className}`}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: "50px", // Fully rounded edges
        border: `1.2px solid ${theme.palette.secondary.light}`,
        padding: "0.6rem",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* Search Icon */}
      <FiSearch
        className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6"
        style={{ color: theme.palette.primary.main, zIndex: 1000 }}
      />

      <InputBase
        placeholder="Buscar..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        sx={{
          flex: 1,
          padding: "12px 15px",
          paddingLeft: "3rem",
          borderRadius: "50px",
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.text.primary,
          "&::placeholder": {
            color: theme.palette.secondary.dark,
            fontWeight: "bold",
          },
        }}
      />

      {/* Search Button */}
      <IconButton
        type="submit"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          fontSize: "1rem",
          padding: "0.8rem 1.5rem",
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Buscar
      </IconButton>
    </Box>
  );
};

export default Search;
