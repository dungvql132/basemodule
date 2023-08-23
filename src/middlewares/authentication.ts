import { type Request, type Response, type NextFunction } from "express";
import { verifyTokenUser } from "../module/auth/utils/verifyToken";
import {
  ApiMissingTokenError,
  ApiTokenExpiredError,
  ApiUnauthorizedError,
} from "@src/base/interface/ApiError";

export async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1]
    ? req.headers.authorization?.split(" ")[1]
    : req.headers.authorization?.split(" ")[0]; // Get token from Header Authorization

  if (!token) {
    return next(new ApiMissingTokenError());
  }

  try {
    const verifyAccessToken = await verifyTokenUser(token);
    const { user } = verifyAccessToken;

    req.user = user;

    next();
  } catch (error) {
    const err = error as Error;
    if (err.message === "jwt expired") {
      return next(new ApiTokenExpiredError());
    }
    return next(new ApiUnauthorizedError(err.message));
  }
}
