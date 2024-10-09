import { IsNotEmpty, IsString } from "class-validator";

export class WishlistDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  itemId: string;
}
