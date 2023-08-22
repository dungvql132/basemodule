// Import necessary modules and dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import environment from "@src/base/config/env";
import loggers from "@src/module/logs";
import { PrismaClient, User } from "@prisma/client";
import { RegisterDto } from "../dto/Register.dto";
import { LoginDto } from "../dto/Login.dto";
import { ITokenPayload } from "../interface/payload";
import { IApiResponse } from "@src/base/interface/ApiResponse";
import { v4 as uuidv4 } from "uuid";
import { RenewAccessTokenDto } from "../dto/RenewAccessToken.dto";
import { StatusCode } from "@src/base/config/statusCode";
import { ResponseStatus } from "@src/base/config/responseStatus";
import { ApiError } from "@src/base/interface/ApiError";
import { LogoutDto } from "../dto/Logout.dto";
import { CheckUserLoginDto } from "../dto/CheckUserLogin.dto";
import { verifyToken, verifyTokenUser } from "../utils/verifyToken";

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
    throw new ApiError(
      "duplicate user",
      ResponseStatus.DUPLICATE,
      StatusCode.DUPLICATE
    );
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
      throw new ApiError(
        "wrong password",
        ResponseStatus.BAD_REQUEST,
        StatusCode.BAD_REQUEST
      );
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

    // Construct the result object
    const result: IApiResponse = {
      accessToken,
      refreshToken,
      statusCode: StatusCode.SUCCESS,
      message: "login success",
      responseStatus: ResponseStatus.SUCCESS,
    };

    return result;
  }

  // Handle error if user is not found
  throw new ApiError(
    "user not found",
    ResponseStatus.NOT_FOUND,
    StatusCode.NOT_FOUND
  );
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

      // Construct the result object
      const result: IApiResponse = {
        accessToken,
        refreshToken,
        statusCode: StatusCode.SUCCESS,
        message: "renew access token success",
        responseStatus: ResponseStatus.SUCCESS,
      };

      return result;
    } else {
      // Delete old token and throw unauthorized error
      await prisma.token.delete({
        where: {
          id: decodedToken.tokenId,
        },
      });

      throw new ApiError(
        "use old token",
        ResponseStatus.UNAUTHORIZED,
        StatusCode.UNAUTHORIZED
      );
    }
  }

  // Handle error if token is not found
  throw new ApiError(
    "token not found",
    ResponseStatus.NOT_FOUND,
    StatusCode.NOT_FOUND
  );
}

export async function checkUserLogin(
  checkUserLoginDto: CheckUserLoginDto
): Promise<IApiResponse> {
  const { refreshToken, accessToken } = checkUserLoginDto;
  const tokens = [refreshToken, accessToken];
  let message = "";

  for (let index = 0; index < tokens.length; index++) {
    if (!tokens[index]) continue;

    console.log("token: ", tokens[index]);

    // verify token
    try {
      const verifyAccessToken = await verifyTokenUser(tokens[index]);
      const { user, isMatchedToken } = verifyAccessToken;

      // has user and matched token
      if (user && isMatchedToken) {
        const result: IApiResponse = {
          statusCode: StatusCode.SUCCESS,
          message: "User is login",
          responseStatus: ResponseStatus.SUCCESS,
          data: user,
        };
        return result;
      }
    } catch (error) {
      const err = error as Error;
      message = err.message;
      continue;
    }
  }

  if (message !== "") throw new Error(message);

  // Handle error if token is not found
  throw new ApiError(
    "Token not found",
    ResponseStatus.NOT_FOUND,
    StatusCode.NOT_FOUND
  );
}

export async function logout(logoutDto: LogoutDto): Promise<IApiResponse> {
  const { refreshToken, accessToken } = logoutDto;
  const tokens = [refreshToken, accessToken];
  let message = "";

  for (let index = 0; index < tokens.length; index++) {
    if (!tokens[index]) continue;
    // Verify the token
    try {
      const verifyAccessToken = await verifyToken(tokens[index]);
      const { token, isMatchedToken } = verifyAccessToken;

      // verify token
      if (token) {
        // if matched Token, logout from this divice
        if (!isMatchedToken)
          throw new ApiError(
            "UNAUTHORIZED",
            ResponseStatus.UNAUTHORIZED,
            StatusCode.UNAUTHORIZED
          );

        const deletedTokens = await prisma.token.deleteMany({
          where: {
            id: token.id,
          },
        });

        const result: IApiResponse = {
          statusCode: StatusCode.SUCCESS,
          message: "logout success",
          responseStatus: ResponseStatus.SUCCESS,
        };
        return result;
      }
    } catch (error) {
      const err = error as Error;
      message = err.message;
      continue;
    }
  }

  if (message !== "") throw new Error(message);

  // Handle error if token is not found
  throw new ApiError(
    "Token not found",
    ResponseStatus.NOT_FOUND,
    StatusCode.NOT_FOUND
  );
}

// logout user from all devices
export async function logoutAll(userId: number): Promise<IApiResponse> {
  const deletedTokens = await prisma.token.deleteMany({
    where: {
      userId,
    },
  });
  const result: IApiResponse = {
    statusCode: StatusCode.SUCCESS,
    message: "logout all devices success",
    responseStatus: ResponseStatus.SUCCESS,
  };
  return result;
}
