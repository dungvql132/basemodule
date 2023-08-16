// Import necessary modules and dependencies
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
import environment from "@src/base/config/env";

// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Function to register a new user
export async function register(createUserDto: CreateUserDto): Promise<User> {
  const { email, name, password, age } = createUserDto;

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

  return newUser;
}

// Function for user login
export async function login(loginUserDto: LoginUserDto): Promise<IApiResponse> {
  const { email, password } = loginUserDto;
  let accessToken = "";
  let refreshToken = "";

  // Check if the user exists and JWTSECRET is set
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (checkUser && environment.JWTSECRET) {
    // Generate tokens and handle login
    const secretKey = uuidv4();
    const newToken = await prisma.token.create({
      data: {
        secretKey,
        exp: moment(moment()).add(30, "days").toISOString(),
        userId: checkUser.id,
      },
    });

    const accessTokenPayload: IAccessTokenPayload = { email };
    const isPasswordValid = bcrypt.compareSync(password, checkUser.password);

    if (!isPasswordValid) {
      throw new ApiError(
        "wrong password",
        ResponseStatus.BAD_REQUEST,
        StatusCode.BAD_REQUEST
      );
    }

    accessToken = jwt.sign(accessTokenPayload, environment.JWTSECRET);

    const refreshTokenPayload: IRefreshTokenPayload = {
      email,
      secretKey,
      id: newToken.id,
    };
    refreshToken = jwt.sign(refreshTokenPayload, environment.JWTSECRET);

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

  // Verify the refresh token and handle renewal
  const decodedToken = jwt.verify(
    refreshToken,
    environment.JWTSECRET!
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
      const accessToken = jwt.sign(accessTokenPayload, environment.JWTSECRET!);
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
        environment.JWTSECRET!
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

  // Handle error if token is not found
  throw new ApiError(
    "token not found",
    ResponseStatus.NOT_FOUND,
    StatusCode.NOT_FOUND
  );
}
