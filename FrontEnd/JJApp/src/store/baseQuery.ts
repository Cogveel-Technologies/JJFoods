import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://192.168.1.2:3000/',
    // baseUrl: 'http://192.168.1.25:3000/',
    baseUrl: 'https://keen-franklin.180-179-213-167.plesk.page/',
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).persistedReducer.authSlice.token;
      // console.log(token, '-----')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
