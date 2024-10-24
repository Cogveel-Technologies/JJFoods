import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

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
