import { baseApi } from "../../../../../store/baseQuery";


const updateProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateProfile: build.mutation<
      any, // Response type set to any
      FormData // Input type is FormData
    >({
      query: (formData) => ({
        url: 'auth/updateProfile',
        method: 'PUT',
        body: formData,
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

export const { useUpdateProfileMutation } = updateProfileApi;
