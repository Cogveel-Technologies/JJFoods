import { baseApi } from "../../../../../store/baseQuery";

const createCouponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCoupon: build.mutation<string, {
      code: string,
      title: string,
      description: string,
      discountAmount: number,
      validFrom: string,
      validTo: string,
      usageLimit: number,
      minimumOrder: number,
      maximumOrder: number,
      isPercent: boolean,
      isActive: boolean

    }>({
      query: ({ code, title, description, discountAmount, validFrom, validTo, usageLimit, minimumOrder, maximumOrder, isPercent, isActive }) => ({
        method: 'POST',
        url: `coupon`,
        body: { code, title, description, discountAmount, validFrom, validTo, usageLimit, minimumOrder, maximumOrder, isPercent, isActive },
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

export const { useCreateCouponMutation } = createCouponApi;
