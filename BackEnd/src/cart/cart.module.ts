import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItemSchema, CartSchema } from './schemas/cart.schema';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { DeliverySchema } from './schemas/delivery.schema';

import { Admin, AdminSchema } from 'src/auth/schemas/admin.schema';
import { RestaurantDetails, RestaurantDetailsSchema } from 'src/auth/schemas/restaurant.schema';
import { Fees, FeesSchema } from 'src/order/schemas/fees.schema';
import { PetPoojaModule } from 'src/pet-pooja/pet-pooja.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }, { name: 'User', schema: UserSchema }, { name: 'CartItem', schema: CartItemSchema }, { name: 'Delivery', schema: DeliverySchema }, { name: Admin.name, schema: AdminSchema }, { name: RestaurantDetails.name, schema: RestaurantDetailsSchema }, { name: Fees.name, schema: FeesSchema }]), PetPoojaModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule { }
