import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";


export class LoginDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  @Max(99999)
  otp: number;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;

  @IsNotEmpty()
  @IsString()
  deviceToken: string;


}