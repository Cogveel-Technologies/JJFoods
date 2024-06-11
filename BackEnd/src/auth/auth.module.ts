import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from './schemas/user.schema';
import { SignupOtp, SignupOtpSchema } from './schemas/signupOtp.schema';
import { AddressSchema } from './schemas/address.schema';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Address', schema: AddressSchema },
      { name: 'SignupOtp', schema: SignupOtpSchema },
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
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
