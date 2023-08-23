import i18n from "i18next";
import { Response } from "express";
import { ErrorResponseStatusCode } from "../config/ErrorResponseStatusCode";
import { ErrorMessage } from "../message";
import { ResponseStatus } from "../config/ResponseStatus";

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

// 400
export class ApiBadRequestError extends ApiError {
  constructor(message: string) {
    super(
      message,
      ResponseStatus.BAD_REQUEST,
      ErrorResponseStatusCode.BAD_REQUEST
    );
  }
}

// 401
export class ApiUnauthorizedError extends ApiError {
  constructor(message: string) {
    super(
      message,
      ResponseStatus.UNAUTHORIZED,
      ErrorResponseStatusCode.UNAUTHORIZED
    );
  }
}

export class ApiMissingTokenError extends ApiError {
  constructor(message: string = i18n.t(ErrorMessage.MISSING_TOKEN)) {
    super(
      message,
      ResponseStatus.UNAUTHORIZED,
      ErrorResponseStatusCode.UNAUTHORIZED
    );
  }
}

// 403

export class ApiForbiddenError extends ApiError {
  constructor(message: string) {
    super(
      message,
      ResponseStatus.FORBIDDEN,
      ErrorResponseStatusCode.FORBIDDEN_TOKEN_EXPIRED
    );
  }
}
export class ApiTokenExpiredError extends ApiError {
  constructor(message: string = i18n.t(ErrorMessage.TOKEN_EXPIRED)) {
    super(
      message,
      ResponseStatus.FORBIDDEN,
      ErrorResponseStatusCode.FORBIDDEN_TOKEN_EXPIRED
    );
  }
}

// 404 NOT_FOUND
export class ApiNotFoundError extends ApiError {
  constructor(
    target?: string,
    message: string = i18n.t(ErrorMessage.NOT_FOUND)
  ) {
    super(
      target ? `${target} ${message}` : message,
      ResponseStatus.NOT_FOUND,
      ErrorResponseStatusCode.NOT_FOUND
    );
  }
}

// 409 DUPLICATE
export class ApiDuplicateError extends ApiError {
  constructor(
    target?: string,
    message: string = i18n.t(ErrorMessage.DUPLICATE)
  ) {
    super(
      target ? `${target} ${message}` : message,
      ResponseStatus.DUPLICATE,
      ErrorResponseStatusCode.DUPLICATE
    );
  }
}

// 500 INTERNAL_SERVER_ERROR
export class ApiInternalServerErrorError extends ApiError {
  constructor(message: string) {
    super(
      message,
      ResponseStatus.INTERNAL_ERROR,
      ErrorResponseStatusCode.INTERNAL_SERVER_ERROR
    );
  }
}
