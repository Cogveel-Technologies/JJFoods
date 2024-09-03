import { baseApi } from "../../../../../store/baseQuery";

const defaultAddedPlace = baseApi.injectEndpoints({
  endpoints: (build) => ({
    defaultAddedPlace: build.mutation<
      {
        message: string;
        updatedCart: any;
      },
      {
        addressId: string;
        userId: string; // Add userId to the parameters
      }
    >({
      query: ({ addressId, userId }) => ({
        url: `auth/updateState/${addressId}`,
        method: 'PUT',
        body: { userId }, // Include userId in the body of the request
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

export const { useDefaultAddedPlaceMutation } = defaultAddedPlace;
export default defaultAddedPlace;
