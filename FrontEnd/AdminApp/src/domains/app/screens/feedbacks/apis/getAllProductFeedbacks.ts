import { baseApi } from "../../../../../store/baseQuery";


const getAllProductFeedbackApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProductFeedback: build.query<[], void>({
      query: () => ({
        url: `feedback/admin/all`,
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

export const { useGetAllProductFeedbackQuery } = getAllProductFeedbackApi;
