import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MenuDocument = HydratedDocument<Menu>;

@Schema()
export class Menu {
  @Prop()
  itemName: string;

  @Prop()
  price: number;

  @Prop()
  imageUrl: string;

  @Prop()
  description: string;


}

export const MenuSchema = SchemaFactory.createForClass(Menu);