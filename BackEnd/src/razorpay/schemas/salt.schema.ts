import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Order } from 'src/order/schemas/order.schema';

export type SaltDocument = HydratedDocument<Salt>;

@Schema()
export class Salt {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  orderId: Order

  @Prop()
  salt: string;


}

export const SaltSchema = SchemaFactory.createForClass(Salt);