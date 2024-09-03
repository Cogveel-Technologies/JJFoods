import { baseApi } from "../../../../../store/baseQuery";

const wishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<string, { userId: string }>({
      query: ({ userId }) => ({
        url: `wishlist/${userId}`,
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

export const { useGetWishlistQuery } = wishlistApi;
