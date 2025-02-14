import PropTypes from "prop-types";
import { FiStar } from "react-icons/fi";

const StarRating = ({ rating, setRating, isEditable = false }) => {
  const handleRatingClick = (index) => {
    if (isEditable && setRating) {
      setRating(index + 1);
    }
  };

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <FiStar
          key={index}
          onClick={() => handleRatingClick(index)}
          className={`cursor-pointer ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          size={20}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func,
  isEditable: PropTypes.bool,
};

export default StarRating;
