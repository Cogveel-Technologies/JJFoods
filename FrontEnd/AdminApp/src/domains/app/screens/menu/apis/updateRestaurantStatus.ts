import { baseApi } from "../../../../../store/baseQuery";

const updateRestaurantStatusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateRestaurantStatus: build.mutation<any, void>({
      query: () => ({
        url: 'auth/updaterestaurantstatus',
        method: 'PUT',
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

export const { useUpdateRestaurantStatusMutation } = updateRestaurantStatusApi;
