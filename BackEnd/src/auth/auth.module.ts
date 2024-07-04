import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Address, AddressSchema } from './schemas/address.schema';
import { SignupOtp, SignupOtpSchema } from './schemas/signupOtp.schema';
import { CartModule } from '../cart/cart.module';
import { CartSchema } from 'src/cart/schemas/cart.schema';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RestaurantDetails, RestaurantDetailsSchema } from './schemas/restaurant.schema';
import { NotificationModule } from 'src/notification/notification.module';
import { JwtAdminStrategy } from './jwtAdmin.strategy';



@Module({
  imports: [NotificationModule,
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRATION_TIME')
          }
        }
      }
    }),
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
      { name: SignupOtp.name, schema: SignupOtpSchema },
      { name: "Cart", schema: CartSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: RestaurantDetails.name, schema: RestaurantDetailsSchema }
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: configService.get<string>('EMAIL'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],

    }),
    forwardRef(() => CartModule)
  ],
  providers: [AuthService, JwtStrategy, JwtAdminStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, JwtAdminStrategy]
})
export class AuthModule { }
