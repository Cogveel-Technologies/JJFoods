import { Module, forwardRef } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SaltSchema } from './schemas/salt.schema';
import { OrderModule } from 'src/order/order.module';
import { OrderSchema } from 'src/order/schemas/order.schema';
import { ConfigModule } from '@nestjs/config';
import { PetPoojaModule } from 'src/pet-pooja/pet-pooja.module';
import { CartModule } from 'src/cart/cart.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { Discrepancy, DiscrepancySchema } from 'src/pet-pooja/schemas/stock.schema';
import { RestaurantDetails, RestaurantDetailsSchema } from 'src/auth/schemas/restaurant.schema';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: 'Salt', schema: SaltSchema }, { name: 'Order', schema: OrderSchema }, { name: Discrepancy.name, schema: DiscrepancySchema }, { name: RestaurantDetails.name, schema: RestaurantDetailsSchema }]), forwardRef(() => OrderModule), forwardRef(() => PetPoojaModule), CartModule, forwardRef(() => AuthModule), NotificationModule],
  providers: [RazorpayService],
  controllers: [RazorpayController],
  exports: [RazorpayService]
})
export class RazorpayModule { }



