import { baseApi } from "../../../store/baseQuery";

const authSignupOtpApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    singUpotp: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type
      {
        emailId: string,
        phoneNumber: number
      }
    >({
      query: ({ emailId, phoneNumber }) => ({
        url: 'auth/signupOtp',
        method: 'POST',
        body: { emailId, phoneNumber },
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

export const { useSingUpotpMutation } = authSignupOtpApi;
