import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Coupon } from './coupon.schema';


@Schema()
export class Used {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' })
  code: Coupon;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User

  // @Prop()
  // isUsed: boolean
}

export const UsedSchema = SchemaFactory.createForClass(Used);