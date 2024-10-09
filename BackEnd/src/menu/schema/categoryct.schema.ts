import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryCTDocument = HydratedDocument<CategoryCT>;

@Schema()
export class CategoryCT {

  @Prop({ unique: [true, 'duplicate id entered'] })
  categoryid: string;






  @Prop()
  categoryname: string;



  @Prop()
  category_image_url: string;



}

export const CategoryCTSchema = SchemaFactory.createForClass(CategoryCT);