import { baseApi } from "../../../../../store/baseQuery";

const deleteAddressApi = baseApi.injectEndpoints({
  endpoints: build => ({
    deleteAddress: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string;
      },
      // Request body type (or parameters type in this case)
      {
        id: string;
        userId: string;
      }
    >({
      query: ({ id, userId }) => ({
        url: `auth/deleteAddress/${id}`,
        method: 'DELETE',
        body: { userId },
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

export const { useDeleteAddressMutation } = deleteAddressApi;
