import { baseApi } from "../../store/baseQuery";

const cartItemsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCartItems: build.query<[], { userId: string }>({
      query: ({ userId }) => ({
        url: `cart/${userId}`,
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

export const { useGetCartItemsQuery } = cartItemsApi;
