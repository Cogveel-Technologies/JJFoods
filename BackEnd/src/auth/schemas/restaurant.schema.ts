import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDetailsDocument = HydratedDocument<RestaurantDetails>;

@Schema()
export class RestaurantDetails {
  @Prop()
  isOpen: boolean;

}

export const RestaurantDetailsSchema = SchemaFactory.createForClass(RestaurantDetails);