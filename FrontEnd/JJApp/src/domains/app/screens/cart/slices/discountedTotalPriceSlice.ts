import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface DiscountedTotalPriceState {
  discountedTotalPrice: number;
}

const initialState: DiscountedTotalPriceState = {
  discountedTotalPrice: 0,
};

const discountedTotalPriceSlice = createSlice({
  name: 'discountedTotalPrice',
  initialState: initialState,
  reducers: {
    setDiscountedTotalPrice: (state, action: PayloadAction<{ discountedTotalPrice: number }>) => {
      const { discountedTotalPrice } = action.payload;
      state.discountedTotalPrice = discountedTotalPrice;
    },
  }
});

export const { setDiscountedTotalPrice } = discountedTotalPriceSlice.actions;
export default discountedTotalPriceSlice.reducer;