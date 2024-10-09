import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";


export class UpdateProfileOtpDto {
  @IsOptional()
  @IsEmail({}, { message: "please enter correct email" })
  emailId: string;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;


}
