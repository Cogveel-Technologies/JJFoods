import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class ApplyCouponDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  couponId: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
