import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { CartModule } from 'src/cart/cart.module';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import { CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { CouponModule } from 'src/coupon/coupon.module';
import { AddressSchema } from 'src/auth/schemas/address.schema';
import { PetPoojaModule } from 'src/pet-pooja/pet-pooja.module';
import { PetPoojaService } from 'src/pet-pooja/pet-pooja.service';
import { RazorpayModule } from 'src/razorpay/razorpay.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { Used, UsedSchema } from 'src/coupon/schemas/used.schema';
import { Discrepancy, DiscrepancySchema } from 'src/pet-pooja/schemas/stock.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }, { name: "Cart", schema: CartSchema }, { name: 'Coupon', schema: CouponSchema }, { name: 'User', schema: OrderSchema }, { name: "Address", schema: AddressSchema }, { name: Used.name, schema: UsedSchema }, { name: Discrepancy.name, schema: DiscrepancySchema }]), CartModule, CouponModule, forwardRef(() => PetPoojaModule), forwardRef(() => RazorpayModule), forwardRef(() => FeedbackModule), forwardRef(() => CouponModule)],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule { }
