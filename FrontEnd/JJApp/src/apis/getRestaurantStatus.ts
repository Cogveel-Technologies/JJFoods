import { baseApi } from "../store/baseQuery";


const getRestaurantStatusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRestaurantStatus: build.query<[], void>({
      query: () => ({
        url: 'Auth/getrestaurantstatus',
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

export const { useGetRestaurantStatusQuery } = getRestaurantStatusApi;
