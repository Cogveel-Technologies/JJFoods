import { baseApi } from "../../../../../store/baseQuery";


const updateOrderStatusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateOrderStatus: build.mutation<
      any,
      {
        orderId: string;
        state: string;
      }
    >({
      query: ({ orderId, state }) => ({
        url: `order/state/${orderId}`,
        method: 'PUT',
        body: { state },
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

export const { useUpdateOrderStatusMutation } = updateOrderStatusApi;
