import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";

const labels = {
  0.5: "No es bueno", // Useless
  1: "No es bueno+", // Useless+
  1.5: "Pobre", // Poor
  2: "Pobre+", // Poor+
  2.5: "Regular", // Ok
  3: "Regular+", // Ok+
  3.5: "Bueno", // Good
  4: "Bueno+", // Good+
  4.5: "Excelente", // Excellent
  5: "Excelente+", // Excellent+
};

function getLabelText(value) {
  return `${value} Estrella${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const ReviewForm = ({
  btnLabel,
  formSubmitHandler,
  formCancelHandler = null,
  initialText = "",
  initialTitle = "",
  initialRating = "",
  loading = false,
}) => {
  const theme = useTheme();
  const [desc, setDesc] = useState(initialText);
  const [title, setTitle] = useState(initialTitle);
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(-1);
  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    rating: "",
  });

  const submitHandler = (e) => {
    e.preventDefault();

    // Validation logic
    let formErrors = { title: "", desc: "", rating: "" };
    let isValid = true;

    if (!title) {
      formErrors.title = "El título es obligatorio";
      isValid = false;
    }

    if (!desc) {
      formErrors.desc = "La descripción es obligatoria";
      isValid = false;
    }

    if (rating === 0) {
      formErrors.rating = "La valoración es obligatoria";
      isValid = false;
    }

    // If the form is invalid, set the errors and prevent submit
    if (!isValid) {
      setErrors(formErrors);
      return;
    }
    console.log({ title, rating, desc });
    formSubmitHandler(rating, title, desc);

    setDesc("");
    setTitle("");
    setRating(0);
    setErrors({ title: "", desc: "", rating: "" }); // Clear errors after successful submit
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-col items-end border border-primary rounded-lg p-4">
        {/* Rating Component */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "15px",
          }}
        >
          <p>Agrega una valuación: </p>
          <Rating
            name="hover-feedback"
            value={rating}
            precision={0.5} // Allows half-star rating
            getLabelText={getLabelText}
            onChange={(event, newValue) => {
              setRating(newValue); // Set rating on change
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover); // Set hover value for label display
            }}
            icon={<StarIcon sx={{ color: theme.palette.secondary.main }} />} // Filled star color
            emptyIcon={<StarIcon sx={{ color: "gray" }} />}
          />
          {rating !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
          {errors.rating && (
            <p style={{ color: "red", marginTop: "5px" }}>{errors.rating}</p>
          )}
        </Box>

        {/* Title Input */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "15px",
          }}
        >
          <p>Título: </p>
          <input
            type="text"
            style={{
              backgroundColor: theme.palette.primary.white,
              padding: "1rem",
              borderRadius: "30rem",
            }}
            className="w-full focus:outline-none bg-transparent mb-2"
            placeholder="Enter a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p style={{ color: "red", marginTop: "5px" }}>{errors.title}</p>
          )}
        </div>

        {/* Description Textarea */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "15px",
          }}
        >
          <p>Reseña: </p>
          <textarea
            type="text"
            style={{
              backgroundColor: theme.palette.primary.white,
              padding: "1rem",
              borderRadius: "30rem",
            }}
            className="w-full focus:outline-none bg-transparent mb-2"
            placeholder="Enter a description..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          {errors.desc && (
            <p style={{ color: "red", marginTop: "5px" }}>{errors.desc}</p>
          )}
        </div>

        {/* Form Buttons */}
        <div className="flex flex-col-reverse gap-y-2 items-center gap-x-2 pt-2 min-[420px]:flex-row">
          {formCancelHandler && (
            <button
              style={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.primary.black,
                padding: "0.5rem 1rem",
                borderRadius: "30rem",
              }}
              onClick={() => formCancelHandler()} // Close form when clicked
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.white,
              padding: "0.5rem 1rem",
              borderRadius: "30rem",
            }}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
