import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';




@Schema()
export class Coupon {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  discountAmount: number;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  validFrom: Date;

  @Prop({ required: true })
  validTo: Date;

  @Prop({ default: 0 })
  usageLimit: number;

  @Prop()
  minimumOrder: number;

  @Prop()
  maximumOrder: number;

  @Prop()
  isPercent: boolean

  @Prop()
  isActive: boolean


}

export const CouponSchema = SchemaFactory.createForClass(Coupon);




