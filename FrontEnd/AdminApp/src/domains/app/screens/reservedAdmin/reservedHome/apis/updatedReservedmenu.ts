import { baseApi } from "../../../../../../store/baseQuery";

const updateReservedAMenuApi = baseApi.injectEndpoints({
  endpoints: build => ({
    updateReservedAMenu: build.mutation<
      // Expected response type (replace with your actual type)
      {
        // response properties here
      },
      // Request body type
      Array<{
        itemId: string;
        quantity: number;
        name: string;
      }>
    >({
      query: (items) => ({
        url: 'PETPOOJA/reservedadminquantitya',
        method: 'POST',
        body: items,
      }),
    }),
  }),
});

export const { useUpdateReservedAMenuMutation } = updateReservedAMenuApi;
