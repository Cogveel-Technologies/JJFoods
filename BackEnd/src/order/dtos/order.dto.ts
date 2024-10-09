import { IsNotEmpty, IsString, IsBoolean, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";

class Discount {
  @IsString()
  @IsOptional()
  couponId: string;
}

class Payment {
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
}

class PreOrder {
  @IsNotEmpty()
  @IsBoolean()
  type: boolean;

  @IsString()
  @IsOptional()
  orderDate: string;

  @IsString()
  @IsOptional()
  orderTime: string;
}

export class OrderDto {
  constructor() {
    // console.log("called")
  }
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  orderPreference: string;

  @ValidateNested()
  @Type(() => Discount)
  discount: Discount;

  @IsString()
  @IsOptional()
  address: string;

  @ValidateNested()
  @Type(() => Payment)
  payment: Payment;

  @ValidateNested()
  @Type(() => PreOrder)
  preOrder: PreOrder;
}
