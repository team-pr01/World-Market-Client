import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

type TAuthUser = {
     user: null | object;
     token: null | string;
};

const initialState: TAuthUser = {
     user: null,
     token: null,
};

const authSlice = createSlice({
     name: "auth",
     initialState,
     reducers: {
          setUser: (state, action) => {
               const { user, token } = action.payload;
               state.user = user;
               state.token = token;
          },
          logout: (state) => {
               state.user = null;
               state.token = null;
          },
     },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentUser = (state: RootState) => state.auth.user;
