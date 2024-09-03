import { baseApi } from "../../../../../store/baseQuery";

const addToCartFromWishlistApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addToCartFromWishlist: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type
      {
        product: {
          itemId: string;
        }
        userId: string;

      }
    >({
      query: ({ userId, product, }) => ({
        url: 'wishlist/addToCart',
        method: 'POST',
        body: { userId, product, },
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

export const { useAddToCartFromWishlistMutation } = addToCartFromWishlistApi;
