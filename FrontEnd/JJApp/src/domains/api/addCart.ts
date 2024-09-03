import { baseApi } from "../../store/baseQuery";


const addCartApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addCart: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type

      {
        product: { itemId: string };
        userId: string;
        quantity: number;
      }
    >({
      query: ({ product, userId, quantity }) => ({
        url: 'cart/add',
        method: 'POST',
        body: { product, userId, quantity },
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

export const { useAddCartMutation } = addCartApi;
