import { combineReducers } from "@reduxjs/toolkit";

import authSlice from "../slices/authSlice";
import organizerAuthSlice from "../slices/organizerAuthSlice";
import promoterAuthSlice from "../slices/promoterAuthSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  organizerauth: organizerAuthSlice,
  promoterauth: promoterAuthSlice,
});

export default rootReducer;
