import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../store/reducers/authSlice.js";
import { AiFillHeart } from "react-icons/ai";
import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { images, stables } from "../constants";
import { Link, useNavigate } from "react-router-dom";

import { toggleFriend } from "../services/index/users";
import { toast } from "react-hot-toast";
import { useTheme, Chip } from "@mui/material";
import { Clock, Eye, Calendar, Edit } from "lucide-react";

const ArticleCard = ({ post, className, currentUser, token, onEdit }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.auth.user?.friends ?? []);

  // Check if the current user is a friend
  const isFriend = friends?.includes(post.user._id) ?? false;
  // Check if the post belongs to the current user
  const isOwnProfile = currentUser?._id === post.user._id;

  const handleFriendToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const updatedUser = await toggleFriend({ userId: post.user._id, token });

      // Update Redux store with the actual backend response
      dispatch(setFriends(updatedUser.friends));

      toast.success(
        updatedUser.friends.includes(post.user._id)
          ? "Agregado a amigos"
          : "Eliminado de amigos"
      );
    } catch (error) {
      toast.error("Error al actualizar amigos");
      console.error(error);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If onEdit prop is provided, use it (for modal/drawer editing)
    if (onEdit) {
      onEdit(post);
    } else {
      // Otherwise navigate to edit page
      navigate(`/blog/edit/${post.slug}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getReadingTime = (caption) => {
    const wordsPerMinute = 200;
    const words = caption?.split(" ").length || 0;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return readingTime < 1 ? 1 : readingTime;
  };

  return (
    <div
      className={`group relative overflow-hidden transition-all duration-500 ${className}`}
      style={{
        borderRadius: "16px",
        minHeight: "600px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Image Section */}
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: "16px 16px 0 0" }}
      >
        <Link to={`/blog/${post.slug}`}>
          <img
            src={
              post.photo
                ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
                : images.samplePostImage
            }
            alt={post.title}
            className="w-full h-64 sm:h-72 lg:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Hover Read More Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div
              className="px-6 py-3 rounded-full backdrop-blur-xl border border-white/30 text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <span className="flex items-center gap-2">
                <Eye size={16} />
                {isOwnProfile ? "Ver mi artículo" : "Leer artículo"}
              </span>
            </div>
          </div>
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {/* Verification Badge */}
          <Chip
            label={post.approved ? "Artículo Verificado" : "Sin Verificar"}
            sx={{
              backgroundColor: post.approved
                ? theme.palette.success.light
                : theme.palette.error.light,
              color: post.approved
                ? theme.palette.success.dark
                : theme.palette.error.dark,
              fontSize: "0.75rem",
            }}
          />

          {/* Reading Time Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all duration-300"
            style={{
              backgroundColor: `${theme.palette.secondary.main}20`,
              borderColor: `${theme.palette.secondary.main}30`,
              color: "white",
              width: "fit-content",
            }}
          >
            <Clock size={12} />
            <span>{getReadingTime(post.caption)} min</span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Edit Button - Only show for own posts */}
          {currentUser && isOwnProfile && (
            <button
              onClick={handleEdit}
              className="group/edit w-12 h-12 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              style={{
                backgroundColor: `${theme.palette.info.main}20`,
                borderColor: `${theme.palette.info.main}30`,
              }}
              title="Editar artículo"
            >
              <EditOutlined
                style={{
                  color: theme.palette.info.main,
                  fontSize: "1.25rem",
                }}
                className="transition-transform duration-300 group-hover/edit:scale-125"
              />
            </button>
          )}

          {/* Favorite Button */}
          <button
            className="group/heart w-12 h-12 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{
              backgroundColor: theme.palette.primary.white,
            }}
          >
            <AiFillHeart
              style={{ color: theme.palette.primary.main, fontSize: "1.5rem" }}
              className="text-xl transition-transform duration-300 group-hover/heart:scale-125"
            />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <Link to={`/blog/${post.slug}`} className="block space-y-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm ">
            <Calendar size={14} />
            <span>{formatDate(post.createdAt)}</span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold leading-tight transition-colors duration-300">
            <span className="bg-gradient-to-r bg-clip-text ">{post.title}</span>
          </h2>

          {/* Caption */}
          <p
            className="leading-relaxed line-clamp-3"
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.caption}
          </p>
        </Link>
        {/* Author Section */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/20">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="relative">
              <img
                src={
                  post.user.avatar
                    ? stables.UPLOAD_FOLDER_BASE_URL + post.user.avatar
                    : images.userImage
                }
                alt={post.user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
              />
              {/* Online indicator - optional */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Author Info */}
            <div>
              <h4 className="font-semibold">
                {post.user.name}
                {isOwnProfile && (
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    Tú
                  </span>
                )}
              </h4>
              <p className="text-sm">
                {isOwnProfile ? "Tu artículo" : "Autor"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Friend Toggle Button - Only show if user is logged in and it's not their own profile */}
            {currentUser && !isOwnProfile && (
              <button
                onClick={handleFriendToggle}
                className="group/friend relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: isFriend
                    ? `${theme.palette.error.main}20`
                    : `${theme.palette.primary.main}20`,
                  color: isFriend
                    ? theme.palette.error.main
                    : theme.palette.primary.main,
                  borderColor: isFriend
                    ? `${theme.palette.error.main}30`
                    : `${theme.palette.primary.main}30`,
                  border: "1px solid",
                }}
              >
                {isFriend ? (
                  <PersonRemoveOutlined className="transition-transform duration-300 group-hover/friend:scale-110" />
                ) : (
                  <PersonAddOutlined className="transition-transform duration-300 group-hover/friend:scale-110" />
                )}
              </button>
            )}
          </div>
        </div>
        {/* Tags Section - Optional */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs mb-5 font-medium rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${theme.palette.primary.main}10`,
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.primary.main}20`,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}{" "}
        {/* Edit Button for Bottom Section - Alternative placement */}
        {currentUser && isOwnProfile && (
          <button
            onClick={handleEdit}
            className="group/edit-bottom flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              margin: " 0 auto",

              backgroundColor: `${theme.palette.info.main}15`,
              color: theme.palette.info.main,
              border: `1px solid ${theme.palette.info.main}30`,
            }}
            title="Editar artículo"
          >
            <Edit
              size={16}
              className="transition-transform duration-300 group-hover/edit-bottom:scale-110"
            />
            <span className="text-sm font-medium hidden sm:inline">Editar</span>
          </button>
        )}
      </div>

      {/* Card shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
      </div>
    </div>
  );
};

export default ArticleCard;
