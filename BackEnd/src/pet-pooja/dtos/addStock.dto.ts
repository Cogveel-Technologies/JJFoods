import { IsNotEmpty, IsString, IsInt } from "class-validator";

export class AddStockDto {
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
