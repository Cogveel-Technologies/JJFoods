import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';


export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop()
  name: string;
  @Prop()
  phoneNumber: number;

  @Prop()
  address1: string;

  @Prop()
  address2: string;

  @Prop()
  address3: string;

  @Prop()
  pinCode: string;

  @Prop()
  addressType: string;

  @Prop()
  placeId: string;

  @Prop()
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);