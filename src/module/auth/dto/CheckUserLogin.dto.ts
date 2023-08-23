import { Type } from "class-transformer";

export class CheckUserLoginDto {
  @Type(() => String)
  accessToken: string;
}
