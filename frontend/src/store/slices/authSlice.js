import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("halkhata-user")) || null,
  token: localStorage.getItem("halkhata-token") || null,
  isAuthenticated: !!localStorage.getItem("halkhata-token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("halkhata-user", JSON.stringify(user));
      localStorage.setItem("halkhata-token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("halkhata-user");
      localStorage.removeItem("halkhata-token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
