import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  totalCartPrice: number;
}

const initialState: CartState = {
  totalCartPrice: 0,
};

const totalCartPriceSlice = createSlice({
  name: 'totalCartPrice',
  initialState,
  reducers: {
    setTotalCartPrice: (state, action: PayloadAction<{ totalCartPrice: number }>) => {
      const { totalCartPrice } = action.payload;
      state.totalCartPrice = totalCartPrice;
    },
  }
});

export const { setTotalCartPrice } = totalCartPriceSlice.actions;
export default totalCartPriceSlice.reducer;
