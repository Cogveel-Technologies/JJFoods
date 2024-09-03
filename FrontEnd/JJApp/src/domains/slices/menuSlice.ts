import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MenuItem {
  any: any
}

interface MenuState {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menuItems: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    fetchMenuItemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuItemsSuccess: (state, action: PayloadAction<MenuItem[]>) => {
      state.loading = false;
      state.menuItems = action.payload;
      state.error = null;
    },
    fetchMenuItemsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMenuItemsStart,
  fetchMenuItemsSuccess,
  fetchMenuItemsFailure,
} = menuSlice.actions;

export default menuSlice.reducer;
