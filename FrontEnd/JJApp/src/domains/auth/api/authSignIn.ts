import { baseApi } from "../../../store/baseQuery";

const authSignInApi = baseApi.injectEndpoints({
  endpoints: build => ({
    signIn: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type

      {
        phoneNumber: string;
        otp: number;
        deviceToken: string;
      }

    >({
      query: ({ phoneNumber, otp, deviceToken }) => ({
        url: 'auth/login',
        method: 'POST',
        body: { phoneNumber, otp, deviceToken },
      }),
      transformErrorResponse: (response: any) => {
        // Handle and log errors if needed
        return {
          status: response.status,
          message: response.data || "An error occurred",
        };
      },
    }),
  }),
});

export const { useSignInMutation } = authSignInApi;
