import { baseApi } from "../../../../../store/baseQuery";

const updateCouponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateCoupon: build.mutation<string, {
      id: string;
      code?: string;
      title?: string;
      description?: string;
      discountAmount?: number;
      validFrom?: string;
      validTo?: string;
      usageLimit?: number;
      minimumOrder?: number;
      maximumOrder?: number;
      isPercent?: boolean;
      isActive?: boolean;
    }>({
      query: ({ id, ...body }) => ({
        url: `coupon/admin/${id}`,
        method: 'PUT',
        body,
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

export const { useUpdateCouponMutation } = updateCouponApi;
