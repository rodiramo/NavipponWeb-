import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../themeSlice";
import { userReducer } from "./reducers/userReducers";

const userInfoFromStorage = localStorage.getItem("account")
  ? JSON.parse(localStorage.getItem("account"))
  : null;

const initialState = {
  user: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer: {
    theme: themeReducer, // Add theme reducer
    user: userReducer,
  },
  preloadedState: initialState,
});

export default store;
