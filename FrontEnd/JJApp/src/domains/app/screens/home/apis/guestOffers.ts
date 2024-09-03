import { baseApi } from "../../../../../store/baseQuery";



const guestOffersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    guestOffers: build.query<[], void>({
      query: () => ({
        url: 'coupon',
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

export const { useGuestOffersQuery } = guestOffersApi;
