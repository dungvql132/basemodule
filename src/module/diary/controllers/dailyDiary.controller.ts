import * as dailyDiaryService from "../services";
import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { CreateDailyDiaryDto, DailyDiaryDto, UpdateDailyDiaryDto } from "../dto/DailyDiary.dto";
import { asyncHandler } from "@src/base/utils"; 

// 📌 API lấy tất cả DailyDiaries
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const apiResponse = await dailyDiaryService.getAllDailyDiaries();
  res.status(200).json(apiResponse);
});

// 📌 API lấy một DailyDiary theo ID
export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const apiResponse = await dailyDiaryService.getOneDailyDiary(id);
  res.status(apiResponse.data ? 200 : 404).json(apiResponse);
});

// 📌 API tạo mới một DailyDiary
export const create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const dailyDiaryDto = plainToClass(CreateDailyDiaryDto, req.body);
  const validationErrors = await validate(dailyDiaryDto);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const apiResponse = await dailyDiaryService.createDailyDiary(dailyDiaryDto);
  res.status(201).json(apiResponse);
});

// 📌 API cập nhật một DailyDiary
export const update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const updateDailyDiaryDto = plainToClass(UpdateDailyDiaryDto, req.body);
  const validationErrors = await validate(updateDailyDiaryDto);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const apiResponse = await dailyDiaryService.updateDailyDiary(id, updateDailyDiaryDto);
  res.status(apiResponse.data ? 200 : 404).json(apiResponse);
});

// 📌 API xóa một DailyDiary
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const apiResponse = await dailyDiaryService.deleteDailyDiary(id);
  res.status(apiResponse.data ? 200 : 404).json(apiResponse);
});
