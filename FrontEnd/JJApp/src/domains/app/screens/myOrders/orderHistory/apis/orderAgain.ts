import { baseApi } from "../../../../../../store/baseQuery";


const orderAgainApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    orderAgain: build.mutation<[], { orderId: string }>({
      query: ({ orderId }) => ({
        url: `order/orderagain/${orderId}`,
        method: 'POST',
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

export const { useOrderAgainMutation } = orderAgainApi;
