import { IsNotEmpty, IsString } from "class-validator";

class Product {
  @IsNotEmpty()
  @IsString()
  itemId: string;
}

export class WishlistToCartDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  product: Product;
}
