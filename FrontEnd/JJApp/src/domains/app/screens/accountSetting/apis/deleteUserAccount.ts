import { baseApi } from "../../../../../store/baseQuery";

const deleteUserAccountApi = baseApi.injectEndpoints({
  endpoints: build => ({
    deleteUserAccount: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type
      {
        reason: string;
        userId: string;
      }
    >({
      query: ({ reason, userId, }) => ({
        url: 'auth/delete',
        method: 'DELETE',
        body: { reason, userId, },
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

export const { useDeleteUserAccountMutation } = deleteUserAccountApi;
