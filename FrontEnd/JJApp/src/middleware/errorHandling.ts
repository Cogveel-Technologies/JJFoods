import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { logout } from '../domains/auth/slices/authSlice';

interface RejectedActionPayload {
  status: number;
  data: {
    [key: string]: any;
  };
  error: string;
}

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => next => action => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as RejectedActionPayload;
      const { status, } = payload;
      // if (status === 401) {
      //   api.dispatch(logout());
      // }
    }
    return next(action);
  };
