import React, { createContext, useContext, useState, useEffect } from "react";
import { getSavedPosts, toggleSavePost } from "../services/index/posts";
import { toast } from "react-hot-toast";

const SavedPostsContext = createContext();

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error("useSavedPosts must be used within a SavedPostsProvider");
  }
  return context;
};

export const SavedPostsProvider = ({ children, user, token }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedPostsLoading, setSavedPostsLoading] = useState(false);
  const [savedPostsError, setSavedPostsError] = useState(null);

  // Load saved posts when user or token changes
  useEffect(() => {
    if (user?._id && token) {
      loadSavedPostIds();
    } else {
      setSavedPosts([]);
    }
  }, [user?._id, token]);

  const loadSavedPostIds = async () => {
    if (!user?._id || !token) return;

    setSavedPostsLoading(true);
    setSavedPostsError(null);
    try {
      // Get just the first page to extract post IDs for checking
      const savedPostsData = await getSavedPosts({
        token,
        page: 1,
        limit: 100, // Get more IDs for checking
      });

      // Extract just the post IDs for easier checking
      const postIds = savedPostsData.posts?.map((post) => post._id) || [];
      setSavedPosts(postIds);
    } catch (error) {
      console.error("Error loading saved posts:", error);
      setSavedPostsError(error.message);
      setSavedPosts([]);
    } finally {
      setSavedPostsLoading(false);
    }
  };

  const toggleSavePostStatus = async (postId) => {
    if (!user?._id || !token) {
      toast.error("Inicia sesión para guardar posts");
      return false;
    }

    try {
      const updatedUser = await toggleSavePost({ postId, token });

      // Update local state with the actual backend response
      const updatedSavedPostIds = updatedUser.savedPosts || [];
      setSavedPosts(updatedSavedPostIds);

      const isSaved = updatedSavedPostIds.includes(postId);
      toast.success(isSaved ? "Post guardado" : "Post removido de guardados");

      return isSaved;
    } catch (error) {
      console.error("Error toggling saved post:", error);
      toast.error("Error al guardar post");
      return null;
    }
  };

  const isSaved = (postId) => {
    return savedPosts.includes(postId);
  };

  const addSavedPost = (postId) => {
    if (!savedPosts.includes(postId)) {
      setSavedPosts((prev) => [...prev, postId]);
    }
  };

  const removeSavedPost = (postId) => {
    setSavedPosts((prev) => prev.filter((id) => id !== postId));
  };

  const refreshSavedPosts = () => {
    loadSavedPostIds();
  };

  const getSavedPostsCount = () => {
    return savedPosts.length;
  };

  const value = {
    savedPosts,
    savedPostsLoading,
    savedPostsError,
    toggleSavePostStatus,
    isSaved,
    addSavedPost,
    removeSavedPost,
    refreshSavedPosts,
    getSavedPostsCount,
    loadSavedPostIds,
  };

  return (
    <SavedPostsContext.Provider value={value}>
      {children}
    </SavedPostsContext.Provider>
  );
};

export default SavedPostsProvider;
