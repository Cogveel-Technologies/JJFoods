import { baseApi } from "../../store/baseQuery";

const increaseCartItems = baseApi.injectEndpoints({
  endpoints: (build) => ({
    increaseCart: build.mutation<
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
        url: 'cart/addQuantity',
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

export const { useIncreaseCartMutation } = increaseCartItems;
export default increaseCartItems;
