import { baseApi } from "../../../store/baseQuery";

const authSignInOtpApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    singInOtp: build.mutation<
      {
        message: string
      },
      {
        phoneNumber: number
      }
    >({
      query: ({ phoneNumber }) => ({
        url: 'auth/loginOtp',
        method: 'POST',
        body: { phoneNumber },
      }),
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          message: response.data || "An error occurred",
        };
      },
    }),
  }),
});

export const { useSingInOtpMutation } = authSignInOtpApi;
