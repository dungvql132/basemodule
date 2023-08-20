import { PrismaClient, Token, User } from "@prisma/client";
import { ITokenPayload } from "../interface/payload";
import environment from "@src/base/config/env";
import jwt from "jsonwebtoken";
import { ApiError } from "@src/base/interface/ApiError";
import { ResponseStatus } from "@src/base/config/responseStatus";
import { StatusCode } from "@src/base/config/statusCode";
const prisma = new PrismaClient();

export async function verifyToken(token: string | null | undefined): Promise<{
  decodedToken: ITokenPayload;
  token: Token;
  isMatchedToken: boolean;
}> {
  const decodedToken = jwt.verify(
    token!,
    environment.JWTSECRET!
  ) as ITokenPayload;

  const tokenFound = await prisma.token.findFirst({
    where: {
      id: decodedToken.tokenId,
    },
  });

  if (!tokenFound)
    throw new ApiError(
      "Token not found",
      ResponseStatus.NOT_FOUND,
      StatusCode.NOT_FOUND
    );

  let isMatchedToken = false;
  if (tokenFound && tokenFound.secretKey === decodedToken.secretKey) {
    isMatchedToken = true;
  }

  return {
    isMatchedToken,
    decodedToken,
    token: tokenFound,
  };
}

export async function verifyTokenUser(
  token: string | null | undefined
): Promise<{
  decodedToken: ITokenPayload;
  user: User;
  token: Token;
  isMatchedToken: boolean;
}> {
  const {
    isMatchedToken,
    decodedToken,
    token: tokenFound,
  } = await verifyToken(token);

  const user = await prisma.user.findFirst({
    where: {
      email: decodedToken.email,
      active: true,
    },
  });

  if (!user)
    throw new ApiError(
      "User not found",
      ResponseStatus.NOT_FOUND,
      StatusCode.NOT_FOUND
    );

  return {
    isMatchedToken,
    decodedToken,
    user,
    token: tokenFound,
  };
}
