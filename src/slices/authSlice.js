import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminSignupData: null,
  token: localStorage.getItem("Admintoken")
    ? localStorage.getItem("Admintoken")
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setadminSignupData(state, value) {
      state.adminSignupData = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
    logout(state) {
      state.adminSignupData = null;
      state.token = null;
    },
  },
});

export const { setadminSignupData, setToken } = authSlice.actions;
export default authSlice.reducer;
