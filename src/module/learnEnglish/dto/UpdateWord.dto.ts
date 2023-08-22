import { Type } from "class-transformer";
import { WordDetail } from "@prisma/client";
import { UpdateWordDetailDataDto } from "./UpdateWordDetail.dto";
import { CreateWordDetailDataDto } from "./CreateWordDetail.dto";

export class UpdateWordDto {
  @Type(() => String)
  text: string;
  wordDetails?: WordDetail[];
}

export class UpdateWordDataDto {
  @Type(() => String)
  text: string;

  wordDetails?: {
    update?: UpdateWordDetailDataDto[];
    create?: CreateWordDetailDataDto[];
  };
}
