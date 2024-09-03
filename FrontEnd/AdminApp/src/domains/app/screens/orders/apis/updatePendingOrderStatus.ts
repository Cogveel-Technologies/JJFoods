import { baseApi } from "../../../../../store/baseQuery";


const updatePendingOrderStatusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updatePendingOrderStatus: build.mutation<
      any,
      {
        orderId: string;
        state: string;
      }
    >({
      query: ({ orderId, state }) => ({
        url: `order/state/pending/${orderId}`,
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

export const { useUpdatePendingOrderStatusMutation } = updatePendingOrderStatusApi;
