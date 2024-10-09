import { IsNotEmpty, IsOptional, IsString } from "class-validator";

class Product {
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsOptional()
  @IsString()
  variationId: string;

  @IsOptional()
  @IsString()
  vId: string;

  @IsOptional()
  @IsString()
  vName: string;
}

export class WishlistToCartDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  product: Product;
}
