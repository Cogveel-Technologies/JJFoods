import { baseApi } from "../../../../../store/baseQuery";
import { GOOGLE_MAP_API } from "@env";

const cordinatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCordinates: build.query<any, { place_id: string }>({
      query: ({ place_id }) => ({
        url: `maps.googleapis.com/maps/api/place/details/json`,
        params: {
          place_id,
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

export const { useLazyGetCordinatesQuery } = cordinatesApi;
