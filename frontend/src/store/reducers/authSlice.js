import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || { friends: [] },
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
      };

      console.log("🛠 Updated Redux User:", state.user);
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    setFriends: (state, action) => {
      state.user.friends = Array.isArray(action.payload) ? action.payload : [];
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setUserInfo, setFriends } = authSlice.actions;
export default authSlice.reducer;
