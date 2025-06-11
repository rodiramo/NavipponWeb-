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
    e.stopPropagation();
    console.log("=== SEARCH FORM SUBMITTED ===");
    console.log("Form submitted with keyword:", searchKeyword);
    console.log("onSearchKeyword prop exists:", !!onSearchKeyword);

    if (searchKeyword.trim()) {
      // Check if parent provided a search handler
      if (onSearchKeyword && typeof onSearchKeyword === "function") {
        console.log("Calling parent onSearchKeyword function");
        try {
          onSearchKeyword({ searchKeyword });
          console.log("Parent function called successfully");
        } catch (error) {
          console.error("Error calling parent function:", error);
        }
      } else {
        console.log("No parent handler, navigating directly");
        const url = `/experience?page=1&search=${encodeURIComponent(
          searchKeyword
        )}`;
        console.log("Direct navigation to:", url);
        navigate(url);
      }
    } else {
      console.log("No search keyword provided");
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Search button clicked directly");
    handleSubmit(e);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full md:w-3/4 ${className}`}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: "50px",
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
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            console.log("Enter key pressed in input");
            handleSubmit(e);
          }
        }}
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
        onClick={handleButtonClick}
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
