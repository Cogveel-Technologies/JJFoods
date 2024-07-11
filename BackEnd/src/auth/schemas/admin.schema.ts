import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type AdminDocument = HydratedDocument<Admin>;

@Schema(
  {
    timestamps: true

  }
)
export class Admin {

  // name address email id phoneNumber
  @Prop()
  name: String;



  @Prop({ unique: [true, 'duplicate email entered'] })
  emailId: string;

  @Prop({ unique: [true, 'duplicate number entered'] })
  phoneNumber: number;

  @Prop()
  imageUrl: string;

  @Prop()
  password: string;



  @Prop()
  deviceToken: string;

  @Prop()
  role: string;

  // @Prop()
  // isOpen: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);