import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { RegisterDto } from "../dto/Register.dto";
import { validate } from "class-validator";
import * as authService from "../services"; // Assuming authService is properly imported.
import { LoginDto } from "../dto/Login.dto";
import { RenewAccessTokenDto } from "../dto/RenewAccessToken.dto";
import { asyncHandler } from "@src/base/utils"; // Assuming asyncHandler is properly imported.
import { CheckUserLoginDto } from "../dto/CheckUserLogin.dto";
import { LogoutDto } from "../dto/Logout.dto";

// Controller function for user registration
export const register = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const registerDto = plainToClass(RegisterDto, req.body); // Transform request body to RegisterDto class
  const newUser = await authService.register(registerDto); // Call the authService to register the user

  res.status(201).json({ message: "User created successfully", user: newUser });
});

// Controller function for user login
export const login = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const loginDto = plainToClass(LoginDto, req.body); // Transform request body to LoginDto class

  const validationErrors = await validate(loginDto); // Validate the LoginDto using class-validator

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors }); // Return validation errors if present
    return;
  }

  const apiReponse = await authService.login(loginDto); // Call the authService to perform login

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

export const checkUserLogin = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const checkUserLoginDto = plainToClass(CheckUserLoginDto, req.body); // Transform request body to RenewAccessTokenDto class

  const validationErrors = await validate(checkUserLoginDto); // Validate the renewAccessTokenDto using class-validator

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors }); // Return validation errors if present
    return;
  }

  const apiReponse = await authService.checkUserLogin(checkUserLoginDto); // Call the authService to renew access token

  res.status(200).json({ ...apiReponse });
});

export const logout = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const logoutDto = plainToClass(LogoutDto, req.body); // Transform request body to RenewAccessTokenDto class

  const validationErrors = await validate(logoutDto); // Validate the renewAccessTokenDto using class-validator

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors }); // Return validation errors if present
    return;
  }

  const apiReponse = await authService.logout(logoutDto); // Call the authService to renew access token

  res.status(200).json({ ...apiReponse });
});
