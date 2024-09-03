import { baseApi } from "../../../store/baseQuery";

const authSignUpApi = baseApi.injectEndpoints({
  endpoints: build => ({
    signUp: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type
      {
        name: string;
        emailId: string;
        phoneNumber: number;
        otp: number;
        products: Array<{ itemId: string; quantity: number }>;
        deviceToken: string;
      }
    >({
      query: ({ name, emailId, phoneNumber, otp, products, deviceToken }) => ({
        url: 'auth/signup',
        method: 'POST',
        body: { name, emailId, phoneNumber, otp, products, deviceToken },
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

export const { useSignUpMutation } = authSignUpApi;
