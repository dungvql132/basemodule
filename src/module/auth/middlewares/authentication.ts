import { type Request, type Response, type NextFunction } from "express";
import { verifyToken, verifyTokenUser } from "../utils/verifyToken";
import { ApiError } from "@src/base/interface/ApiError";
import { ResponseStatus } from "@src/base/config/responseStatus";
import { StatusCode } from "@src/base/config/statusCode";

export async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1]
    ? req.headers.authorization?.split(" ")[1]
    : req.headers.authorization?.split(" ")[0]; // Get token from Header Authorization

  if (!token) {
    return next(
      new ApiError(
        "Missing token",
        ResponseStatus.UNAUTHORIZED,
        StatusCode.UNAUTHORIZED
      )
    );
  }

  try {
    const verifyAccessToken = await verifyTokenUser(token);
    const { user } = verifyAccessToken;

    req.user = user;

    next();
  } catch (error) {
    const err = error as Error;
    if (err.message === "jwt expired") {
      return next(
        new ApiError(
          "jwt expired",
          ResponseStatus.FORBIDDEN,
          StatusCode.FORBIDDEN
        )
      );
    }
    return next(
      new ApiError(
        err.message,
        ResponseStatus.UNAUTHORIZED,
        StatusCode.UNAUTHORIZED
      )
    );
  }
}
