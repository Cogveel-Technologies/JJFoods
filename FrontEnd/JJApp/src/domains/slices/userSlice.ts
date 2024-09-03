import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { users } from "../auth/types";


const initialState = {
  // isAuthenticated: false,
  userList: [] as users[],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserList: (state, action: PayloadAction<any[]>) => {
      state.userList = action.payload;
    },
  }

});

export const { setUserList } = userSlice.actions;
export default userSlice.reducer;
