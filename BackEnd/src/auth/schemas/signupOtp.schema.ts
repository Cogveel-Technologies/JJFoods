import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SignupOtpDocument = HydratedDocument<SignupOtp>;

@Schema()
export class SignupOtp {
  @Prop({ unique: [true, 'duplicate email entered'] })
  emailId: string;

  @Prop()
  otp: number;

}

export const SignupOtpSchema = SchemaFactory.createForClass(SignupOtp);