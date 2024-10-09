import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema()
export class Wishlist {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User

  @Prop()
  itemId: string



}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);