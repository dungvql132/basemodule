import * as authService from "../services"; // Assuming authService is properly imported.
import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "@src/base/utils"; // Assuming asyncHandler is properly imported.
import { UpdateUserDto } from "../dto/updateUser.dto";

// Controller function for updating a user's information
export const updateUser = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateUserDto = plainToClass(UpdateUserDto, req.body); // Transform request body to UpdateUserDto class
  const updateUser = await authService.updateUser(
    Number(req.params.id), // Extract user ID from request parameters
    updateUserDto // Pass the updated user data to the authService for updating
  );

  res
    .status(201)
    .json({ message: "User update successfully", user: updateUser });
});

// Controller function for deleting a user
export const deleteUser = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const deleteUser = await authService.deleteUser(Number(req.params.id)); // Delete user by ID using the authService

  res
    .status(201)
    .json({ message: "User deleted successfully", user: deleteUser });
});

// Controller function for reactive a user
export const reactiveUser = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const reactiveUser = await authService.reactiveUser(Number(req.params.id)); // Reactive user by ID using the authService

  res
    .status(201)
    .json({ message: "User deleted successfully", user: reactiveUser });
});
