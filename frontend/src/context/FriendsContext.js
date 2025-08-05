import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserFriends, toggleFriend } from "../services/index/users";
import { toast } from "react-hot-toast";

const FriendsContext = createContext();

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error("useFriends must be used within a FriendsProvider");
  }
  return context;
};

export const FriendsProvider = ({ children, user, token }) => {
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendsError, setFriendsError] = useState(null);

  useEffect(() => {
    console.log("🔍 FriendsProvider - Props changed:", {
      userId: user?._id,
      hasToken: !!token,
      userName: user?.name,
      timestamp: new Date().toISOString(),
    });
  }, [user, token]);

  // Load friends when user or token changes
  useEffect(() => {
    if (user?._id && token) {
      console.log("🔄 FriendsProvider - Loading friends for user:", user._id);
      loadFriends();
    } else {
      console.log("🚫 FriendsProvider - No user/token, clearing friends");
      setFriends([]);
    }
  }, [user?._id, token]);

  const loadFriends = async () => {
    if (!user?._id || !token) {
      console.log("❌ loadFriends - Missing user or token");
      return;
    }

    console.log("📡 loadFriends - Starting API call for user:", user._id);
    setFriendsLoading(true);
    setFriendsError(null);

    try {
      const friendsData = await getUserFriends({ userId: user._id, token });
      console.log("✅ loadFriends - Raw API response:", friendsData);

      // Handle different possible response formats
      let friendIds = [];

      if (Array.isArray(friendsData)) {
        // If it's an array, extract IDs
        friendIds = friendsData.map((friend) => {
          if (typeof friend === "string") {
            return friend; // Already an ID
          } else if (friend._id) {
            return friend._id; // Extract ID from object
          } else if (friend.userId) {
            return friend.userId; // Alternative ID field
          } else {
            console.warn("🟡 Unexpected friend format:", friend);
            return friend;
          }
        });
      } else if (friendsData.friends && Array.isArray(friendsData.friends)) {
        // If response has a friends property
        friendIds = friendsData.friends.map((friend) =>
          typeof friend === "string"
            ? friend
            : friend._id || friend.userId || friend
        );
      } else {
        console.warn("🟡 Unexpected friends data format:", friendsData);
        friendIds = [];
      }

      console.log("🎯 loadFriends - Processed friend IDs:", friendIds);
      setFriends(friendIds);
    } catch (error) {
      console.error("❌ loadFriends - Error:", error);
      setFriendsError(error.message);
      setFriends([]);
    } finally {
      setFriendsLoading(false);
    }
  };

  const toggleFriendStatus = async (userId) => {
    console.log("🔄 toggleFriendStatus - Called for user:", userId);

    if (!user?._id || !token) {
      console.log("❌ toggleFriendStatus - No user/token");
      toast.error("Inicia sesión para agregar amigos");
      return false;
    }

    try {
      console.log("📡 toggleFriendStatus - API call for user:", userId);
      const updatedUser = await toggleFriend({ userId, token });
      console.log("✅ toggleFriendStatus - API response:", updatedUser);

      // Update local state with the actual backend response
      const updatedFriendIds = updatedUser.friends || [];
      console.log(
        "🎯 toggleFriendStatus - Updated friend IDs:",
        updatedFriendIds
      );
      setFriends(updatedFriendIds);

      const isFriend = updatedFriendIds.includes(userId);
      console.log("🎯 toggleFriendStatus - User is now friend?", isFriend);

      toast.success(isFriend ? "Agregado a amigos" : "Eliminado de amigos");

      return isFriend;
    } catch (error) {
      console.error("❌ toggleFriendStatus - Error:", error);
      toast.error("Error al actualizar amigos");
      return null;
    }
  };

  const isFriend = (userId) => {
    const result = friends.includes(userId);
    console.log("🔍 isFriend check:", {
      userId,
      friends,
      result,
      friendsCount: friends.length,
    });
    return result;
  };

  const addFriend = (userId) => {
    console.log("➕ addFriend - Adding:", userId);
    if (!friends.includes(userId)) {
      setFriends((prev) => {
        const newFriends = [...prev, userId];
        console.log("✅ addFriend - New friends array:", newFriends);
        return newFriends;
      });
    }
  };

  const removeFriend = (userId) => {
    console.log("➖ removeFriend - Removing:", userId);
    setFriends((prev) => {
      const newFriends = prev.filter((id) => id !== userId);
      console.log("✅ removeFriend - New friends array:", newFriends);
      return newFriends;
    });
  };

  const refreshFriends = () => {
    console.log("🔄 refreshFriends - Manual refresh triggered");
    loadFriends();
  };

  // 🚨 DEBUG: Log current state
  useEffect(() => {
    console.log("📊 FriendsProvider - State update:", {
      friendsCount: friends.length,
      friends,
      loading: friendsLoading,
      error: friendsError,
      timestamp: new Date().toISOString(),
    });
  }, [friends, friendsLoading, friendsError]);

  const value = {
    friends,
    friendsLoading,
    friendsError,
    toggleFriendStatus,
    isFriend,
    addFriend,
    removeFriend,
    refreshFriends,
    loadFriends,
  };

  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
};

export default FriendsProvider;
