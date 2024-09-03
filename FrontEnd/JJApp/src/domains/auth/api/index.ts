import { baseApi } from "../../../store/baseQuery";
import { users } from "../types";


const userDetails = baseApi.injectEndpoints({
  endpoints: build => ({
    userDetails: build.query<
      users,
      {
        page?: number;
        results?: number;
      }
    >({
      query: arg => {
        const { page, results } = arg;
        const params: Record<string, any> = {};
        if (page !== undefined) params.page = page;
        if (results !== undefined) params.results = results;

        return {
          url: 'users',
          params,
        };
      },
      keepUnusedDataFor: 0,
    }),
  }),
});
export const { useUserDetailsQuery } = userDetails