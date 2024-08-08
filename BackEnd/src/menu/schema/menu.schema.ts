import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MenuCTDocument = HydratedDocument<MenuCT>;

@Schema()
export class MenuCT {
  @Prop({ unique: [true, 'duplicate id entered'] })
  itemid: string;

  @Prop()
  item_categoryid: string;

  @Prop()
  itemname: string;


  @Prop()
  itemdescription: string;


  @Prop()
  price: string;



  @Prop()
  item_image_url: string;


}




export const MenuCTSchema = SchemaFactory.createForClass(MenuCT);