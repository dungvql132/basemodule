import { asyncHandler } from "@src/base/utils";
import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { CreateWordDto } from "../dto/CreateWord.dto";
import * as wordService from "../services";
import { UpdateWordDto } from "../dto/UpdateWord.dto";

// Controller function for user registration
export const createWord = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user } = req;
  const createWordDto = plainToClass(CreateWordDto, req.body);
  const newWord = await wordService.createWord(createWordDto, user);

  res.status(201).json({ message: "Word created successfully", word: newWord });
});

export const getAllWord = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const words = await wordService.getAllWord();

  res.status(200).json({ message: "Words getted successfully", words: words });
});

export const getWordById = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const word = await wordService.getWordById(Number(id));

  res.status(200).json({ message: "Word getted successfully", word: word });
});

export const updateWordById = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const updateWordDto = plainToClass(UpdateWordDto, req.body);
  const word = await wordService.updateWordById(Number(id), updateWordDto);

  res.status(200).json({ message: "Word updated successfully", word: word });
});
