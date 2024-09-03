import { baseApi } from "../../../../../store/baseQuery";

const updateCouponStatusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateCouponStatus: build.mutation<string, { id: string }>({
      query: ({ id }) => ({
        url: `coupon/admin/status/${id}`,
        method: 'PUT',
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

export const { useUpdateCouponStatusMutation } = updateCouponStatusApi;
