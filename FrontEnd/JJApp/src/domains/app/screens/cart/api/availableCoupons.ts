import { baseApi } from "../../../../../store/baseQuery";

const availableCouponsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAvailableCoupons: build.query<string, { userId: string }>({
      query: ({ userId }) => ({
        url: `coupon/${userId}`,
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

export const { useGetAvailableCouponsQuery } = availableCouponsApi;
