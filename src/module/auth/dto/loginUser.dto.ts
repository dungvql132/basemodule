import { Type } from "class-transformer";
import { IsEmail } from "class-validator";

export class LoginUserDto {
  @Type(() => String)
  password: string;

  @IsEmail()
  @Type(() => String)
  email: string;
}
