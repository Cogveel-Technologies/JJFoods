import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";


export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: "please enter correct email" })
  emailId: string;
  // @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;
  // @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  @Max(99999)
  otp: number;

  @IsNotEmpty()
  @IsString()
  deviceToken: string;



}