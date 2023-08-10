import { Type } from "class-transformer";
import { IsEmail } from "class-validator";

export class CreateUserDto {
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
