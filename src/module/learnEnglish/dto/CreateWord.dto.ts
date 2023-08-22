import { Type } from "class-transformer";
import { WordDetail } from "@prisma/client";
import { CreateWordDetailDataDto } from "./CreateWordDetail.dto";

export class CreateWordDto {
  @Type(() => String)
  text: string;
  wordDetails?: WordDetail[];
}

export class CreateWordDataDto {
  @Type(() => String)
  text: string;

  wordDetails?: {
    create?: CreateWordDetailDataDto[];
  };
}
