import { IsNotEmpty, IsString } from "class-validator";


export class DeleteAddressDto {

  @IsString()
  @IsNotEmpty()
  userId: string;

}