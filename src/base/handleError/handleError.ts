import { NextFunction, Request, Response } from "express";
import { ApiResponse, IApiResponse } from "../interface/ApiResponse";
import { ResponseStatus } from "../config/ResponseStatus";
import { ErrorResponseStatusCode } from "../config/ErrorResponseStatusCode";
import { ApiError } from "../interface/ApiError";
import environment from "@src/base/config/env";

export function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    err.send(res);
  } else {
    if (environment.NODE_ENV === "development") {
      return res.status(500).send(err);
    }

    const apiError = new ApiError(
      err.message,
      ResponseStatus.INTERNAL_ERROR,
      ErrorResponseStatusCode.INTERNAL_SERVER_ERROR
    );

    apiError.send(res);
  }
}
