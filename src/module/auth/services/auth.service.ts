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
const prisma = new PrismaClient();

export async function register(createUserDto: CreateUserDto): Promise<User> {
  const { email, name, password, age } = createUserDto;

  // check the exist user
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (checkUser) {
    throw new ApiError(
      "dupicate user",
      ResponseStatus.DUPLICATE,
      StatusCode.DUPLICATE
    );
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, name, password: hashPassword, age },
  });
  return newUser;
}

export async function login(loginUserDto: LoginUserDto): Promise<IApiResponse> {
  const { email, password } = loginUserDto;
  let accessToken = "";
  let refreshToken = "";
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!(checkUser == null) && process.env.JWTSecret) {
    const secretKey = uuidv4();
    const newToken = await prisma.token.create({
      data: {
        secretKey,
        exp: moment(moment()).add(30, "days").toISOString(),
        userId: checkUser.id,
      },
    });

    const accessTokenPayload: IAccessTokenPayload = {
      email,
    };
    const isPasswordValid = bcrypt.compareSync(password, checkUser.password);
    if (!isPasswordValid)
      throw new ApiError(
        "wrong password",
        ResponseStatus.BAD_REQUEST,
        StatusCode.BAD_REQUEST
      );
    accessToken = jwt.sign(accessTokenPayload, process.env.JWTSecret);

    const refreshTokenPayload: IRefreshTokenPayload = {
      email,
      secretKey,
      id: newToken.id,
    };
    refreshToken = jwt.sign(refreshTokenPayload, process.env.JWTSecret);
    const result: IApiResponse = {
      accessToken,
      refreshToken,
      statusCode: StatusCode.SUCCESS,
      message: "login success",
      responseStatus: ResponseStatus.SUCCESS,
    };
    return result;
  }

  throw new ApiError(
    "user not found",
    ResponseStatus.NOT_FOUND,
    StatusCode.NOT_FOUND
  );
}

export async function renewAccessToken(
  renewAccessTokenDto: RenewAccessTokenDto
): Promise<IApiResponse> {
  const { refreshToken } = renewAccessTokenDto;

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.JWTSecret!
  ) as IRefreshTokenPayload;

  const checkToken = await prisma.token.findFirst({
    where: {
      id: decodedToken.id,
    },
  });

  if (checkToken) {
    if (checkToken.secretKey === decodedToken.secretKey) {
      const accessTokenPayload: IAccessTokenPayload = {
        email: decodedToken.email,
      };
      const accessToken = jwt.sign(accessTokenPayload, process.env.JWTSecret!);
      const secretKey = uuidv4();
      await prisma.token.update({
        where: {
          id: decodedToken.id,
        },
        data: {
          secretKey,
        },
      });
      const refreshTokenPayload: IRefreshTokenPayload = {
        email: decodedToken.email,
        secretKey,
        id: decodedToken.id,
      };
      const refreshToken = jwt.sign(
        refreshTokenPayload,
        process.env.JWTSecret!
      );
      const result: IApiResponse = {
        accessToken,
        refreshToken,
        statusCode: StatusCode.SUCCESS,
        message: "renew accesstoken success",
        responseStatus: ResponseStatus.SUCCESS,
      };
      return result;
    } else {
      await prisma.token.delete({
        where: {
          id: decodedToken.id,
        },
      });
      throw new ApiError(
        "use old token",
        ResponseStatus.UNAUTHORIZED,
        StatusCode.UNAUTHORIZED
      );
    }
  }

  throw new ApiError(
    "token not found",
    ResponseStatus.NOT_FOUND,
    StatusCode.NOT_FOUND
  );
}
