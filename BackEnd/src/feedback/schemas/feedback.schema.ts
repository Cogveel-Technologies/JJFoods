import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Order } from 'src/order/schemas/order.schema';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({
  timestamps: true

})
export class Feedback {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User

  @Prop()
  feedback: string

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  // order: Order



  @Prop()
  itemId: string;
  // @Prop({ type: Schema.Types.ObjectId, ref: 'User', required: true })
  //   userId: User


  @Prop({ min: 1, max: 5 })
  rating: number;


}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);