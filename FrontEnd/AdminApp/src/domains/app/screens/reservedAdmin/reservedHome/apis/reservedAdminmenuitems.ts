import { baseApi } from "../../../../../../store/baseQuery";


interface HomeScreenDataResponse { }

const reservedAdminMenuItemsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    reservedAdminMenuItems: build.query<[], void>({
      query: () => ({
        url: `PETPOOJA/getstock`,
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

export const { useReservedAdminMenuItemsQuery } = reservedAdminMenuItemsApi
