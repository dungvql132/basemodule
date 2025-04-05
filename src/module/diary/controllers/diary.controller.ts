import * as diaryService from "../services";
import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { CreateDiaryDto, DiaryDto, UpdateDiaryDto } from "../dto/Diary.dto";
import { asyncHandler } from "@src/base/utils"; 

// 📌 API lấy tất cả nhật ký
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const apiResponse = await diaryService.getAllDiaries();
  res.status(200).json(apiResponse);
});

// 📌 API lấy một nhật ký theo ID
export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid diary ID" });
  }

  // Lấy query parameters fromDate và endDate từ request
  const { fromDate, endDate } = req.query;

  // Kiểm tra nếu từ ngày hoặc đến ngày không hợp lệ
  if (fromDate && isNaN(Date.parse(fromDate as string))) {
    return res.status(400).json({ message: "Invalid fromDate format" });
  }
  if (endDate && isNaN(Date.parse(endDate as string))) {
    return res.status(400).json({ message: "Invalid endDate format" });
  }

  // Gọi service để lấy dữ liệu của diary với các tham số từ ngày và đến ngày (nếu có)
  const apiResponse = await diaryService.getOneDiary(id, fromDate ? fromDate as string : undefined, endDate ? endDate as string : undefined);

  res.status(apiResponse.data ? 200 : 404).json(apiResponse);
});


// 📌 API tạo mới một nhật ký
export const createDiary = asyncHandler(async (req: Request, res: Response) => {
  const diaryDto = plainToClass(CreateDiaryDto, req.body as object);
  
  const validationErrors = await validate(diaryDto);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const apiResponse = await diaryService.createDiary(diaryDto);
  res.status(201).json(apiResponse);
});

// 📌 API cập nhật nhật ký
export const updateDiary = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid diary ID" });
  }

  const diaryDto = plainToClass(UpdateDiaryDto, req.body as object);
  const validationErrors = await validate(diaryDto);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const apiResponse = await diaryService.updateDiary(id, diaryDto);
  res.status(200).json(apiResponse);
});

// 📌 API xóa nhật ký
export const deleteDiary = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid diary ID" });
  }

  const apiResponse = await diaryService.deleteDiary(id);
  res.status(200).json(apiResponse);
});
