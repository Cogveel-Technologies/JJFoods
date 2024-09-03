import { baseApi } from "../../../../../../store/baseQuery";

const updateReservedBMenuApi = baseApi.injectEndpoints({
  endpoints: build => ({
    updateReservedBMenu: build.mutation<
      // Expected response type (replace with your actual type)
      {
        // response properties here
      },
      // Request body type
      Array<{
        itemId: string;
        actualQuantity: number;
        name: string;
      }>
    >({
      query: (items) => ({
        url: 'PETPOOJA/reservedadminquantityb',
        method: 'POST',
        body: items,
      }),
    }),
  }),
});

export const { useUpdateReservedBMenuMutation } = updateReservedBMenuApi;
