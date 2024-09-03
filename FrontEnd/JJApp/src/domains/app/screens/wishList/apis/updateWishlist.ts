import { baseApi } from "../../../../../store/baseQuery";

const updateWishlist = baseApi.injectEndpoints({
  endpoints: build => ({
    updateWishlist: build.mutation<
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
        url: 'wishlist/remove',
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

export const { useUpdateWishlistMutation } = updateWishlist;
