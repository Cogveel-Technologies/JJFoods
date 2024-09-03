import { baseApi } from "../../../../../store/baseQuery";

const totalCartCountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    totalCartCount: build.query<string, { userId: string }>({
      query: ({ userId }) => ({
        url: `cart/cartNumber/${userId}`,
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

export const { useTotalCartCountQuery } = totalCartCountApi;
