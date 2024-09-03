import { baseApi } from "../../../../../store/baseQuery";


const allAddedPlacesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAddedPlaces: build.query<[], { userId: string }>({
      query: ({ userId }) => ({
        url: `auth/getAddresses/${userId}`,
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

export const { useGetAllAddedPlacesQuery, useLazyGetAllAddedPlacesQuery } = allAddedPlacesApi;
