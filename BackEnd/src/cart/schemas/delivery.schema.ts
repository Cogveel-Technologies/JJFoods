import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeliveryDocument = HydratedDocument<Delivery>;

@Schema()
export class Delivery {
  @Prop()
  range: number;
  price: number;

}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);