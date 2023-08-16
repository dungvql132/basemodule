import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../dto/createUser.dto";
import { validate } from "class-validator";
import * as authService from "../services"; // Assuming authService is properly imported.
import { LoginUserDto } from "../dto/loginUser.dto";
import { RenewAccessTokenDto } from "../dto/RenewAccessToken.dto";
import { asyncHandler } from "@src/base/utils"; // Assuming asyncHandler is properly imported.

// Controller function for user registration
export const register = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const createUserDto = plainToClass(CreateUserDto, req.body); // Transform request body to CreateUserDto class
  const newUser = await authService.register(createUserDto); // Call the authService to register the user

  res.status(201).json({ message: "User created successfully", user: newUser });
});

// Controller function for user login
export const login = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const loginUserDto = plainToClass(LoginUserDto, req.body); // Transform request body to LoginUserDto class

  const validationErrors = await validate(loginUserDto); // Validate the loginUserDto using class-validator

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors }); // Return validation errors if present
    return;
  }

  const apiReponse = await authService.login(loginUserDto); // Call the authService to perform login

  res.status(200).json({ ...apiReponse });
});

// Controller function to renew access token
export const renewAccessToken = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const renewAccessTokenDto = plainToClass(RenewAccessTokenDto, req.body); // Transform request body to RenewAccessTokenDto class

  const validationErrors = await validate(renewAccessTokenDto); // Validate the renewAccessTokenDto using class-validator

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors }); // Return validation errors if present
    return;
  }

  const apiReponse = await authService.renewAccessToken(renewAccessTokenDto); // Call the authService to renew access token

  res.status(200).json({ ...apiReponse });
});
