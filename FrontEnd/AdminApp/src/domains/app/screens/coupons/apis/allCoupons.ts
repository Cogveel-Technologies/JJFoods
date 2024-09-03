import { baseApi } from "../../../../../store/baseQuery";


const allCouponsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    allCoupons: build.query<[], void>({
      query: () => ({
        url: `coupon/admin/all`,
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

export const { useAllCouponsQuery } = allCouponsApi;
