import { baseApi } from "../../../../../store/baseQuery";

const restaurantStatusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    restaurantStatus: build.query<string, void>({
      query: () => ({
        url: `auth/getrestaurantstatus`,
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

export const { useRestaurantStatusQuery } = restaurantStatusApi;
