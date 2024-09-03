import { baseApi } from "../../../../../store/baseQuery";

interface HomeScreenDataResponse { }

const homeScreenDataApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    homeScreenData: build.query<[], void>({
      query: () => ({
        url: `order/admin/details`,
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

export const { useHomeScreenDataQuery } = homeScreenDataApi;
