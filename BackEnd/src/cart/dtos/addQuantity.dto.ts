import { IsNotEmpty, IsOptional, IsString } from "class-validator";

class Product {
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsOptional()
  @IsString()
  variationId: string;
}

export class AddQuantityDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  product: Product;
}
