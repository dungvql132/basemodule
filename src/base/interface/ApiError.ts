import { Response } from "express";

// create Error for API
export class ApiError extends Error {
  message: string;
  errorResponseStatusCode: string;
  responseStatus: number;
  constructor(
    message: string,
    responseStatus: number,
    errorResponseStatusCode: string
  ) {
    super(message);
    this.responseStatus = responseStatus;
    this.errorResponseStatusCode = errorResponseStatusCode;
  }

  send(res: Response): void {
    const { message, errorResponseStatusCode, responseStatus } = this;
    res
      .status(this.responseStatus)
      .json({ message, errorResponseStatusCode, responseStatus });
  }
}
