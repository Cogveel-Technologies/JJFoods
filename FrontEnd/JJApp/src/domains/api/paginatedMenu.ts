import { baseApi } from "../../store/baseQuery";
// import { MenuItem } from "../../types"; 

const paginatedMenuApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPaginatedMenuItems: build.query<[], { page: string }>({
      query: ({ page }) => ({
        url: `petPooja/paginatedmenu/${page}`, // Page is now part of the URL path

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

export const { useGetPaginatedMenuItemsQuery, useLazyGetPaginatedMenuItemsQuery } = paginatedMenuApi;
