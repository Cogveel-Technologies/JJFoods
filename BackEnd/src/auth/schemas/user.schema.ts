import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Cart } from 'src/cart/schemas/cart.schema';
import { UserRoles } from '../user.roles';

export type UserDocument = HydratedDocument<User>;

@Schema(
  {
    timestamps: true

  }
)
export class User {

  // name address email id phoneNumber
  @Prop()
  name: String;



  @Prop({ unique: [true, 'duplicate email entered'] })
  emailId: string;

  @Prop({ unique: [true, 'duplicate number entered'] })
  phoneNumber: number;

  @Prop()
  imageUrl: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  // cart: Cart

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  reason: string


  @Prop({ default: false })
  isAdmin: boolean


  // @Prop({ type: 'enum', enum: UserRoles, default: UserRoles.User })
  // roles: UserRoles


  @Prop()
  deviceToken: string;

  @Prop({ type: Date, default: null })
  isDeletedDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);