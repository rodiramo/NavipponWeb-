import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../themeSlice";
import { userReducer } from "./reducers/userReducers";
import authReducer from "./reducers/authSlice";

const userInfoFromStorage = localStorage.getItem("account")
  ? JSON.parse(localStorage.getItem("account"))
  : null;

const initialState = {
  user: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    auth: authReducer,
  },
  preloadedState: initialState,
});

export default store;
