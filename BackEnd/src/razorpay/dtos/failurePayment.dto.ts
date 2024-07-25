import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class FailurePaymentDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsString()
  @IsOptional()
  rOrderId: string;

  @IsString()
  @IsOptional()
  rPaymentId: string;

  @IsString()
  @IsOptional()
  rSignature: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
