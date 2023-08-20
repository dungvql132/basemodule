import { Response } from "express";

// create Error for API
export class ApiError extends Error {
  message: string;
  statusCode: string;
  responseStatus: number;
  constructor(message, responseStatus, statusCode) {
    super(message);
    this.responseStatus = responseStatus;
    this.statusCode = statusCode;
  }

  send(res: Response): void {
    const { message, statusCode, responseStatus } = this;
    res
      .status(this.responseStatus)
      .json({ message, statusCode, responseStatus });
  }
}
