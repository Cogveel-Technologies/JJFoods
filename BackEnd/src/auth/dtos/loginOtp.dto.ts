import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";


export class LoginOtpDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;
}