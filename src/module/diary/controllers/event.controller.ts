import * as eventService from "../services";
import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { CreateEventDto, EventDto, UpdateEventDto } from "../dto/Event.dto";
import { asyncHandler } from "@src/base/utils";

// 📌 API lấy tất cả Events
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const apiResponse = await eventService.getAllEvents();
  res.status(200).json(apiResponse);
});

// 📌 API lấy một Event theo ID
export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const apiResponse = await eventService.getOneEvent(id);
  res.status(apiResponse.data ? 200 : 404).json(apiResponse);
});

// 📌 API tạo mới một Event
export const create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const eventDto = plainToClass(CreateEventDto, req.body);
  const validationErrors = await validate(eventDto);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const apiResponse = await eventService.createEvent(eventDto);
  res.status(201).json(apiResponse);
});

// 📌 API cập nhật một Event
export const update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const updateEventDto = plainToClass(UpdateEventDto, req.body);
  const validationErrors = await validate(updateEventDto);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const apiResponse = await eventService.updateEvent(id, updateEventDto);
  res.status(apiResponse.data ? 200 : 404).json(apiResponse);
});

// 📌 API xóa một Event
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const apiResponse = await eventService.deleteEvent(id);
  res.status(apiResponse.data ? 200 : 404).json(apiResponse);
});
