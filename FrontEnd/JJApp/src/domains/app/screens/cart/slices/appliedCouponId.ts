import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CouponState {
  appliedCoupon: string; // Changed property name to match the slice's state
}

const initialState: CouponState = {
  appliedCoupon: '',
};

const appliedCouponIdSlice = createSlice({
  name: 'appliedCoupon',
  initialState,
  reducers: {
    setCoupon: (state, action: PayloadAction<{ appliedCoupon: string }>) => {
      const { appliedCoupon } = action.payload;
      state.appliedCoupon = appliedCoupon;
    },
  }
});

export const { setCoupon } = appliedCouponIdSlice.actions;
export default appliedCouponIdSlice.reducer;
