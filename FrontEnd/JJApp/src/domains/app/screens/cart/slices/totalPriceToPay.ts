import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TotalPriceState {
  totalPriceToPay: number;
}

const initialState: TotalPriceState = {
  totalPriceToPay: 0,
};

const totalPriceToPaySlice = createSlice({
  name: 'totalPriceToPay',
  initialState,
  reducers: {
    setTotalPriceToPaySlice: (state, action: PayloadAction<{ totalPriceToPay: number }>) => {
      const { totalPriceToPay } = action.payload;
      state.totalPriceToPay = totalPriceToPay;
    },
  }
});

export const { setTotalPriceToPaySlice } = totalPriceToPaySlice.actions;
export default totalPriceToPaySlice.reducer;
