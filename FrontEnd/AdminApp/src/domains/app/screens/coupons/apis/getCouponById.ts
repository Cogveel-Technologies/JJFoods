import { baseApi } from "../../../../../store/baseQuery";

const getCouponByIdApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCouponById: build.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `coupon/admin/${id}`,
      }),
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          message: response.data?.message || "An error occurred",
        };
      },
    }),
  }),
});

export const { useGetCouponByIdQuery } = getCouponByIdApi;
