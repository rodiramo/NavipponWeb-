import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useTheme, Typography, Alert } from "@mui/material";
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
  initialRating = 0,
  loading = false,
}) => {
  const theme = useTheme();
  const [desc, setDesc] = useState(initialText);
  const [title, setTitle] = useState(initialTitle);
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(-1);
  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    rating: "",
  });
  const [showRatingError, setShowRatingError] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    // Validation logic
    let formErrors = { title: "", desc: "", rating: "" };
    let isValid = true;

    if (!title || title.trim() === "") {
      formErrors.title = "El título es obligatorio";
      isValid = false;
    }

    if (!desc || desc.trim() === "") {
      formErrors.desc = "La descripción es obligatoria";
      isValid = false;
    }

    // More robust rating validation
    if (!rating || rating === 0 || rating === null || rating === undefined) {
      formErrors.rating =
        "Debes seleccionar una valoración antes de enviar tu reseña";
      setShowRatingError(true);
      isValid = false;
    }

    // If the form is invalid, set the errors and prevent submit
    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    console.log({ title, rating, desc });
    formSubmitHandler(rating, title, desc);

    // Reset form
    setDesc("");
    setTitle("");
    setRating(0);
    setErrors({ title: "", desc: "", rating: "" });
    setShowRatingError(false);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    setShowRatingError(false);
    setErrors({ ...errors, rating: "" }); // Clear rating error when user selects a rating
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Header */}
          <div className="text-center pb-2">
            <Typography variant="h5" className="font-semibold mb-2">
              Escribe tu reseña
            </Typography>
            <Typography variant="body2">
              Comparte tu experiencia con otros usuarios
            </Typography>
          </div>

          {/* Rating Component */}
          <div className="flex flex-col items-center space-y-4 p-6 rounded-xl">
            <Typography variant="body1" className="font-medium">
              Agrega una valoración: <span className="text-red-500">*</span>
            </Typography>

            <div className="flex flex-col items-center space-y-3">
              <Rating
                name="hover-feedback"
                value={rating}
                precision={0.5}
                getLabelText={getLabelText}
                onChange={handleRatingChange}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                icon={
                  <StarIcon
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: "2rem",
                      filter: showRatingError
                        ? "drop-shadow(0 0 3px rgba(239, 68, 68, 0.5))"
                        : "none",
                    }}
                  />
                }
                emptyIcon={
                  <StarIcon
                    sx={{
                      color: showRatingError ? "#fca5a5" : "#e5e7eb",
                      fontSize: "2rem",
                      filter: showRatingError
                        ? "drop-shadow(0 0 3px rgba(239, 68, 68, 0.3))"
                        : "none",
                    }}
                  />
                }
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiRating-iconHover": {
                    color: theme.palette.primary.light,
                  },
                  border: showRatingError
                    ? "2px solid #ef4444"
                    : "2px solid transparent",
                  borderRadius: "8px",
                  padding: "8px",
                  transition: "all 0.2s ease-in-out",
                }}
              />

              {rating > 0 && (
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "medium",
                    fontSize: "0.9rem",
                  }}
                >
                  {labels[hover !== -1 ? hover : rating]}
                </Box>
              )}

              {!rating && !showRatingError && (
                <Typography
                  variant="body2"
                  sx={{ color: "gray", fontSize: "0.9rem" }}
                >
                  Haz clic en las estrellas para valorar
                </Typography>
              )}
            </div>

            {/* Rating Error Message */}
            {(errors.rating || showRatingError) && (
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  fontSize: "0.875rem",
                  "& .MuiAlert-message": {
                    textAlign: "center",
                    width: "100%",
                  },
                }}
              >
                {errors.rating || "¡Valoración requerida!"}
              </Alert>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: errors.title ? "#ef4444" : "#d1d5db",
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.title ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Escribe un título para tu reseña..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: "" }); // Clear title error
              }}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Reseña <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.desc ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: errors.desc ? "#ef4444" : "#d1d5db",
              }}
              placeholder="Describe tu opinión..."
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                setErrors({ ...errors, desc: "" }); // Clear desc error
              }}
            />
            {errors.desc && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.desc}
              </p>
            )}
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            {formCancelHandler && (
              <button
                type="button"
                className="flex-1 sm:flex-none px-6 py-3 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200"
                onClick={() => formCancelHandler()}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: theme.palette.primary.white,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              {loading ? "Enviando..." : btnLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
