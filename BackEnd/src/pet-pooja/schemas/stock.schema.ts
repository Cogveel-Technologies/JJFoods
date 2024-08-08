

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StockDocument = HydratedDocument<StockItem>;

@Schema({ timestamps: true })
export class StockItem {
  @Prop()
  itemId: string;

  @Prop()
  quantity: number;

  @Prop({ default: 0 })
  used: number;

  @Prop()
  discrepancy: number;

  @Prop()
  actualQuantity: number;

  @Prop()
  name: string;






}

export const StockItemSchema = SchemaFactory.createForClass(StockItem);

@Schema({ timestamps: true })
export class Discrepancy {
  @Prop({ type: [StockItemSchema], default: [] })
  stockItems: StockItem[];
  
  @Prop()
  menu : string ;


}

export const DiscrepancySchema = SchemaFactory.createForClass(Discrepancy);
