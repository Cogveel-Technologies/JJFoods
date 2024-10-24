import { Transform } from "class-transformer"
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator"



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
  @Length(6, 6, { message: 'Pin code must be exactly 6 characters long' })
  @IsString()
  @IsNotEmpty()
  pinCode: string;

  @IsString()
  @IsOptional()
  placeId: string;

  @IsBoolean()
  isDefault: boolean;

}