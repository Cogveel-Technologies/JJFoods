import { Transform } from "class-transformer"
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"



export class UpdateAddressDto {

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name: string;



  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;
  @IsString()
  @IsNotEmpty()
  address1: string;
  @IsString()
  @IsNotEmpty()
  address2: string;
  @IsString()
  @IsOptional()
  address3: string;
  @IsString()
  @IsNotEmpty()
  addressType: string;

  @IsBoolean()
  isDefault:boolean ;

}