import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeliveryAddressState {
  deliveryAddressId: string;
}

const initialState: DeliveryAddressState = {
  deliveryAddressId: '',
};

const deliveryAddressIdSlice = createSlice({
  name: 'deliveryAddressId',
  initialState,
  reducers: {
    setDeliveryAddressId: (state, action: PayloadAction<string>) => {
      state.deliveryAddressId = action.payload;
    },
  },
});

export const { setDeliveryAddressId } = deliveryAddressIdSlice.actions;
export default deliveryAddressIdSlice.reducer;
