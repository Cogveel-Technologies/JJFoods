import { baseApi } from "../../../../store/baseQuery";


const textApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    textResponse: build.query<[], void>({
      query: () => ({
        url: '',
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

export const { useTextResponseQuery } = textApi;
