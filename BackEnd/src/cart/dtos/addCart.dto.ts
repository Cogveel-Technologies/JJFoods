import { IsNotEmpty, IsString, IsNumber } from "class-validator";

class Product {
  @IsNotEmpty()
  @IsString()
  itemId: string;
}

export class AddCartDto {
  @IsNotEmpty()
  product: Product;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
