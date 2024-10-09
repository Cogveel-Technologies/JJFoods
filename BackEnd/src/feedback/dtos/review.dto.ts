import { IsNotEmpty, IsString } from "class-validator";

export class ReviewDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  review: string;
}
