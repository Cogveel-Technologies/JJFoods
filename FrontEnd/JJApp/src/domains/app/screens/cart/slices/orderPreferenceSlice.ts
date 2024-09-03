import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Preference {
  id: string;
  orderPreference: string;
}

const initialState: Preference = {
  id: "",
  orderPreference: "",
};

const orderPreferenceSlice = createSlice({
  name: 'orderPreference',
  initialState,
  reducers: {
    setOrderPreference: (state, action: PayloadAction<{ id: string; orderPreference: string }>) => {
      const { id, orderPreference } = action.payload;
      state.id = id;
      state.orderPreference = orderPreference;
    },
    resetOrderPreference: (state) => {
      state.id = initialState.id;
      state.orderPreference = initialState.orderPreference;
    },
  },
});

export const { setOrderPreference, resetOrderPreference } = orderPreferenceSlice.actions;
export default orderPreferenceSlice.reducer;
