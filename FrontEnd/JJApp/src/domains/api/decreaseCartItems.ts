import { baseApi } from "../../store/baseQuery";

const decreaseCartItems = baseApi.injectEndpoints({
  endpoints: (build) => ({
    decreaseCart: build.mutation<
      {
        message: string;
        updatedCart: any;
      },
      {
        product: { itemId: string };
        userId: string;
      }
    >({
      query: ({ userId, product }) => ({
        url: 'cart/decreaseQuantity',
        method: 'PUT',
        body: { userId, product },
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

export const { useDecreaseCartMutation } = decreaseCartItems;
export default decreaseCartItems;
