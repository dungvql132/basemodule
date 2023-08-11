import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto } from "../dto/createUser.dto";
import { LoginUserDto } from "../dto/loginUser.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "../interface/payload";
import { IApiResponse } from "@src/base/interface/ApiResponse";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { RenewAccessTokenDto } from "../dto/RenewAccessToken.dto";
import { StatusCode } from "@src/base/config/statusCode";
import { ResponseStatus } from "@src/base/config/responseStatus";
import { ApiError } from "@src/base/interface/ApiError";
import { UpdateUserDto } from "../dto/updateUser.dto";
const prisma = new PrismaClient();

export async function updateUser(
  userId: number,
  updateUserDto: UpdateUserDto
): Promise<User> {
  const { email, name, password, age } = updateUserDto;
  let hashPassword;
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }

  const checkUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!checkUser) {
    throw new ApiError(
      "cannot found user",
      ResponseStatus.NOT_FOUND,
      StatusCode.NOT_FOUND
    );
  }

  // check the exist user
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
      name,
      password: hashPassword,
      age,
    },
  });

  return updateUser;
}

export async function deleteUser(userId: number): Promise<User> {
  const checkUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!checkUser) {
    throw new ApiError(
      "cannot found user",
      ResponseStatus.NOT_FOUND,
      StatusCode.NOT_FOUND
    );
  }

  // check the exist user
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email: `isDeleted_${checkUser.email}`,
      active: false,
    },
  });

  const tokens = await prisma.token.deleteMany({
    where: {
      userId: updateUser.id,
    },
  });

  return updateUser;
}
