import { baseApi } from "../../../../../store/baseQuery";

interface SearchResponse {
  items: any[];
}

// Define the query parameters type
interface SearchQueryParams {
  q: string;
}

const searchItemsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchItems: build.query<SearchResponse, SearchQueryParams>({
      query: ({ q }) => ({
        url: `petPooja/search`,
        params: { q },
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

export const { useSearchItemsQuery } = searchItemsApi;
