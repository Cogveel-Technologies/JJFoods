import { baseApi } from "../../../../../store/baseQuery";

const editAddressDetailsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    editAddressDetails: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string;
      },

      // Request body type
      {
        id: string;
        name?: string;
        phoneNumber?: number;
        address1?: string;
        address2?: string;
        address3?: string;
        pinCode: string;
        addressType?: string;
        isDefault?: boolean;
      }
    >({
      query: ({ id, name, phoneNumber, address1, address2, address3, pinCode, addressType, isDefault }) => ({
        url: `auth/updateAddress/${id}`,
        method: 'PUT',
        body: { name, phoneNumber, address1, address2, address3, pinCode, addressType, isDefault },
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

export const { useEditAddressDetailsMutation } = editAddressDetailsApi;
