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


@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
      { name: SignupOtp.name, schema: SignupOtpSchema },
      { name: "Cart", schema: CartSchema },
      { name: Admin.name, schema: AdminSchema }
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
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
