import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";


export class UpdateAdminDto {

  // @IsOptional()
  @IsString()
  name: string;

  // @IsOptional()
  @IsEmail({}, { message: "please enter correct email" })
  @Transform(({ value }) => value.trim().toLowerCase())
  emailId: string;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;


}