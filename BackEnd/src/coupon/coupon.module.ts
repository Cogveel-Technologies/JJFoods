import { Module, forwardRef } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { CouponSchema } from './schemas/coupon.schema';
import { UsedSchema } from './schemas/used.schema';
import { CartModule } from 'src/cart/cart.module';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import { NotificationModule } from 'src/notification/notification.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Coupon', schema: CouponSchema }, { name: 'Used', schema: UsedSchema }, { name: 'Cart', schema: CartSchema }]), forwardRef(() => CartModule), NotificationModule],
  providers: [CouponService],
  controllers: [CouponController],
  exports: [CouponService]

})
export class CouponModule { }
