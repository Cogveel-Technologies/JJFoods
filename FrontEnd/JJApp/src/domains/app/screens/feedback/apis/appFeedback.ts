import { baseApi } from "../../../../../store/baseQuery";

const appFeedbackApi = baseApi.injectEndpoints({
  endpoints: build => ({
    appFeedback: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type
      {
        review: string;
        user: string;
      }
    >({
      query: ({ user, review }) => ({
        url: 'feedback/review',
        method: 'POST',
        body: { user, review },
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

export const { useAppFeedbackMutation } = appFeedbackApi;
