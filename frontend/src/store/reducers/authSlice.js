import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || {
    friends: [],
    savedPosts: [],
  }, // 🔖 Add savedPosts to default
  token: localStorage.getItem("token") || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      console.log("🔄 Updating Redux with User Data:", action.payload);

      // ✅ Ensure all fields update correctly
      state.user = {
        ...state.user,
        ...action.payload, // ✅ Merge API response
        // Ensure savedPosts exists if not provided
        savedPosts: action.payload.savedPosts || state.user.savedPosts || [],
      };

      console.log("🛠 Updated Redux User:", state.user);
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    setFriends: (state, action) => {
      state.user.friends = Array.isArray(action.payload) ? action.payload : [];
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    // 🔖 ADD THIS NEW REDUCER
    setSavedPosts: (state, action) => {
      console.log("🔖 Updating saved posts:", action.payload);
      state.user.savedPosts = Array.isArray(action.payload)
        ? action.payload
        : [];
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setUserInfo, setFriends, setSavedPosts } = authSlice.actions; // 🔖 Add setSavedPosts to exports
export default authSlice.reducer;
