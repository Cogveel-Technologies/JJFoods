import { baseApi } from "../../../../../store/baseQuery";


const addNewAddressApi = baseApi.injectEndpoints({
  endpoints: build => ({
    addNewAddress: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },

      // Request body type
      {
        name: string;
        user: string;
        phoneNumber: number;
        address1: string;
        address2: string;
        address3?: string;
        placeId?: string;
        pinCode: string;
        addressType: string;
        isDefault: boolean;
      }
    >({
      query: ({ name, user, phoneNumber, address1, address2, address3, placeId, pinCode, addressType, isDefault }) => ({
        url: 'auth/addAddress',
        method: 'POST',
        body: { name, user, phoneNumber, address1, address2, address3, placeId, pinCode, addressType, isDefault },
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

export const { useAddNewAddressMutation } = addNewAddressApi;
