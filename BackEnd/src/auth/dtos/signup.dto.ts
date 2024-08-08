// import { Transform } from "class-transformer";
// import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";


// export class SignupDto {
//   @IsNotEmpty()
//   @IsString()
//   name: string;

//   @IsNotEmpty()
//   @IsEmail({}, { message: "please enter correct email" })
//   @Transform(({ value }) => value.trim().toLowerCase())
//   emailId: string;
//   // @Transform(({ value }) => parseInt(value))
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(1000000000)
//   @Max(9999999999)
//   phoneNumber: number;
//   // @Transform(({ value }) => parseInt(value))
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(10000)
//   @Max(99999)
//   otp: number;

//   @IsNotEmpty()
//   @IsString()
//   deviceToken: string;



// }
import { Transform, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested, ArrayNotEmpty, IsOptional } from "class-validator";

class Product {
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: "please enter correct email" })
  @Transform(({ value }) => value.trim().toLowerCase())
  emailId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  phoneNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  @Max(99999)
  otp: number;

  @IsNotEmpty()
  @IsString()
  deviceToken: string;

  @IsOptional()
  // @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Product)
  products: Product[];
}
