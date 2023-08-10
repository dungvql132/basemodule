import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../dto/createUser.dto";
import { validate } from "class-validator";
import authService from "../services";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const createUserDto = plainToClass(CreateUserDto, req.body);

    const validationErrors = await validate(createUserDto);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const newUser = await authService.register(createUserDto);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
}
