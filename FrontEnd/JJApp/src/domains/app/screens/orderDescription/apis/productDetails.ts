import { baseApi } from "../../../../../store/baseQuery";

// Define the request body type with itemId
interface ProductDetailsRequest {
  userId: string;
  itemId: string;
}

// Define the response type
interface ProductDetailsResponse {
  message: string;
}

const productDetailsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    productDetails: build.mutation<ProductDetailsResponse, ProductDetailsRequest>({
      query: ({ userId, itemId }) => ({
        url: `petPooja/${itemId}`,
        method: 'POST',
        body: { userId },
      }),
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          message: response.data?.message || "An error occurred",
        };
      },
    }),
  }),
});

export const { useProductDetailsMutation } = productDetailsApi;
