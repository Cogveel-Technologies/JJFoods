import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { logout } from '../domains/auth/slices/authSlice';


export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => next => action => {
    if (isRejectedWithValue(action)) {
      const { originalStatus } = action?.payload as any;
      if (originalStatus === 401) {
        api.dispatch(logout());
      }
    }
    return next(action);
  };