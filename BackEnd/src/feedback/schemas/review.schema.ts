import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  timestamps: true

})
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User

  @Prop()
  review: string

}

export const ReviewSchema = SchemaFactory.createForClass(Review);