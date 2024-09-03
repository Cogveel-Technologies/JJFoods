import { baseApi } from "../../../store/baseQuery";

const adminLoginApi = baseApi.injectEndpoints({
  endpoints: build => ({
    adminLogin: build.mutation<
      // Expected response type (replace with your actual type)
      {
        // response properties here
      },
      // Request body type
      {
        emailId: 'string'
        password: 'string';
        deviceToken: 'string'
      }
    >({
      query: ({ emailId, password, deviceToken }) => ({
        url: 'auth/superAdmin',
        method: 'POST',
        body: { emailId, password, deviceToken },
      }),
    }),
  }),
});

export const { useAdminLoginMutation } = adminLoginApi;
