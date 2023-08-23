// Import necessary modules and dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import environment from "@src/base/config/env";
import loggers from "@src/module/logger";
import i18n from "i18next";
import { PrismaClient, User } from "@prisma/client";
import { RegisterDto } from "../dto/Register.dto";
import { LoginDto } from "../dto/Login.dto";
import { ITokenPayload } from "../interface/payload";
import { IApiResponse } from "@src/base/interface/ApiResponse";
import { v4 as uuidv4 } from "uuid";
import { RenewAccessTokenDto } from "../dto/RenewAccessToken.dto";

import {
  ApiBadRequestError,
  ApiDuplicateError,
  ApiForbiddenError,
  ApiNotFoundError,
  ApiUnauthorizedError,
} from "@src/base/interface/ApiError";
import { LogoutDto } from "../dto/Logout.dto";
import { CheckUserLoginDto } from "../dto/CheckUserLogin.dto";
import { verifyToken, verifyTokenUser } from "../utils/verifyToken";
import { ErrorMessage, ObjectMessage, SuccessMessage } from "@src/base/message";
import { ResponseStatus } from "@src/base/config/ResponseStatus";

// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Function to register a new user
export async function register(RegisterDto: RegisterDto): Promise<User> {
  const { email, name, password, age } = RegisterDto;

  // Check if the user already exists
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (checkUser) {
    throw new ApiDuplicateError(ObjectMessage.USER);
  }

  // Hash the password and create a new user
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, name, password: hashPassword, age },
  });
  loggers.info.log("create user successfull");

  return newUser;
}

// Function for user login
export async function login(LoginDto: LoginDto): Promise<IApiResponse> {
  const { email, password } = LoginDto;
  let accessToken = "";
  let refreshToken = "";

  // Check if the user exists and JWTSECRET is set
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
      active: true,
    },
  });

  if (checkUser && environment.JWTSECRET) {
    // Generate tokens and handle login
    const secretKey = uuidv4();
    const newToken = await prisma.token.create({
      data: {
        secretKey,
        exp: moment(moment())
          .add(Number(environment.REFRESHTOKEN_EXP), "seconds")
          .toISOString(),
        userId: checkUser.id,
      },
    });

    const accessTokenPayload: ITokenPayload = {
      email,
      secretKey,
      tokenId: newToken.id,
    };
    const isPasswordValid = bcrypt.compareSync(password, checkUser.password);

    if (!isPasswordValid) {
      throw new ApiBadRequestError(i18n.t(ErrorMessage.WRONG_PASSWORD));
    }

    // create access token
    accessToken = jwt.sign(accessTokenPayload, environment.JWTSECRET, {
      expiresIn: environment.ACCESSTOKEN_EXP,
    });

    const refreshTokenPayload: ITokenPayload = {
      email,
      secretKey,
      tokenId: newToken.id,
    };

    // create refresh token
    refreshToken = jwt.sign(refreshTokenPayload, environment.JWTSECRET, {
      expiresIn: environment.REFRESHTOKEN_EXP,
    });

    return {
      accessToken,
      refreshToken,
      message: i18n.t(SuccessMessage.LOGIN_SUCCESS),
      responseStatus: ResponseStatus.SUCCESS,
    };
  }

  // Handle error if user is not found
  throw new ApiNotFoundError(ObjectMessage.USER);
}

// Function to renew access token
export async function renewAccessToken(
  renewAccessTokenDto: RenewAccessTokenDto
): Promise<IApiResponse> {
  const { refreshToken } = renewAccessTokenDto;
  console.log(refreshToken);

  // Verify the refresh token and handle renewal
  const verifyRefreshToken = await verifyToken(refreshToken);
  if (verifyRefreshToken.token) {
    const { decodedToken, isMatchedToken } = verifyRefreshToken;
    // same token secretKey, we renew accessToken and make a new refreshToken
    if (isMatchedToken) {
      const secretKey = uuidv4();

      const accessTokenPayload: ITokenPayload = {
        secretKey,
        email: decodedToken.email,
        tokenId: decodedToken.tokenId,
      };
      // make new access token
      const accessToken = jwt.sign(accessTokenPayload, environment.JWTSECRET!, {
        expiresIn: environment.ACCESSTOKEN_EXP,
      });

      await prisma.token.update({
        where: {
          id: decodedToken.tokenId,
        },
        data: {
          secretKey,
        },
      });

      // make new refreshToken
      const refreshTokenPayload: ITokenPayload = {
        secretKey,
        email: decodedToken.email,
        tokenId: decodedToken.tokenId,
      };
      const refreshToken = jwt.sign(
        refreshTokenPayload,
        environment.JWTSECRET!,
        {
          expiresIn: environment.REFRESHTOKEN_EXP,
        }
      );

      return {
        accessToken,
        refreshToken,
        message: i18n.t(SuccessMessage.RENEW_ACCESS_TOKEN_SUCCESS),
        responseStatus: ResponseStatus.SUCCESS,
      };
    } else {
      // Delete old token and throw unauthorized error
      await prisma.token.delete({
        where: {
          id: decodedToken.tokenId,
        },
      });

      throw new ApiForbiddenError(i18n.t(ErrorMessage.USE_OLD_TOKEN));
    }
  }
  // Handle error if token is not found
  throw new ApiNotFoundError(ObjectMessage.TOKEN);
}

export async function checkUserLogin(
  checkUserLoginDto: CheckUserLoginDto
): Promise<IApiResponse> {
  const { accessToken } = checkUserLoginDto;
  // verify token
  const { user, token, isMatchedToken } = await verifyTokenUser(accessToken);

  if (!token) throw new ApiNotFoundError(ObjectMessage.TOKEN);

  if (!isMatchedToken)
    throw new ApiUnauthorizedError(i18n.t(ErrorMessage.TOKEN_NOT_MATCH));

  return {
    message: i18n.t(SuccessMessage.LOGIN_SUCCESS),
    responseStatus: ResponseStatus.SUCCESS,
    data: user,
  };
}

export async function logout(logoutDto: LogoutDto): Promise<IApiResponse> {
  const { accessToken } = logoutDto;

  const { token, isMatchedToken } = await verifyToken(accessToken);
  if (!token) throw new ApiNotFoundError(ObjectMessage.TOKEN);

  // verify token
  // if matched Token, logout from this divice
  if (!isMatchedToken)
    throw new ApiUnauthorizedError(i18n.t(ErrorMessage.TOKEN_NOT_MATCH));

  await prisma.token.deleteMany({
    where: {
      id: token.id,
    },
  });

  return {
    message: i18n.t(SuccessMessage.LOGIN_SUCCESS),
    responseStatus: ResponseStatus.SUCCESS,
  };
}

// logout user from all devices
export async function logoutAll(userId: number): Promise<IApiResponse> {
  await prisma.token.deleteMany({
    where: {
      userId,
    },
  });

  return {
    message: i18n.t(SuccessMessage.LOGOUT_ALL_DEVICES_SUCCESS),
    responseStatus: ResponseStatus.SUCCESS,
  };
}
