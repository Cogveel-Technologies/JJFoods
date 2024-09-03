import { baseApi } from "../../../../../store/baseQuery";

const addToWishlist = baseApi.injectEndpoints({
  endpoints: build => ({
    addToWishlist: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type
      {
        itemId: string;
        userId: string;
      }
    >({
      query: ({ userId, itemId }) => ({
        url: 'wishlist/add',
        method: 'POST',
        body: { userId, itemId },
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

export const { useAddToWishlistMutation } = addToWishlist;
