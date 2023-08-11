import { NextFunction, Request, Response } from "express";
import { ApiResponse, IApiResponse } from "../interface/ApiResponse";
import { ResponseStatus } from "../config/responseStatus";
import { StatusCode } from "../config/statusCode";
import { ApiError } from "../interface/ApiError";

export function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    err.send(res);
  } else {
    if (process.env.NODE_ENV === "development") {
      return res.status(500).send(err);
    }

    const apiReponse: IApiResponse = {
      message: err.message,
      responseStatus: ResponseStatus.INTERNAL_ERROR,
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    };

    res.status(ResponseStatus.INTERNAL_ERROR).json(apiReponse);
  }
}
