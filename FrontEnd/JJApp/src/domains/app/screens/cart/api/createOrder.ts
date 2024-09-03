import { baseApi } from "../../../../../store/baseQuery";

const createOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<string, {
      userId: string,
      orderPreference: string,
      discount?: { couponId: string },
      preOrder?: {
        type: boolean,
        orderDate: string,
        orderTime: string
      }
      address?: string,
      payment: {
        paymentId?: string,
        status?: boolean,
        paymentMethod: string;
      },

    }>({
      query: ({ userId, orderPreference, discount, address, payment, preOrder }) => ({
        method: 'POST',
        url: `order/createOrder`,
        body: { userId, orderPreference, discount, address, payment, preOrder },
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

export const { useCreateOrderMutation } = createOrderApi;
