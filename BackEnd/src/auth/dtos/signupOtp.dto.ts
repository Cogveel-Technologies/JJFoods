import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsPhoneNumber } from 'class-validator';


export class SignupOtpDto {

  // @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsEmail({}, { message: "please enter correct email" })
  emailId: string;


  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

}