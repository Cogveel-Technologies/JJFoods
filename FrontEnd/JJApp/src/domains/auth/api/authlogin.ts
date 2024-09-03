import { baseApi } from "../../../store/baseQuery";

const authloginApi = baseApi.injectEndpoints({
  endpoints: build => ({
    loginUser: build.mutation<
      // Expected response type (replace with your actual type)
      {
        // response properties here
      },
      // Request body type
      {
        phoneNumber: number;
      }
    >({
      query: ({ phoneNumber }) => ({
        url: 'auth/login',
        method: 'POST',
        body: { phoneNumber },
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authloginApi;
