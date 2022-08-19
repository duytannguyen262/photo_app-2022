import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, name, userId, token } = action.payload;
      state.user = { userId, name, email };
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    refreshToken: (state, action) => {
      state.token = action.payload.token;
    },
  },
});

export const { login, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
