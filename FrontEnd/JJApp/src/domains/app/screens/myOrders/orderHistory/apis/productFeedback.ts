import { baseApi } from "../../../../../../store/baseQuery";

const productFeedbackApi = baseApi.injectEndpoints({
  endpoints: build => ({
    productFeedback: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type

      {
        userId: string;
        itemId: string,
        feedback: string,
        rating: number,
        orderId?: string,
      }
    >({
      query: ({ userId, itemId, feedback, rating, orderId }) => ({
        url: '/feedback/orderItemRating',
        method: 'POST',
        body: { userId, itemId, feedback, rating, orderId },
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

export const { useProductFeedbackMutation } = productFeedbackApi;
