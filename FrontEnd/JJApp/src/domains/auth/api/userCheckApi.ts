import { baseApi } from "../../../store/baseQuery";

const usercheckApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    usercheck: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string;
      },
      // Request body type
      {
        emailId?: string;
        phoneNumber?: number;
      }
    >({
      query: ({ phoneNumber, emailId }) => {
        const body: { emailId?: string; phoneNumber?: number } = {};
        if (phoneNumber) body.phoneNumber = phoneNumber;
        if (emailId) body.emailId = emailId;

        return {
          url: 'auth/check',
          method: 'POST',
          body,
        };
      },
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          message: response.data || "An error occurred",
        };
      },
    }),
  }),
});

export const { useUsercheckMutation } = usercheckApi;
