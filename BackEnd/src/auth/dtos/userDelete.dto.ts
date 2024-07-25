import { IsString } from "class-validator";


export class UserDeleteDto {

  @IsString()
  userId: string;

  @IsString()
  reason: string;



}