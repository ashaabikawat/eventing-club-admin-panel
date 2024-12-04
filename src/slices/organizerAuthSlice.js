import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organizerSignupData: null,
  organizertoken: localStorage.getItem("organizertoken")
    ? localStorage.getItem("organizertoken")
    : null,
};

const organizerAuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setOrganizerSignupData(state, value) {
      state.organizerSignupData = value.payload;
    },
    setToken(state, value) {
      state.organizertoken = value.payload;
    },
  },
});

export const { setOrganizerSignupData, setToken } = organizerAuthSlice.actions;
export default organizerAuthSlice.reducer;
