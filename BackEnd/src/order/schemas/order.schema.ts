import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Address } from 'src/auth/schemas/address.schema';
import { User } from 'src/auth/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  products: [{
    itemId: string,
    price: number,
    quantity: number,
    details?: any;
  }];

  @Prop()
  cgst: number;

  @Prop()
  sgst: number;

  @Prop({
    type: {
      couponId: { type: String },
      discount: { type: Number }

    }
  })
  discount: {

    discount: number,
    couponId: string


  };



  @Prop()
  itemsTotal: number;

  @Prop({ default: 'pending', enum: ['pending', 'processing', 'ready', 'on the way', 'completed', 'cancelled', 'rejected'] })
  state: string;

  // @Prop({ default: 'processing', enum: ['processing', 'ready', 'on the way'] })
  // status: string;

  @Prop()
  grandTotal: number

  @Prop()
  deliveryFee: number

  @Prop()
  platformFee: number


  @Prop()
  orderPreference: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  address: Address;
  @Prop({
    type: {
      paymentMethod: { type: String },
      paymentId: { type: String },
      status: { type: Boolean },
      orderId: { type: String },
      signature: { type: String },
      reason: { type: String },
      refund: { type: Boolean },
      refundId: { type: String },
      refundDate: { type: String },
      refundStatus: { type: String }
    }


  })
  payment: {
    orderId: string;
    paymentMethod: string;
    paymentId: string;
    status: boolean;
    signature: string;
    reason: string;
    refund?: boolean;
    refundId?: string;
    refundDate?: string;
    refundStatus?: string;

  };
  @Prop({
    type: {
      orderId: { type: String },
      clientOrderId: { type: String },
      restId: { type: String },
      status: { type: String },
      cancel_reason: { type: String },
      minimum_prep_time: { type: String },
      minimum_delivery_time: { type: String },
      rider_name: { type: String },
      rider_phone_number: { type: String },
      is_modified: { type: Boolean }
    }
  })
  petPooja: {
    orderId?: string,
    clientOrderId?: string,
    restId?: string,
    status?: string,
    cancel_reason?: string,
    minimum_prep_time?: string,
    minimum_delivery_time?: string,
    rider_name?: string,
    rider_phone_number?: string,
    is_modified?: boolean
  }

  @Prop({
    type: {
      type: Boolean,
      required: true, // Assuming type is required, set to false if not
      default: false
    },
    orderDate: {
      type: String,
      required: false

    },
    orderTime: {
      type: String,
      required: false,
    },
  })
  preOrder: {
    type: boolean;
    orderDate?: string;
    orderTime?: string;
  };



  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

}

export const OrderSchema = SchemaFactory.createForClass(Order);