import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class AdminLoginDto {

  @IsNotEmpty()
  @IsEmail({}, { message: "please enter correct email" })
  emailId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;



}