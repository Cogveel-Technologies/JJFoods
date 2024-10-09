import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PetPoojaModule } from './pet-pooja/pet-pooja.module';
import { CartModule } from './cart/cart.module';
import { FeedbackModule } from './feedback/feedback.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { StripeModule } from './stripe/stripe.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './auth/user.roles';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MenuModule } from './menu/menu.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Adjust the path to your static files
    }),
    // Load environment variables from .env file and make them globally available
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // Configure Mongoose with connection URI from environment variables
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUrl = configService.get<string>('MONGO_URL');
        if (!mongoUrl) {
          throw new Error('MONGO_URL is not defined in the environment variables');
        }
        return {
          uri: mongoUrl,
        };
      },
      inject: [ConfigService],
    }),
    // Import application modules
    AuthModule,
    PetPoojaModule,
    CartModule,
    FeedbackModule,
    WishlistModule,
    CouponModule,
    OrderModule,
    StripeModule,
    RazorpayModule,
    AccessControlModule.forRoles(roles),
    ScheduleModule.forRoot(),
    NotificationModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    MenuModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
