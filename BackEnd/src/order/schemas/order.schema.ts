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

  @Prop({ default: 'pending', enum: ['pending', 'processing', 'ready', 'on the way', 'completed', 'cancelled'] })
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
      reason: { type: String }
    }


  })
  payment: {
    orderId: string;
    paymentMethod: string;
    paymentId: string;
    status: boolean;
    signature: string;
    reason: string;

  };
  @Prop({
    type: {
      orderId: { type: String },
      clientOrderId: { type: String },
      restId: { type: String }
    }
  })
  petPooja: {
    orderId: string,
    clientOrderId: string,
    restId: string
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