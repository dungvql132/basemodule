import { Type } from "class-transformer";

export class LogoutDto {
  @Type(() => String)
  accessToken: string;
}
