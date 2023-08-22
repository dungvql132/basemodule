import { Type } from "class-transformer";
import { WordExample } from "@prisma/client";

export class UpdateWordExampleDto {
  id: number;
  example: string;
}

export class UpdateWordExampleDataDto {
  data: UpdateWordExampleDto;
  where: {
    id: number;
  };
}
