import { baseApi } from "../../../../../store/baseQuery";
import { GOOGLE_MAP_API } from '@env'

const placesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPlacesDetails: build.query<any, { latitude: number; longitude: number }>({
      query: ({ latitude, longitude }) => ({
        url: `https://maps.googleapis.com/maps/api/geocode/json`,
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_MAP_API,
        },
      }),
      transformResponse: (response: any) => {
        return response;
      },
      transformErrorResponse: (response: { status: number; data: any }) => {
        console.error("API Error Response:", response); // Log the error response for debugging
        return {
          status: response.status,
          message: response.data?.error_message || "An error occurred",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetPlacesDetailsQuery, useLazyGetPlacesDetailsQuery } = placesApi;
