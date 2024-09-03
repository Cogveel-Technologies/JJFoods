import { baseApi } from "../../../../../store/baseQuery";

const applyCouponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    applyCoupon: build.mutation<string, { userId: string, couponId: string, price: number }>({
      query: ({ userId, couponId, price }) => ({
        method: 'POST',
        url: `coupon/apply`,
        body: { userId, couponId, price },
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

export const { useApplyCouponMutation } = applyCouponApi;
