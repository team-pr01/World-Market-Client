import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AccountType = "demo" | "main";

interface AccountState {
     current: AccountType;
}

const initialState: AccountState = {
     current: "demo", // default
};

const accountSlice = createSlice({
     name: "account",
     initialState,
     reducers: {
          setAccountType(state, action: PayloadAction<AccountType>) {
               state.current = action.payload;
          },
     },
});

export const { setAccountType } = accountSlice.actions;
export default accountSlice.reducer;
