import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator";

export class ItemRatingDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  feedback: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
