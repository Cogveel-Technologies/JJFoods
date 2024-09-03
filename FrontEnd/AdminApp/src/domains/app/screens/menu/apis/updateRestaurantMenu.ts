import { baseApi } from "../../../../../store/baseQuery";


const updateRestaurantMenuApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateRestaurantMenu: build.mutation<any, void>({
      query: () => ({
        url: 'petpooja/updatedata',
        method: 'POST',
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

export const { useUpdateRestaurantMenuMutation } = updateRestaurantMenuApi;
