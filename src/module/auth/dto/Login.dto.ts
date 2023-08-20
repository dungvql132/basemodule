import { Type } from "class-transformer";
import { IsEmail } from "class-validator";

export class LoginDto {
  @Type(() => String)
  password: string;

  @IsEmail()
  @Type(() => String)
  email: string;
}
