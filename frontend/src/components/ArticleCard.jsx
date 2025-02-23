import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../store/reducers/authSlice.js";
import { AiOutlineClose, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { images, stables } from "../constants";
import { Link } from "react-router-dom";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from "../services/index/favorites";
import { toggleFriend } from "../services/index/users";
import { toast } from "react-hot-toast";
import { useTheme, IconButton, Typography, Chip } from "@mui/material";

const ArticleCard = ({ post, className, currentUser, token }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.auth.user?.friends ?? []);

  // 🔹 Check if the current user is a friend
  const isFriend = friends?.includes(post.user._id) ?? false;
  // 🔹 Check if the post belongs to the current user
  const isOwnProfile = currentUser?._id === post.user._id;

  const handleFriendToggle = async (userId) => {
    try {
      const updatedUser = await toggleFriend({ userId, token });

      // ✅ Update Redux store with the actual backend response
      dispatch(setFriends(updatedUser.friends));

      toast.success(
        updatedUser.friends.includes(userId)
          ? "Agregado a amigos"
          : "Eliminado de amigos"
      );
    } catch (error) {
      toast.error("Error al actualizar amigos");
      console.error(error);
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] group ${className}`}
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      {/* ✅ Verification Chip - Top Left */}
      <Chip
        label={post.approved ? "Artículo Verificado" : "Sin Verificar"}
        sx={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 9,
          backgroundColor: post.approved
            ? theme.palette.success.light
            : theme.palette.error.light,
          color: post.approved
            ? theme.palette.success.dark
            : theme.palette.error.dark,
          fontSize: "0.75rem",
        }}
      />

      {/* ✅ Favorite Button - Top Right */}
      <IconButton
        className="top-2 right-2 p-2 rounded-full focus:outline-none"
        sx={{
          position: "absolute !important",
          top: "10px",
          right: "10px",
          zIndex: 9,
          backgroundColor: theme.palette.primary.main,
          color: "white",
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        }}
      >
        {<AiOutlineHeart />}
      </IconButton>

      <Link to={`/blog/${post.slug}`} className="relative block">
        <div className="relative">
          <img
            src={
              post.photo
                ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
                : images.samplePostImage
            }
            alt="title"
            className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
          />

          {/* ✅ Hover Effect - "Leer más" */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Leer más
            </Typography>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/blog/${post.slug}`}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.85rem",
              marginTop: "0.25rem",
            }}
          >
            {new Date(post.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Typography>

          <h2
            className="font-roboto font-bold text-xl md:text-2xl lg:text-[28px]"
            style={{ color: theme.palette.primary.main }}
          >
            {post.title}
          </h2>
          <p
            className="mt-3 text-sm md:text-lg"
            style={{ color: theme.palette.text.secondary }}
          >
            {post.caption}
          </p>
        </Link>

        {/* ✅ Author & Actions */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-x-2 md:gap-x-2.5">
            <img
              src={
                post.user.avatar
                  ? stables.UPLOAD_FOLDER_BASE_URL + post.user.avatar
                  : images.userImage
              }
              alt="post profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full"
            />
            <div className="flex flex-col">
              <h4
                className="font-bold italic text-sm md:text-base"
                style={{ color: theme.palette.primary.dark }}
              >
                {post.user.name}
              </h4>
            </div>
          </div>

          {/* ✅ Add Friend Button - Hide if it's the current user's own profile */}
          {!isOwnProfile && (
            <IconButton
              onClick={() => handleFriendToggle(post.user._id)}
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                borderRadius: "50%",
              }}
            >
              {isFriend ? <PersonRemoveOutlined /> : <PersonAddOutlined />}
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
