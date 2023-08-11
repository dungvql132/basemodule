import { Type } from "class-transformer";

export class RenewAccessTokenDto {
  @Type(() => String)
  refreshToken: string;
}
