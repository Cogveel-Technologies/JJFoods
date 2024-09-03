import { baseApi } from "../../../../../../store/baseQuery";

const cancelOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    cancelOrder: build.mutation<
      any,
      {
        orderId: string;
      }
    >({
      query: ({ orderId }) => ({
        url: `order/state/cancelled/${orderId}`,
        method: 'PUT',
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

export const { useCancelOrderMutation } = cancelOrderApi;
