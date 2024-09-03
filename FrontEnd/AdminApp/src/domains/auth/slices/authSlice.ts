import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  token: "",
  isAuthenticated: false,
  role: "",
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    setToken: (state, action: PayloadAction<{
      token: string;
      isAuthenticated: boolean;
      role: string;
    }>) => {
      state = { ...state, ...action.payload }
      return state;
    },

    logout: (state) => {
      // Reset state to initial values
      state.token = "";
      state.isAuthenticated = false;
      state.role = "";
    },
  }

})
export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer