import React, { useState } from "react";
import { Link } from "react-router-dom";
import { images, stables } from "../../../constants";
import { Favorite } from "@mui/icons-material";
import { Button, useTheme } from "@mui/material";
const SuggestedPosts = ({ className, header, posts = [], tags }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const theme = useTheme();
  return (
    <div>
      {/* Favorite Button */}
      <Button
        variant="contained"
        color={isFavorited ? "secondary" : "primary"}
        startIcon={<Favorite />}
        onClick={() => setIsFavorited(!isFavorited)}
        fullWidth
        sx={{ borderRadius: "30rem", marginBottom: "1rem" }}
      >
        {isFavorited ? "Guardado" : "Agregar a Favoritos"}
      </Button>
      <div
        className={`w-full rounded-lg p-4 ${className}`}
        style={{ background: theme.palette.background.bg }}
      >
        {" "}
        <h2 className="font-roboto font-medium text-dark-hard md:text-xl">
          {header}
        </h2>
        <div className="grid gap-y-5 mt-5 md:grid-cols-2 md:gap-x-5 lg:grid-cols-1">
          {posts.map((item) => (
            <div
              key={item._id}
              className="flex space-x-3 flex-nowrap items-center"
            >
              <img
                className="aspect-square object-cover rounded-lg w-1/5"
                src={
                  item?.photo
                    ? stables.UPLOAD_FOLDER_BASE_URL + item?.photo
                    : images.samplePostImage
                }
                alt={item.title}
              />
              <div className="text-sm font-roboto text-dark-hard font-medium">
                <h3 className="text-sm font-roboto text-dark-hard font-medium md:text-base lg:text-lg">
                  <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                </h3>
                <span className="text-xs opacity-60">
                  {new Date(item.createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedPosts;
