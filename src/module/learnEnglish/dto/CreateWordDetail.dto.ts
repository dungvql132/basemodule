import { Type } from "class-transformer";
import { WordExample } from "@prisma/client";

export class CreateWordDetailDto {
  @Type(() => String)
  meaning: string;
  wordExamples?: WordExample[];
}

export class CreateWordDetailDataDto {
  @Type(() => String)
  meaning: string;

  wordExamples?: {
    create?: WordExample[];
  };
}
