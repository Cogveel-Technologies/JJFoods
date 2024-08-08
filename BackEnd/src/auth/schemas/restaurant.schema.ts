import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDetailsDocument = HydratedDocument<RestaurantDetails>;

@Schema()
export class RestaurantDetails {
  @Prop()
  isOpen: boolean;

  // @Prop()
  // menu: string;
  @Prop({ enum: ['petpooja', 'cogveel'] })
  menu: 'petpooja' | 'cogveel';

}

export const RestaurantDetailsSchema = SchemaFactory.createForClass(RestaurantDetails);