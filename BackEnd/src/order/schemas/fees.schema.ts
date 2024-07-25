import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type FeesDocument = HydratedDocument<Fees>;

@Schema()
export class Fees {








  @Prop()
  deliveryFee: number

  @Prop()
  platformFee: number


}

export const FeesSchema = SchemaFactory.createForClass(Fees);