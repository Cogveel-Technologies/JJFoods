
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";


export class CheckDto {


  @IsOptional()
  @IsEmail({}, { message: "please enter correct email" })
  @Transform(({ value }) => value.trim().toLowerCase())
  emailId: string;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;


}