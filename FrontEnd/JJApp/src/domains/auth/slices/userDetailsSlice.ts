import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserDetails {
  name: string;
  email: string;
  phoneNumber: string;
  otp: string;
}

interface UserDetailsState {
  userDetails: UserDetails[];
}

const initialState: UserDetailsState = {
  userDetails: [],
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setuserDetailsSlice: (state, action: PayloadAction<UserDetails[]>) => {
      state.userDetails = action.payload;
    },
  },
});

export const { setuserDetailsSlice } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
