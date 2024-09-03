import { baseApi } from "../../../../../store/baseQuery";

const orderWithStatusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    orderWithStatus: build.query<[], { state: string; orderType: string }>({
      query: ({ state, orderType }) => ({
        url: `order/admin/orders/${state}/${orderType}`,
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

export const { useOrderWithStatusQuery } = orderWithStatusApi;
