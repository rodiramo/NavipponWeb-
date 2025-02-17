import PropTypes from "prop-types";
import { FiStar } from "react-icons/fi"; // Outlined Star
import { FaStar } from "react-icons/fa"; // Filled Star
import { useTheme } from "@mui/material/styles";

const StarRating = ({ rating, setRating, isEditable = false }) => {
  const theme = useTheme(); // ✅ Use Theme Colors

  const handleRatingClick = (index) => {
    if (isEditable && setRating) {
      setRating(index + 1);
    }
  };

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const isFilled = index + 1 <= rating; // ✅ Determines if star should be filled

        return isFilled ? (
          <FaStar
            key={index}
            onClick={() => handleRatingClick(index)}
            className={`cursor-pointer transition-colors duration-300 ${
              isEditable ? "hover:text-yellow-500" : ""
            }`}
            size={24}
            aria-label={`Rating ${index + 1}`}
            style={{
              cursor: isEditable ? "pointer" : "default",
              color: theme.palette.secondary.medium, // Filled Star Color
            }}
          />
        ) : (
          <FiStar
            key={index}
            onClick={() => handleRatingClick(index)}
            className={`cursor-pointer transition-colors duration-300 ${
              isEditable ? "hover:text-yellow-500" : ""
            }`}
            size={24}
            aria-label={`Rating ${index + 1}`}
            style={{
              cursor: isEditable ? "pointer" : "default",
              color: theme.palette.grey[400], // Outlined Star Color
            }}
          />
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired, // ⭐ Required number
  setRating: PropTypes.func, // ⭐ Function to update rating (only if editable)
  isEditable: PropTypes.bool, // ⭐ If true, allows clicking to change rating
};

export default StarRating;
