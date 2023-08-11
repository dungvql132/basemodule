import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../dto/createUser.dto";
import { validate } from "class-validator";
import authService from "../services";
import { LoginUserDto } from "../dto/loginUser.dto";
import { RenewAccessTokenDto } from "../dto/RenewAccessToken.dto";
import { asyncHandler } from "@src/base/utils";

export const register = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const createUserDto = plainToClass(CreateUserDto, req.body);
  const newUser = await authService.register(createUserDto);

  res.status(201).json({ message: "User created successfully", user: newUser });
});

export const login = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const loginUserDto = plainToClass(LoginUserDto, req.body);

  const validationErrors = await validate(loginUserDto);

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  const apiReponse = await authService.login(loginUserDto);

  res.status(200).json({ ...apiReponse });
});

export const renewAccessToken = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const renewAccessTokenDto = plainToClass(RenewAccessTokenDto, req.body);

  const validationErrors = await validate(renewAccessTokenDto);

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  const apiReponse = await authService.renewAccessToken(renewAccessTokenDto);

  res.status(200).json({ ...apiReponse });
});
