import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../dto/createUser.dto";
import { validate } from "class-validator";
import authService from "../services";
import { LoginUserDto } from "../dto/loginUser.dto";
import { RenewAccessTokenDto } from "../dto/RenewAccessToken.dto";

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

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const loginUserDto = plainToClass(LoginUserDto, req.body);

    const validationErrors = await validate(loginUserDto);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const apiReponse = await authService.login(loginUserDto);

    res.status(200).json({ ...apiReponse });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
}

export async function renewAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const renewAccessTokenDto = plainToClass(RenewAccessTokenDto, req.body);

    const validationErrors = await validate(renewAccessTokenDto);

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const apiReponse = await authService.renewAccessToken(renewAccessTokenDto);

    res.status(200).json({ ...apiReponse });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
}
