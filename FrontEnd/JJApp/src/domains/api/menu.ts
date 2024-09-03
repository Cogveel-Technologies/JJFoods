import { baseApi } from "../../store/baseQuery";
// import { MenuItem } from "../../types"; 

const menuApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMenuItems: build.query<[], void>({
      query: () => ({
        url: 'petPooja/menu',
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

export const { useGetMenuItemsQuery } = menuApi;
