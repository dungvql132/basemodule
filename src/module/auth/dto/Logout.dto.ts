import { Type } from "class-transformer";

export class LogoutDto {
  @Type(() => String)
  refreshToken?: string;

  @Type(() => String)
  accessToken?: string;
}
