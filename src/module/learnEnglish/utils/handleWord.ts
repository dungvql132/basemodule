import { CreateWordDataDto, CreateWordDto } from "../dto/CreateWord.dto";
import {
  CreateWordDetailDataDto,
  CreateWordDetailDto,
} from "../dto/CreateWordDetail.dto";
import { UpdateWordDataDto, UpdateWordDto } from "../dto/UpdateWord.dto";
import {
  UpdateWordDetailDataDto,
  UpdateWordDetailDto,
} from "../dto/UpdateWordDetail.dto";
import {
  UpdateWordExampleDataDto,
  UpdateWordExampleDto,
} from "../dto/UpdateWordExample";

export function generateCreateWordData(
  createWordDto: CreateWordDto
): CreateWordDataDto {
  const result: CreateWordDataDto = {
    ...createWordDto,
    wordDetails: {
      create: createWordDto.wordDetails?.map((word_detail) =>
        generateCreateWordDetailData(word_detail)
      ),
    },
  };
  return result;
}

export function generateCreateWordDetailData(
  createWordDetailDto: CreateWordDetailDto
): CreateWordDetailDataDto {
  const result: CreateWordDetailDataDto = {
    ...createWordDetailDto,
    wordExamples: {
      create: createWordDetailDto.wordExamples,
    },
  };
  return result;
}

export function generateUpdateWordExampleData(
  updateWordExampleDto: UpdateWordExampleDto
): UpdateWordExampleDataDto {
  const { id } = updateWordExampleDto;
  const result: UpdateWordExampleDataDto = {
    data: {
      ...updateWordExampleDto,
    },
    where: {
      id,
    },
  };
  return result;
}

export function generateUpdateWordDetailData(
  updateWordDetailDto: UpdateWordDetailDto
): UpdateWordDetailDataDto {
  const { id } = updateWordDetailDto;
  const result: UpdateWordDetailDataDto = {
    data: {
      ...updateWordDetailDto,
      wordExamples: {
        update: updateWordDetailDto.wordExamples
          ?.filter((wordExample) => !!wordExample.id)
          .map((wordExample) => generateUpdateWordExampleData(wordExample)),
        create: updateWordDetailDto.wordExamples?.filter(
          (wordExample) => !!!wordExample.id
        ),
      },
    },
    where: {
      id,
    },
  };
  return result;
}

export function generateUpdateWordData(
  updateWordDto: UpdateWordDto
): UpdateWordDataDto {
  const { text, wordDetails } = updateWordDto;
  const result: UpdateWordDataDto = {
    text,
    wordDetails: {
      update: wordDetails
        ?.filter((wordDetail) => !!wordDetail.id)
        .map((wordDetail) => generateUpdateWordDetailData(wordDetail)),
      create: wordDetails
        ?.filter((wordDetail) => !!!wordDetail.id)
        .map((wordDetail) => generateCreateWordDetailData(wordDetail)),
    },
  };
  return result;
}
