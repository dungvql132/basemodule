import { PrismaClient, User, Word } from "@prisma/client";
import { CreateWordDto } from "../dto/CreateWord.dto";
import { generateCreateWordData, generateUpdateWordData } from "../utils";
import { UpdateWordDto } from "../dto/UpdateWord.dto";
import { ApiError, ApiNotFoundError } from "@src/base/interface/ApiError";

const prisma = new PrismaClient();

export async function createWord(
  createWordDto: CreateWordDto,
  user: User
): Promise<Word> {
  const wordData = generateCreateWordData(createWordDto);
  const { text, wordDetails } = wordData;

  const word = await prisma.word.create({
    data: {
      text,
      userId: user.id,
      wordDetails,
    },
    include: { wordDetails: { include: { wordExamples: true } } },
  });

  return word;
}

export async function getAllWord(): Promise<Word[]> {
  const words = await prisma.word.findMany({
    include: { wordDetails: { include: { wordExamples: true } } },
  });

  return words;
}

export async function getWordById(wordId: number): Promise<Word> {
  const word = await prisma.word.findFirst({
    where: {
      id: wordId,
    },
    include: { wordDetails: { include: { wordExamples: true } } },
  });

  if (!word) throw new ApiNotFoundError("Word");

  return word;
}

export async function updateWordById(
  wordId: number,
  updateWordDto: UpdateWordDto
): Promise<Word> {
  const wordData = generateUpdateWordData(updateWordDto);
  const { text, wordDetails } = wordData;
  console.log(wordData);

  const word = await prisma.word.update({
    where: {
      id: wordId,
    },
    data: {
      text,
      wordDetails,
    },
    include: { wordDetails: { include: { wordExamples: true } } },
  });

  return word;
}
