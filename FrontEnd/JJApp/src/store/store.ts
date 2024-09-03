import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { rtkQueryErrorLogger } from '../middleware/errorHandling';
import { baseApi } from './baseQuery';
import authSlice from '../domains/auth/slices/authSlice';
import userDetailsSlice from '../domains/auth/slices/userDetailsSlice';
import menuSlice from '../domains/slices/menuSlice';
import cartItemsSlice from '../domains/app/screens/cart/slices/cartItemsSlice';
import totalCartPriceSlice from '../domains/app/screens/cart/slices/totalCartPriceSlice';
import orderPreferenceSlice from '../domains/app/screens/cart/slices/orderPreferenceSlice';
import discountedTotalPriceSlice from '../domains/app/screens/cart/slices/discountedTotalPriceSlice';
import totalPriceToPay from '../domains/app/screens/cart/slices/totalPriceToPay';
import deliveryAddressIdSlice from '../domains/app/screens/cart/slices/deliveryAddressIdSlice';
import appliedCouponId from '../domains/app/screens/cart/slices/appliedCouponId';


const persistConfig = {
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  authSlice,
  userDetailsSlice,
  menuSlice,
  orderPreferenceSlice,
  cartItemsSlice,
  totalCartPriceSlice,
  discountedTotalPriceSlice,
  totalPriceToPay,
  deliveryAddressIdSlice,
  appliedCouponId
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    persistedReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(baseApi.middleware, rtkQueryErrorLogger),
});

export const persistor = persistStore(store);
// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;