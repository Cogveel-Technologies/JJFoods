import { IsNotEmpty, IsString } from "class-validator";

export class FetchPaymentByIdDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  rOrderId: string;

  @IsNotEmpty()
  @IsString()
  rPaymentId: string;

  @IsNotEmpty()
  @IsString()
  rSignature: string;
}
