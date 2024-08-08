import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsPhoneNumber, Min, Max } from 'class-validator';


export class SignupOtpDto {

  // @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsEmail({}, { message: "please enter correct email" })
  @Transform(({ value }) => value.trim().toLowerCase())
  emailId: string;


  // @IsString()
  // @IsNotEmpty()
  // phoneNumber: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;

}