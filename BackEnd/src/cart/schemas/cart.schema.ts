import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';


@Schema({ timestamps: true })
export class CartItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  // @Prop({ required: true })
  @Prop({ type: { itemId: { type: String }, variationId: { type: String }, vId: { type: String }, vName: { type: String } } })
  product: {
    itemId: string;
    variationId: string;
    vName: string;
    vId: string;

  };


  @Prop({ default: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
// export interface CartItem {
//   quantity: number,
//   product: {
//     pid: string;
//     name: string;
//     price: string;
//   }

// }

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: [CartItemSchema], default: [] })
  cartItems: CartItem[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User

}

export const CartSchema = SchemaFactory.createForClass(Cart);
