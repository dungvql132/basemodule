import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../dto/createUser.dto";
import { validate } from "class-validator";
import authService from "../services";
import { LoginUserDto } from "../dto/loginUser.dto";
import { RenewAccessTokenDto } from "../dto/RenewAccessToken.dto";
import { asyncHandler } from "@src/base/utils";
import { UpdateUserDto } from "../dto/updateUser.dto";

export const updateUser = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateUserDto = plainToClass(UpdateUserDto, req.body);
  const updateUser = await authService.updateUser(
    Number(req.params.id),
    updateUserDto
  );

  res
    .status(201)
    .json({ message: "User update successfully", user: updateUser });
});

export const deleteUser = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const deleteUser = await authService.deleteUser(Number(req.params.id));

  res
    .status(201)
    .json({ message: "User update successfully", user: deleteUser });
});
