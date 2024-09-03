import { baseApi } from "../../../../../store/baseQuery";

const removeItemFromWishlistApi = baseApi.injectEndpoints({
  endpoints: build => ({
    removeItemFromWishlist: build.mutation<
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
        url: 'wishlist/remove/item',
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

export const { useRemoveItemFromWishlistMutation } = removeItemFromWishlistApi;
