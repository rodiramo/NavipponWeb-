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
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setFriends: (state, action) => {
      state.user.friends = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure friends is an array
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setUserInfo, setFriends } = authSlice.actions;
export default authSlice.reducer;
