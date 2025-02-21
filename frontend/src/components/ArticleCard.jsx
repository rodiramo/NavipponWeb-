import React, { useState, useEffect } from "react";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { images, stables } from "../constants";
import { Link } from "react-router-dom";
import { toggleFriend, getUserProfile } from "../services/index/users";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from "../services/index/favorites";
import { toast } from "react-hot-toast";
import { useTheme, IconButton, Typography, Chip } from "@mui/material";

const ArticleCard = ({ post, className, currentUser, token }) => {
  const theme = useTheme();
  const [isFriend, setIsFriend] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (currentUser && token && post?.user?._id) {
      getUserProfile({ token })
        .then((userData) => {
          setIsFriend(userData.friends.includes(post.user?._id));
          localStorage.setItem("friends", JSON.stringify(userData.friends));
        })
        .catch((error) => console.error("Error fetching friends:", error));

      getUserFavorites({ userId: currentUser._id, token })
        .then((favorites) => {
          setIsFavorite(favorites.some((fav) => fav.postId === post?._id));
          localStorage.setItem("favorites", JSON.stringify(favorites));
        })
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, [currentUser, token, post?._id, post?.user?._id]);

  const handleFriendToggle = async () => {
    try {
      await toggleFriend({ userId: post.user._id, token });

      setIsFriend((prev) => {
        const newFriendStatus = !prev;
        let storedFriends = JSON.parse(localStorage.getItem("friends")) || [];

        if (!Array.isArray(storedFriends)) storedFriends = [];

        if (newFriendStatus) {
          storedFriends.push(post.user._id);
        } else {
          storedFriends = storedFriends.filter((id) => id !== post.user._id);
        }

        localStorage.setItem("friends", JSON.stringify(storedFriends));

        toast.success(
          newFriendStatus ? "Agregado a amigos" : "Eliminado de amigos"
        );

        return newFriendStatus;
      });
    } catch (error) {
      toast.error("Error al actualizar amigos");
      console.error(error);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await removeFavorite({
          userId: currentUser._id,
          postId: post._id,
          token,
        });
        toast.success("Eliminado de favoritos");
      } else {
        await addFavorite({ userId: currentUser._id, postId: post._id, token });
        toast.success("Agregado a favoritos");
      }
      setIsFavorite((prev) => !prev);
    } catch (error) {
      toast.error("Error al actualizar favoritos");
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
        onClick={handleFavoriteToggle}
        className="top-2 right-2 p-2 rounded-full focus:outline-none"
        sx={{
          position: "absolute !important",
          top: "10px",
          right: "10px",
          zIndex: 9,
          backgroundColor: isFavorite
            ? theme.palette.secondary.main
            : theme.palette.primary.main,
          color: "white",
          "&:hover": {
            backgroundColor: isFavorite
              ? theme.palette.secondary.dark
              : theme.palette.primary.dark,
          },
        }}
      >
        {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
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
            className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60 transition-transform duration-300 group-hover:scale-105"
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

          {/* ✅ Add Friend Button - Rounded Icon */}
          <IconButton
            onClick={handleFriendToggle}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.main,
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            {isFriend ? <PersonRemoveOutlined /> : <PersonAddOutlined />}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
