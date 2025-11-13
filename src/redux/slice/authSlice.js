import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LOGIN: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    LOGOUT: (state) => {
      state.isLogin = false;
      state.user = null;
    },
    UPDATE_USER: (state, action) => {
      state.user = action.payload
    }
  },
});

export const { LOGIN, LOGOUT, UPDATE_USER } = authSlice.actions;
export default authSlice;
