import { Type } from "class-transformer";
import { IsEmail } from "class-validator";

export class RegisterDto {
  @Type(() => String)
  password: string;

  @IsEmail()
  @Type(() => String)
  email: string;

  @Type(() => String)
  name: string;

  @Type(() => Number)
  age?: number;
}
