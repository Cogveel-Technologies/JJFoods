import { IsNotEmpty, IsString, IsInt, IsBoolean, IsDateString, IsOptional } from "class-validator";

export class CouponDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  discountAmount: number;

  @IsNotEmpty()
  @IsDateString()
  validFrom: string;

  @IsNotEmpty()
  @IsDateString()
  validTo: string;

  @IsNotEmpty()
  @IsInt()
  usageLimit: number;

  @IsNotEmpty()
  @IsInt()
  minimumOrder: number;

  @IsNotEmpty()
  @IsInt()
  maximumOrder: number;

  @IsNotEmpty()
  @IsBoolean()
  isPercent: boolean;


  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
