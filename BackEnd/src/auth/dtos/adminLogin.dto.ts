import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class AdminLoginDto {

  @IsNotEmpty()
  @IsEmail({}, { message: "please enter correct email" })
  @Transform(({ value }) => value.trim().toLowerCase())
  emailId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  deviceToken: string;




}