import { WordExample } from "@prisma/client";
import { UpdateWordExampleDataDto } from "./UpdateWordExample";

export class UpdateWordDetailDto {
  id: number;
  meaning: string;
  wordExamples?: WordExample[];
}

export class UpdateWordDetailDataDto {
  data: {
    meaning: string;
    wordExamples?: {
      update?: UpdateWordExampleDataDto[];
      create?: WordExample[];
    };
  };
  where: {
    id: number;
  };
}
