import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsPhoneNumber } from 'class-validator';


export class SignupOtpDto {

  // @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsEmail({}, { message: "please enter correct email" })
  @Transform(({ value }) => value.trim().toLowerCase())
  emailId: string;


  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

}