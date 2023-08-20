import { Type } from "class-transformer";

export class CheckUserLoginDto {
  @Type(() => String)
  refreshToken?: string;

  @Type(() => String)
  accessToken?: string;
}
