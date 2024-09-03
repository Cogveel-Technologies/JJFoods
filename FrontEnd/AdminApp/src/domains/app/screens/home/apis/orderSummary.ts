import { baseApi } from "../../../../../store/baseQuery";


const orderSummaryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    orderSummary: build.query<[], { period: string }>({
      query: ({ period }) => ({
        url: `order/admin/getOrders/${period}`,
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

export const { useOrderSummaryQuery } = orderSummaryApi;
