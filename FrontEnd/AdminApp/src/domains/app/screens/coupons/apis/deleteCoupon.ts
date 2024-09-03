import { baseApi } from "../../../../../store/baseQuery";

const deleteCouponApi = baseApi.injectEndpoints({
  endpoints: build => ({
    deleteCoupon: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string;
      },
      // Request body type (or parameters type in this case)
      {
        id: string;
      }
    >({
      query: ({ id }) => ({
        url: `coupon/admin/${id}`,
        method: 'DELETE',
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

export const { useDeleteCouponMutation } = deleteCouponApi;
