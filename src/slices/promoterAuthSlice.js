import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promoterSignupData: null,
  promotertoken: localStorage.getItem("promotertoken")
    ? localStorage.getItem("promotertoken")
    : null,
};

const promoterAuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setPromoterSignupData(state, value) {
      state.promoterSignupData = value.payload;
    },
    setToken(state, value) {
      state.promotertoken = value.payload;
    },
  },
});

export const { setPromoterSignupData, setToken } = promoterAuthSlice.actions;
export default promoterAuthSlice.reducer;
