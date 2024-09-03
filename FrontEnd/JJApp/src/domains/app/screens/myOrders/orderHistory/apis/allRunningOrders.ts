import { baseApi } from "../../../../../../store/baseQuery";

interface Product {
  itemId: string;
  quantity: number;
  price: string;
}

interface Discount {
  couponId: string;
  _id: string;
}

interface Payment {
  paymentMethod: string;
  paymentId: string;
  status: boolean;
  _id: string;
  orderId?: string;
}

interface PetPooja {
  orderId: string;
  clientOrderId: string;
  restId: string;
  _id: string;
}

interface Order {
  _id: string;
  user: string;
  products: Product[];
  cgst: number;
  sgst: number;
  discount: Discount;
  itemsTotal: number;
  state: string;
  grandTotal: number;
  deliveryFee: number;
  platformFee: number;
  orderPreference: string;
  payment: Payment;
  petPooja?: PetPooja;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const allRunningOrdersApi = baseApi.injectEndpoints({
  endpoints: build => ({
    allRunningOrders: build.mutation<Order[], { userId: string; state: string }>({
      query: ({ userId, state }) => ({
        url: 'order/user',
        method: 'POST',
        body: { userId, state },
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

export const { useAllRunningOrdersMutation } = allRunningOrdersApi;
