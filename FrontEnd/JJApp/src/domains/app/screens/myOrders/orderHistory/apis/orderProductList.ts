import { baseApi } from "../../../../../../store/baseQuery";

const orderProductListApi = baseApi.injectEndpoints({
  endpoints: build => ({
    orderProductList: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type

      {
        userId: string;
        orderId: string,
      }
    >({
      query: ({ userId, orderId }) => ({
        url: 'order/user/order',
        method: 'POST',
        body: { userId, orderId },
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

export const { useOrderProductListMutation } = orderProductListApi;
